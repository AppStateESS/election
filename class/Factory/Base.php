<?php

namespace election\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Base extends \phpws2\ResourceFactory
{

    public static function pullPostString($varname)
    {
        return trim(strip_tags(filter_input(INPUT_POST, $varname, FILTER_SANITIZE_STRING, FILTER_FLAG_NO_ENCODE_QUOTES)));
    }

    public static function pullGetString($varname)
    {
        return trim(strip_tags(filter_input(INPUT_GET, $varname, FILTER_SANITIZE_STRING, FILTER_FLAG_NO_ENCODE_QUOTES)));
    }

    public static function pullPostCheck($varname)
    {
        return filter_input(INPUT_POST, $varname, FILTER_VALIDATE_BOOLEAN);
    }

    public static function pullPostInteger($varname)
    {
        return filter_input(INPUT_POST, $varname, FILTER_SANITIZE_NUMBER_INT);
    }

    public static function pullGetInteger($varname)
    {
        return filter_input(INPUT_GET, $varname, FILTER_SANITIZE_NUMBER_INT);
    }

    public static function build($id = 0, $resource)
    {
        if ($id) {
            $resource->setId($id);
            if (!parent::loadByID($resource)) {
                throw new \Exception('Resource id not found:' . $id);
            }
        }
        return $resource;
    }

}
