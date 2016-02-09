<?php

namespace election\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Student extends Base
{

    /**
     * Creates a hash using the student banner id and the passed value
     * @param integer $id
     * @return string
     */
    public static function getVoteHash($salt)
    {
        return md5(self::getBannerId() . $salt);
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

    /**
     * Determines whether a student has voted in given election
     *
     * @param   int $electionId The id of the election to check for votes in
     * @param   int $bannerId The banner ID of the student to check for votes from
     * @return  bool True if the student has voted in the given election, false otherwise
     */
    public static function hasVoted($electionId, $bannerId)
    {
        if(!isset($electionId) || $electionId == ''){
            throw new \InvalidArgumentException('Missing election id.');
        }

        if(!isset($bannerId) || $bannerId == ''){
            throw new \InvalidArgumentException('Missing banner ID.');
        }

        $db = \Database::getDB();
        $vote = $db->addTable('elect_vote_complete');
        $vote->addFieldConditional('electionId', $electionId);
        $vote->addFieldConditional('bannerId', $bannerId);
        $result = $db->selectOneRow();
        return (bool)$result;
    }

    public static function getStudentByUsername($username)
    {
        //TODO sanity checking on username format

        $provider = StudentProviderFactory::getProvider();

        return $provider->getStudent($username);
    }

    public static function getStudentByBannerId($bannerId)
    {
        // TODO sanity checking on banner ID format

        $provider = StudentProviderFactory::getProvider();

        return $provider->getStudent($bannerId);
    }
}
