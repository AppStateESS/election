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
        $script_file = 'src/' . $filename;

        $data['development'] = true;
        $data['addons'] = true;
        javascript('react', $data);
        $root_directory = PHPWS_SOURCE_HTTP . 'mod/election/javascript/';
        $script = "<script type='text/jsx' src='$root_directory$directory$script_file'></script>";
        return $script;
    }
    
    public static function production($directory, $filename)
    {
        $script_file = 'build/' . $filename;
        $data['development'] = false;
        $data['addons'] = true;
        javascript('react', $data);
        $root_directory = PHPWS_SOURCE_HTTP . 'mod/election/javascript/';
        $hash = md5($directory . $script_file);
        $script = "<script type='text/javascript' src='$root_directory$directory$script_file'></script>";
        return $script;
    }

}
