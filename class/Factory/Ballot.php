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
        $ballot->setStartDate(self::pullPostString('startDate'));
        $ballot->setEndDate(self::pullPostString('endDate'));
        
        $seats = self::pullPostInteger('seatNumber');
        if ($seats) {
            // no seats will set as single seat ballot
            $ballot->setSeatNumber($seats);
        }
        
        self::saveResource($ballot);
    }

    /**
     * 
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
        foreach ($result as $key=>$val) {
            $val['start_date_formatted'] = strftime(ELECTION_DATETIME_FORMAT, $val['start_date']);
            $val['end_date_formatted'] = strftime(ELECTION_DATETIME_FORMAT, $val['end_date']);
            $result[$key] = $val;
        }
        return $result;
    }

    
    public static function build($id = 0)
    {
        $ballot = new Resource;
        if ($id) {
            $ballot->setId($id);
            if (!parent::loadByID($ballot)) {
                throw new \Exception('Ballot id not found:' . $id);
            }
        }
        return $ballot;
    }

}
