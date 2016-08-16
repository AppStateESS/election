<?php

namespace election\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Vote extends Base
{

    public static function post(\election\Resource\Student $student)
    {
        $request = \Server::getCurrentRequest();

        // Vote is for the current logged student only. We do not depend on the post.
        $election = Election::getCurrent();
        $election_id = $election['id'];

        $election_id_match = $request->getVar('electionId');

        if ($election_id_match != $election_id) {
            throw new \Exception('Election id does not match current election');
        }

        // need to start a transaction here
        $db = \Database::getDB();
        $db->begin(true);

        if ($request->isVar('single')) {
            $single_result = $request->getVar('single');
            self::saveSingleResult($election_id, $single_result, $student);
        }

        if ($request->isVar('multiple')) {
            $multiple_result = $request->getVar('multiple');
            self::saveMultipleResult($election_id, $multiple_result, $student);
        }

        if ($request->isVar('referendum')) {
            $referendum_result = $request->getVar('referendum');
            self::saveReferendumResult($election_id, $referendum_result, $student);
        }

        self::complete($election_id, $student->getBannerId());
        $db->commit();
        self::emailStudent($student, $election);
        
        $json['surveyLink'] = \PHPWS_Settings::get('election', 'surveyLink');
        $json['supportLink'] = \PHPWS_Settings::get('election', 'surveyLink');
        $json['success'] = true;
        return $json;
    }

    private static function saveSingleResult($election_id, array $single_result, \election\Resource\Student $student)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_single_chair_vote');
        foreach ($single_result as $vote) {
            $voter_hash = StudentFactory::getVoteHash($vote['singleId'], $student->getBannerId());
            $tbl->addValue('voterHash', $voter_hash);
            $tbl->addValue('electionId', $election_id);
            $tbl->addValue('singleId', $vote['singleId']);
            $tbl->addValue('ticketId', $vote['ticketId']);
            $tbl->insert();
            $tbl->resetValues();
        }
    }
    
    private static function emailStudent(\election\Resource\Student $student, array $election)
    {
        if (STUDENT_DATA_TEST) {
            $email_address = TEST_STUDENT_EMAIL;
        } else {
            $email_address = $student->getEmail();
        }
        $transport = \Swift_MailTransport::newInstance();
        
        $template = new \Template;
        $template->setModuleTemplate('election', 'Admin/VoteSuccess.html');
        $template->add('title', $election['title']);
        $content = $template->get();
        
        $message = \Swift_Message::newInstance();
        $message->setSubject('Vote complete');
        $message->setFrom(\PHPWS_Settings::get('election', 'fromAddress'));
        $message->setTo($email_address);
        $message->setBody($content, 'text/html');
        
        $mailer = \Swift_Mailer::newInstance($transport);
        $mailer->send($message);
    }

    private static function saveMultipleResult($election_id, $multiple_result, \election\Resource\Student $student)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_multi_chair_vote');
        foreach ($multiple_result as $vote) {
            // the abstained from everything
            if (!isset($vote['chairs'])) {
                continue;
            }
            $voted = array();
            $multiple = Multiple::build($vote['multipleId'], new \election\Resource\Multiple());
            $seatNumber = $multiple->getSeatNumber();
            $voter_hash = StudentFactory::getVoteHash($vote['multipleId'], $student->getBannerId());
            // Remove previous votes on this hash. We do this because we can't use the
            // unique index to prevent duplicates.
            $tbl->addFieldConditional('voterHash', $voter_hash);
            $db->delete();
            $db->clearConditional();

            $tbl->addValue('voterHash', $voter_hash);
            $tbl->addValue('electionId', $election_id);
            $tbl->addValue('multipleId', $vote['multipleId']);
            $count = 0;
            foreach ($vote['chairs'] as $candidateId) {
                // security against over voting.
                if ($count >= $seatNumber) {
                    break;
                }
                // extra security against multiples votes for same candidate
                // unique index on database will prevent this as well.
                if (in_array($candidateId, $voted)) {
                    continue;
                }
                $voted[] = $candidateId;
                $tbl->addValue('candidateId', $candidateId);
                $tbl->insert();
                $count++;
            }
            $tbl->resetValues();
        }
    }

    private static function saveReferendumResult($election_id, $referendum_result, \election\Resource\Student $student)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_referendum_vote');

        foreach ($referendum_result as $vote) {
            $voter_hash = StudentFactory::getVoteHash($vote['referendumId'], $student->getBannerId());

            $tbl->addValue('voterHash', $voter_hash);
            $tbl->addValue('electionId', $election_id);
            $tbl->addValue('referendumId', $vote['referendumId']);
            $tbl->addValue('answer', $vote['answer']);
            $tbl->insert();
            $tbl->resetValues();
        }
    }

    private static function complete($election_id, $banner_id)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_vote_complete');
        $tbl->addValue('electionId', $election_id);
        $tbl->addValue('bannerId', $banner_id);
        $db->insert();
    }

    public static function getSingleVotes($electionId)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_single_chair_vote');
        $tbl->addFieldConditional('electionId', $electionId);
        $single = $tbl->addField('singleId');
        $ticket = $tbl->addField('ticketId');
        $tbl->addField(new \Database\Expression('count(electionId)', 'votes'));
        $db->setGroupBy(array($single, $ticket));
        $result = $db->select();
        return $result;
    }

    public static function getMultipleVotes($electionId)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_multi_chair_vote');
        $tbl->addFieldConditional('electionId', $electionId);
        $multiple = $tbl->addField('multipleId');
        $candidate = $tbl->addField('candidateId');
        $tbl->addField(new \Database\Expression('count(electionId)', 'votes'));
        $db->setGroupBy(array($multiple, $candidate));
        $result = $db->select();
        return $result;
    }

    public static function getReferendumVotes($electionId)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_referendum_vote');
        $tbl->addFieldConditional('electionId', $electionId);
        $referendum = $tbl->addField('referendumId');
        $answer = $tbl->addField('answer');
        $tbl->addField(new \Database\Expression('count(electionId)', 'votes'));
        $db->setGroupBy(array($referendum, $answer));
        $result = $db->select();
        return $result;
    }

}
