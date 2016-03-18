<?php

namespace election\Factory;

use election\Resource\Single as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Single extends Ballot
{

    public static function post()
    {
        $electionId = self::pullPostInteger('electionId');
        $singleId = self::pullPostInteger('singleId');
        
        if (!$singleId && !Election::allowChange($electionId)) {
            throw new \Exception('Cannot save new ballot in ongoing election');
        }
        $single = self::build($singleId, new Resource);
        $single->setTitle(self::pullPostString('title'));
        $single->setElectionId($electionId);

        self::saveResource($single);
    }

    public static function delete($singleId)
    {
        if (empty($singleId)) {
            throw new \Exception('Missing id');
        }
        $single = self::build($singleId, new Resource);
        $single->setActive(false);
        self::saveResource($single);
    }

    public static function getList($electionId)
    {
        return parent::ballotList($electionId, 'elect_single');
    }

    /**
     * Returns a list of single ballots with included tickets.
     * 
     * Tickets ARE REQUIRED. A ballot without tickets will be unset.
     * 
     * @param type $electionId
     * @param type $addCandidates
     * @return array
     */
    public static function getListWithTickets($electionId, $addCandidates = true, $randomize=ELECTION_RANDOMIZE_TICKETS)
    {
        $singleList = self::getList($electionId);
        if (empty($singleList)) {
            return array();
        }

        foreach ($singleList as $key => &$value) {
            $tickets = null;
            if ($addCandidates) {
                $tickets = Ticket::getListWithCandidates($value['id'], $randomize);
            } else {
                $tickets = Ticket::getList($value['id'], $randomize);
            }
            if (empty($tickets)) {
                unset($singleList[$key]);
            } else {
                $value['tickets'] = $tickets;
            }
        }
        return $singleList;
    }

}
