<?php

namespace election\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class React
{
    public static function development($directory, $filename)
    {
        $root_directory = PHPWS_SOURCE_HTTP . 'mod/election/javascript/';
        $script = "<script type='text/javascript' src='{$root_directory}{$directory}/$filename'></script>";
        return $script;
    }
    
    public static function production($directory, $filename)
    {
        $root_directory = PHPWS_SOURCE_HTTP . 'mod/election/javascript/';
        $hash = md5($directory . $filename);
        $script = "<script type='text/javascript' src='{$root_directory}{$directory}/$filename'></script>";
        return $script;
    }
}
