<?php

namespace election\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Report extends Base
{

    public static function getSingleResults($electionId)
    {
        $singles = Single::getListWithTickets($electionId, true, false);
        $votes = Vote::getSingleVotes($electionId);
        if (empty($votes)) {
            return self::noTicketVotes();
        }

        foreach ($votes as $v) {
            $key = $v['singleId'];
            $sorted_votes[$key][$v['ticketId']] = $v['votes'];
        }

        // sorted_votes   array(singleId => array(ticketId => votes))
        if (empty($singles)) {
            return null;
        }
        
        foreach ($singles as $ballot) {
            $ballot_row['title'] = $ballot['title'];
            foreach ($ballot['tickets'] as $ticket) {
                if (isset($sorted_votes[$ticket['singleId']][$ticket['id']])) {
                    $vote = $sorted_votes[$ticket['singleId']][$ticket['id']];
                    $ticket['votes'] = $vote;
                    $ticket_rows[$vote . '.' . $ticket['id']] = self::ticketTemplate($ticket);
                }
            }
                krsort($ticket_rows);
                $ballot_row['tickets'] = implode("\n", $ticket_rows);
                $tpl['ballots'][] = $ballot_row;
            }
        $template = new \Template;
        $template->addVariables($tpl);
        $template->setModuleTemplate('election', 'Admin/Report/Single.html');
        return $template->get();
    }

    private static function ticketTemplate($ticket)
    {
        foreach ($ticket['candidates'] as $c) {
            $candidates[] = '<img class="pull-left pad-right" src="' . $c['picture'] . '" style="max-width : 75px;max-height: 75px" />';
        }
        $ticket['candidates'] = implode("\n", $candidates);
        $template = new \Template;
        $template->addVariables($ticket);
        $template->setModuleTemplate('election', 'Admin/Report/Ticket.html');
        return $template->get();
    }

    public static function getMultipleResults($electionId)
    {
        $multiples = Multiple::getListWithCandidates($electionId);

        if (empty($multiples)) {
            return null;
        }
        $votes = Vote::getMultipleVotes($electionId);
        if (empty($votes)) {
            return 'No multiple chair votes recorded.';
        }

        foreach ($votes as $v) {
            $key = $v['multipleId'];
            $sorted_votes[$key][$v['candidateId']] = $v['votes'];
        }
        foreach ($multiples as $ballot) {
            $ballot_row['title'] = $ballot['title'];
            $ballot_row['seats'] = $ballot['seatNumber'];
            $candidates = array();
            foreach ($ballot['candidates'] as $c) {
                if (isset($sorted_votes[$ballot['id']][$c['id']])) {
                    $vote = $sorted_votes[$ballot['id']][$c['id']];
                    $template = new \Template;
                    $template->setModuleTemplate('election', 'Admin/Report/Candidate.html');
                    $template->add('name', $c['firstName'] . ' ' . $c['lastName']);
                    $template->add('vote', $vote);
                    $template->add('picture', $c['picture']);
                    $candidates[$vote . '.' . $c['id']] = $template->get();
                }
            }
            if (!empty($candidates)) {
                krsort($candidates);
                $ballot_row['candidates'] = implode("\n", $candidates);
            } else {
                $ballot_row['candidates'] = self::noCandidateVotes();
            }
            $tpl['ballots'][] = $ballot_row;
        }

        $template = new \Template;
        $template->addVariables($tpl);
        $template->setModuleTemplate('election', 'Admin/Report/Multiple.html');
        return $template->get();
    }

    private static function noCandidateVotes()
    {
        static $noVotes;
        
        if (empty($noVotes)) {
            $tpl = new \Template;
            $tpl->setModuleTemplate('election', 'Admin/Report/NoCandidateVotesMultiple.html');
            $noVotes = $tpl->get();
        }
        return $noVotes;
    }
    
    private static function noTicketVotes()
    {
        static $noVotes;
        
        if (empty($noVotes)) {
            $tpl = new \Template;
            $tpl->setModuleTemplate('election', 'Admin/Report/NoTicketVotesSingle.html');
            $noVotes = $tpl->get();
        }
        return $noVotes;
    }
    
    public static function getReferendumResults($electionId)
    {
        $referendums = Referendum::getList($electionId);
        $votes = Vote::getReferendumVotes($electionId);

        if (empty($referendums)) {
            return null;
        }

        foreach ($votes as $v) {
            $key = $v['referendumId'];
            $sorted_votes[$key][$v['answer']] = $v['votes'];
        }

        foreach ($referendums as $ref) {
            $ref_row['title'] = $ref['title'];
            $ref_row['yes'] = isset($sorted_votes[$ref['id']]['yes']) ? $sorted_votes[$ref['id']]['yes'] : 0;
            $ref_row['no'] = isset($sorted_votes[$ref['id']]['no']) ? $sorted_votes[$ref['id']]['no'] : 0;
            $ref_row['abstain'] = isset($sorted_votes[$ref['id']]['abstain']) ? $sorted_votes[$ref['id']]['abstain'] : 0;

            $tpl['referendums'][] = $ref_row;
        }

        $template = new \Template;
        $template->setModuleTemplate('election', 'Admin/Report/Referendum.html');
        $template->addVariables($tpl);
        return $template->get();
    }

}
