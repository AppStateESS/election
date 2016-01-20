<?php

namespace election\Factory;

use election\Resource\Ballot as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Ballot extends Base
{

    public static function post()
    {
        $ballot = self::build(self::pullPostInteger('ballotId'), new Resource);
        
        $ballot->setTitle(self::pullPostString('title'));
        
        $seats = self::pullPostInteger('seatNumber');
        if ($seats) {
            // no seats will set as single seat ballot
            $ballot->setSeatNumber($seats);
        }
        
        self::saveResource($ballot);
    }
    
    public static function delete($ballotId)
    {
        $ballot = self::build($ballotId, new Resource);
        $ballot->setActive(false);
        self::saveResource($ballot);
        Ticket::deleteByBallot($ballotId);
    }

    /**
     * @return array
     */
    public static function getList($multiple_chair=0)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_ballot');
        $tbl->addOrderBy('title');
        if ($multiple_chair) {
            $tbl->addFieldConditional('seatNumber', 1, '>');
        }
        $tbl->addFieldConditional('active', 1);
        $result = $db->select();
        return $result;
    }
    
    public static function deleteByElectionId($electionId)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_ballot');
        $tbl->addFieldCondtional('electionId', $electionId);
        $tbl->addValue('active', 0);
        $db->update();
    }

}
