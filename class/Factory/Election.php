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
        if (empty($electionId)) {
            throw new \Exception('Missing id');
        }
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
        $tbl2 = $db->addTable('elect_vote_complete', null, false);
        $exp = $db->getExpression('count(' . $tbl2->getField('electionId') . ')', 'totalVotes');
        $db->addExpression($exp);
        $tbl->addOrderBy('endDate', 'desc');
        $tbl->addFieldConditional('active', 1);
        
        $join_conditional = $db->createConditional($tbl->getField('id'), $tbl2->getField('electionId'));
        $db->joinResources($tbl, $tbl2, $join_conditional, 'left');
        $result = $db->select();
        if (empty($result)) {
            return $result;
        }
        $now = time();
        foreach ($result as $key => &$val) {
            self::plugExtraValues($val);
        }
        return $result;
    }

    public static function getFilterTypes()
    {
        $filename = PHPWS_SOURCE_DIR . 'mod/election/electionTypes.json';
        return file_get_contents($filename);
    }

    public static function plugExtraValues(&$val)
    {
        $now = time();
        $val['startDateFormatted'] = date(ELECTION_DATETIME_FORMAT, $val['startDate']);
        $val['endDateFormatted'] = date(ELECTION_DATETIME_FORMAT, $val['endDate']);
        $val['past'] = $now > $val['endDate'];
    }

    /**
     * Get the current election
     * @return Array|boolean Returns array of the current election if one exists, otherwise returns false
     */
    public static function getCurrent()
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_election');
        $now = time();
        $tbl->addFieldConditional('startDate', $now, '<=');
        $tbl->addFieldConditional('endDate', $now, '>=');
        $tbl->addFieldConditional('active', 1);

        return $db->selectOneRow();
    }

    /**
     * Returns true is startDate and endDate fall within another election
     * @param integer $startDate
     * @param integer $endDate
     * @param integer $electionId
     * @return boolean
     */
    public static function checkForConflict($startDate, $endDate, $electionId)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_election');
        $tbl->addFieldConditional('id', $electionId, '!=');
        $tbl->addFieldConditional('active', 1);

        $startField = $tbl->getField('startDate');
        $endField = $tbl->getField('endDate');

        $c1a = $db->createConditional($startField, $startDate, '<');
        $c1b = $db->createConditional($endField, $startDate, '>');
        $c1ab = $db->createConditional($c1a, $c1b, 'and');

        $c2a = $db->createConditional($startField, $endDate, '<');
        $c2b = $db->createConditional($endField, $endDate, '>');
        $c2ab = $db->createConditional($c2a, $c2b, 'and');

        $c12 = $db->createConditional($c1ab, $c2ab, 'or');

        $db->addConditional($c12);
        $result = $db->selectOneRow();
        return array('conflict' => (bool) $result);
    }

}
