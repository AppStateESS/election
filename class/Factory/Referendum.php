<?php

namespace election\Factory;

use election\Resource\Referendum as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Referendum extends Base
{

    public static function post()
    {
        $electionId = self::pullPostInteger('electionId');

        if (!Election::allowChange($electionId)) {
            throw new \Exception('Cannot save new referendum in ongoing election.');
        }

        $referendumId = self::pullPostInteger('referendumId');
        $referendum = self::build($referendumId, new Resource);

        $referendum->setTitle(self::pullPostString('title'));
        $referendum->setDescription(self::pullPostString('description'));
        $referendum->setElectionId($electionId);

        self::saveResource($referendum);
    }

    public static function delete($referendumId)
    {
        if (empty($referendumId)) {
            throw new \Exception('Missing id');
        }
        $referendum = self::build($referendumId, new Resource);
        $electionId = $referendum->getElectionId();
        if (!Election::allowChange($electionId)) {
            throw new \Exception('Cannot referendum in ongoing election');
        }
        $referendum->setActive(false);
        self::saveResource($referendum);
    }

    public static function getList($electionId)
    {
        if (empty($electionId)) {
            throw new \Exception('Empty election id');
        }
        $db = \phpws2\Database::getDB();
        $tbl = $db->addTable('elect_referendum');
        $tbl->addOrderBy('title');
        $tbl->addFieldConditional('electionId', $electionId);
        $tbl->addFieldConditional('active', 1);
        $result = $db->select();
        if (empty($result)) {
            return array();
        }
        if (empty($result)) {
            $result = array();
        }
        return $result;
    }

}
