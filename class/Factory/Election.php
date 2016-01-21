<?php

namespace election\Factory;

use election\Resource\Election as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Election extends Base
{

    public static function post()
    {
        $election = self::build(self::pullPostInteger('electionId'), new Resource);

        $election->setTitle(self::pullPostString('title'));
        $election->setStartDate(self::pullPostInteger('startDate'), false);
        $election->setEndDate(self::pullPostInteger('endDate'), false);

        self::saveResource($election);
    }

    public static function delete($electionId)
    {
        $election = self::build($electionId, new Resource);
        $election->setActive(false);
        self::saveResource($election);
    }

    /**
     * @return array
     */
    public static function getList()
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_election');
        $tbl->addOrderBy('endDate');
        $tbl->addFieldConditional('active', 1);
        $result = $db->select();
        if (empty($result)) {
            return $result;
        }
        foreach ($result as $key => &$val) {
            $val['startDateFormatted'] = date(ELECTION_DATETIME_FORMAT, $val['startDate']);
            $val['endDateFormatted'] = date(ELECTION_DATETIME_FORMAT, $val['endDate']);
        }
        return $result;
    }

}
