<?php

namespace election\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Vote extends Base
{

    public static function post()
    {
        $request = \Server::getCurrentRequest();

        // Vote is for the current logged student only. We do not depend on the post.
        $banner_id = Student::getBannerId();
        $election = Election::getCurrent();
        $election_id = $election['id'];

        $election_id_match = $request->getVar('electionId');

        if ($election_id_match != $election_id) {
            throw new \Exception('Election id does not match current election');
        }

        $single_result = $request->getVar('single');
        $multiple_result = $request->getVar('multiple');
        $referendum_result = $request->getVar('referendum');

        // need to start a transaction here
        $db = \Database::getDB();
        $db->begin(true);
        self::saveSingleResult($election_id, $single_result);
        self::saveMultipleResult($election_id, $multiple_result);
        self::saveReferendumResult($election_id, $referendum_result);
        self::complete($election_id);
        $db->commit();
    }

    private static function saveSingleResult($election_id, array $single_result)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_single_chair_vote');
        foreach ($single_result as $vote) {
            $voter_hash = Student::getVoteHash($vote['singleId']);
            $tbl->addValue('voterHash', $voter_hash);
            $tbl->addValue('electionId', $election_id);
            $tbl->addValue('singleId', $vote['singleId']);
            $tbl->addValue('ticketId', $vote['ticketId']);
            $tbl->insert();
            $tbl->resetValues();
        }
    }

    private static function saveMultipleResult($election_id, $multiple_result)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_multi_chair_vote');
        
        foreach ($multiple_result as $vote) {
            $voted = array();
            $multiple = Multiple::build($vote['multipleId'], new \election\Resource\Multiple());
            $seatNumber = $multiple->getSeatNumber();
            $voter_hash = Student::getVoteHash($vote['multipleId']);
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

    private static function saveReferendumResult($election_id, $referendum_result)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_referendum_vote');
        foreach ($referendum_result as $vote) {
            $voter_hash = Student::getVoteHash($vote['referendumId']);
            
            $tbl->addValue('voterHash', $voter_hash);
            $tbl->addValue('electionId', $election_id);
            $tbl->addValue('referendumId', $vote['referendumId']);
            $tbl->addValue('answer', Referendum::getAnswer($vote['answer']));
            $tbl->insert();
            $tbl->resetValues();
        }
    }

    private static function complete($election_id)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_vote_complete');
        $banner_id = Student::getBannerId();
        $tbl->addValue('electionId', $election_id);
        $tbl->addValue('bannerId', $banner_id);
        $db->insert();
    }

}
