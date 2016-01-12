<?php

namespace election\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Student extends Base
{

    public static function buildHash($username, $ballotId)
    {
        return md5($username . $ballotId);
    }

}
