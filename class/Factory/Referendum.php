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
        $referendum = self::build(self::pullPostInteger('referendumId'), new Resource);

        $referendum->setTitle(self::pullPostString('title'));
        $referendum->setDescription(self::pullPostString('description'));

        self::saveResource($referendum);
    }

    public static function delete($referendumId)
    {
        $referendum = self::build($referendumId, new Resource);
        $referendum->setActive(false);
        self::saveResource($referendum);
        Ticket::deleteByBallotId($referendumId);
    }

    public static function getList($electionId)
    {
        if (empty($electionId)) {
            throw new \Exception('Empty election id');
        }
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_referendum');
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
