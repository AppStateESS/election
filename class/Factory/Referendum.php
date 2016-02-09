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
        $referendum->setElectionId(self::pullPostInteger('electionId'));

        self::saveResource($referendum);
    }

    public static function delete($referendumId)
    {
        if (empty($referendumId)) {
            throw new \Exception('Missing id');
        }
        $referendum = self::build($referendumId, new Resource);
        $referendum->setActive(false);
        self::saveResource($referendum);
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
        if (empty($result)) {
            $result = array();
        }
        return $result;
    }
    
    /**
     * Returns an answer response (yes, no, abstain) based on the answer parameter
     * @param mixed $answer
     */
    public static function getAnswer($answer)
    {
        if ($answer == 'true' || $answer === true) {
            return 'yes';
        } elseif ($answer == 'false' || $answer === false) {
            return 'no';
        } elseif (is_null($answer) || $answer === 'null') {
            return 'abstain';
        } else {
            throw new \Expection('Unknown answer');
        }
    }
}
