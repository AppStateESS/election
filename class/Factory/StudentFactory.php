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
    public static function getVoteHash($salt, $banner_id)
    {
        $provider = StudentProviderFactory::getProvider();
        return md5($banner_id . $salt);
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
