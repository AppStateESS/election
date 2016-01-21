<?php

namespace election\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
abstract class Ballot extends Base
{

    /**
     * @return array
     */
    protected static function ballotList($electionId, $table)
    {
        if (empty($electionId)) {
            throw new \Exception('Empty election id');
        }
        $db = \Database::getDB();
        $tbl = $db->addTable($table);
        $tbl->addOrderBy('title');
        $tbl->addFieldConditional('electionId', $electionId);
        $tbl->addFieldConditional('active', 1);
        $result = $db->select();
        if (empty($result)) {
            return array();
        }
        return $result;
    }
}
