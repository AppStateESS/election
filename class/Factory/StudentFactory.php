<?php

namespace election\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class StudentFactory extends Base
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
