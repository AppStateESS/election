<?php

namespace election\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Student extends Base
{

    public static function getSingleHash($singleId)
    {
        return md5(self::getBannerId() . $singleId);
    }

    public static function getMultipleHash($multipleId)
    {
        return md5(self::getBannerId() . $multipleId);
    }

    public static function getReferendumHash($referendumId)
    {
        return md5(self::getBannerId() . $referendumId);
    }

    /**
     *  \/\/\ \___/ /\/\/      
     *       \     /           
     *       /_   _\         A A A
     *      // \ / \\        | | |
     *     / \o/ \o/ \       `-+-'
     *    |     V     |        |
     *     \ _______ /         |
     *      \\!!!!!//          |
     *       \\___//           |
     *        \___/            |
     */
    public static function getBannerId()
    {
        return 666;
    }
    
    public static function hasVoted($electionId)
    {
        $db = \Database::getDB();
        $vote = $db->addTable('elect_vote_complete');
        $vote->addFieldConditional('bannerId', self::getBannerId());
        $result = $db->selectOneRow();
        return (bool)$result;
    }

}
