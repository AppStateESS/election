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
        $ballot = self::build(self::pullPostInteger('ballotId'));
        
        $ballot->setTitle(self::pullPostString('title'));
        $ballot->setStartDate(self::pullPostInteger('startDate'), false);
        $ballot->setEndDate(self::pullPostInteger('endDate'), false);
        
        $seats = self::pullPostInteger('seatNumber');
        if ($seats) {
            // no seats will set as single seat ballot
            $ballot->setSeatNumber($seats);
        }
        
        self::saveResource($ballot);
    }
    
    public static function delete($ballot_id)
    {
        $ballot = self::build($ballot_id, new Resource);
        $ballot->setActive(false);
        self::saveResource($ballot);
        Ticket::deleteByBallot($ballot_id);
    }

    /**
     * @return array
     */
    public static function getList()
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_ballot');
        $tbl->addOrderBy('end_date');
        $tbl->addFieldConditional('active', 1);
        $result = $db->select();
        if (empty($result)) {
            return $result;
        }
        foreach ($result as $key=>&$val) {
            $val['start_date_formatted'] = date(ELECTION_DATETIME_FORMAT, $val['start_date']);
            $val['end_date_formatted'] = date(ELECTION_DATETIME_FORMAT, $val['end_date']);
        }
        return $result;
    }

}
