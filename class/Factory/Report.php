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

        foreach ($votes as $v) {
            $key = $v['singleId'];
            $sorted_votes[$key][$v['ticketId']] = $v['votes'];
        }

        // sorted_votes   array(singleId => array(ticketId => votes))
        if (empty($singles)) {
            return null;
        }

        foreach ($singles as $ballot) {
            //var_dump($ballot);
            $highest_vote = 0;
            $highest_ticket = null;
            $tied = null;
            $ballot_row['title'] = $ballot['title'];
            foreach ($ballot['tickets'] as $ticket) {
                $vote = $sorted_votes[$ticket['singleId']][$ticket['id']];
                $ticket['votes'] = $vote;
                $ticket_rows[$vote . '.' . $ticket['id']] = self::ticketTemplate($ticket);
            /*
                
                
                
                if ($vote > $highest_vote) {
                    $highest_ticket = $ticket;
                    $highest_vote = $vote;
                    $tied = null;
                } elseif ($vote == $highest_vote) {
                    if (empty($tied)) {
                        $tied[] = $highest_ticket;
                    }
                    $tied[] = $ticket;
                }
             * 
             */
            }
            krsort($ticket_rows);
            $ballot_row['tickets'] = implode("\n", $ticket_rows);
            /*
            if (!empty($tied)) {
                $ballot['winning_ticket'] = $tied;
            } else {
                $ballot['winning_ticket'] = $highest_ticket;
            }
             */
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
        
    }

    public static function getReferendumResults($electionId)
    {
        
    }

}
