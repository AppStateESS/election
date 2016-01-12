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
        $ballot->setStartDate(self::pullPostInteger('startDate'), false);
        $ballot->setEndDate(self::pullPostInteger('endDate'), false);
        
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
    public static function getList()
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_ballot');
        $tbl->addOrderBy('endDate');
        $tbl->addFieldConditional('active', 1);
        $result = $db->select();
        if (empty($result)) {
            return $result;
        }
        foreach ($result as $key=>&$val) {
            $val['startDateFormatted'] = date(ELECTION_DATETIME_FORMAT, $val['startDate']);
            $val['endDateFormatted'] = date(ELECTION_DATETIME_FORMAT, $val['endDate']);
        }
        return $result;
    }

}
