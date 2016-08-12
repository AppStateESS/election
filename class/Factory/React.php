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
        self::requireReact(true, false);
        
        $root_directory = PHPWS_SOURCE_HTTP . 'mod/election/javascript/';
        $script = "<script type='text/javascript' src='{$root_directory}{$directory}/$filename'></script>";
        return $script;
    }
    
    public static function production($directory, $filename)
    {
        self::requireReact(true, true);
        
        $root_directory = PHPWS_SOURCE_HTTP . 'mod/election/javascript/';
        $hash = md5($directory . $filename);
        $script = "<script type='text/javascript' src='{$root_directory}{$directory}/$filename'></script>";
        return $script;
    }

    public static function requireReact($addons=true, $minified=true)
    {
        $node_directory = PHPWS_SOURCE_HTTP .  'mod/election/node_modules/';
        
        $react_directory = $node_directory . 'react/dist/';
        $react_file = $react_directory . ($addons ? 'react-with-addons' : 'react') . ($minified ? '.min.js' : '.js');
        
        $react_dom_directory = $node_directory . 'react-dom/dist/';
        $react_dom_file = $react_dom_directory . 'react-dom' . ($minified ? '.min.js' : '.js');
        
        $script_file = <<<EOF
<script type="text/javascript" src="$react_file"></script>
<script type="text/javascript" src="$react_dom_file"></script>
EOF;
        \Layout::addJSHeader($script_file, 'react_include');
    }
    
}
