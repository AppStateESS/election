<?php

namespace election\Controller;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
abstract class Base extends \phpws2\Http\Controller
{

    public function get(\Canopy\Request $request)
    {
        $data = array();
        $view = $this->getView($data, $request);
        $response = new \Canopy\Response($view);
        return $response;
    }

    public function scriptView($view_name, $add_anchor = true, $vars = null)
    {
        static $vendor_included = false;
        if (!$vendor_included) {
            $script[] = $this->getScript('vendor');
            $vendor_included = true;
        }
        if (!empty($vars)) {
            $script[] = $this->addScriptVars($vars);
        }
        $script[] = $this->getScript($view_name);
        $react = implode("\n", $script);
        if ($add_anchor) {
            $content = <<<EOF
<div id="$view_name"></div>
$react
EOF;
            return $content;
        } else {
            return $react;
        }
    }
    
        protected function getElectionRootDirectory()
    {
        return PHPWS_SOURCE_DIR . 'mod/election/';
    }

    protected function getElectionRootUrl()
    {
        return PHPWS_SOURCE_HTTP . 'mod/election/';
    }

    protected function getScript($scriptName)
    {
        $jsDirectory = $this->getElectionRootUrl() . 'javascript/';
        if (ELECTION_REACT_DEV) {
            $path = "{$jsDirectory}dev/$scriptName.js";
        } else {
            $path = $jsDirectory . 'build/' . $this->getAssetPath($scriptName);
        }
        $script = "<script type='text/javascript' src='$path'></script>";
        return $script;
    }

    private function getAssetPath($scriptName)
    {
        $rootDirectory = $this->getElectionRootDirectory();
        if (!is_file($rootDirectory . 'assets.json')) {
            exit('Missing assets.json file. Run npm run prod in stories directory.');
        }
        $jsonRaw = file_get_contents($rootDirectory . 'assets.json');
        $json = json_decode($jsonRaw, true);
        if (!isset($json[$scriptName]['js'])) {
            throw new \Exception('Script file not found among assets.');
        }
        return $json[$scriptName]['js'];
    }

}
