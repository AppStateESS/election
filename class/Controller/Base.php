<?php

namespace election\Controller;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
abstract class Base extends \Http\Controller
{

    public function get(\Request $request)
    {
        $data = array();
        $view = $this->getView($data, $request);
        $response = new \Response($view);
        return $response;
    }

    protected function getScript($filename)
    {
        $root_directory = PHPWS_SOURCE_HTTP . 'mod/election/javascript/dist/';
        if (ELECTION_REACT_DEV) {
            $path = $filename . '.dev.js';
        } else {
            $path = $filename . '.prod.js';
        }
        $script = "<script type='text/javascript' src='{$root_directory}$path'></script>";
        return $script;
    }

}
