<?php

namespace election\Controller\Admin;

use election\Factory\Ballot as Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Multiple extends \election\Controller\Base
{

    public function getHtmlView($data, \Request $request)
    {
        javascript('datetimepicker');

        $script[] = '<script type="text/javascript" src="' . PHPWS_SOURCE_HTTP . 'mod/election/node_modules/react-dropzone/dist/react-dropzone.js"></script>';

        if (ELECTION_REACT_DEV) {
            $script[] = \election\Factory\React::development('Admin/Mixin/', 'Mixin.js');
            $script[] = \election\Factory\React::development('Admin/Multiple/', 'MultipleBallot.js');
        } else {
            $script[] = \election\Factory\React::production('Admin/Multiple/', 'script.min.js');
        }
        $react = implode("\n", $script);

        \Layout::addStyle('election', 'Admin/Multiple/style.css');
        //$settings = \Current_User::isDeity() ? 'true' : 'false';

        $tabs = parent::getTabs('multiple');

        $date_format = '<script type="text/javascript">var dateFormat = "' . ELECTION_DATETIME_FORMAT . '";</script>';
        $content = <<<EOF
$tabs
$date_format
<div id="multiple-ballot"></div>
$react
EOF;
        $view = new \View\HtmlView($content);
        return $view;
    }

    public function post(\Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown Single ballot command');
        }

        $command = $request->getVar('command');
        switch ($command) {
            case 'save':
                Factory::post();
                break;

            case 'delete':
                Factory::delete(Factory::pullPostInteger('ballotId'));
                break;

            default:
                throw new \Exception('Unknown Single ballot command');
        }

        $view = new \View\JsonView(array('success' => true));
        $response = new \Response($view);
        return $response;
    }

    protected function getJsonView($data, \Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown Single ballot command');
        }
        $json = array('success' => true);

        $command = $request->getVar('command');
        switch ($command) {
            case 'list':
                $json = Factory::getList(1);
                break;
        }
        $view = new \View\JsonView($json);
        return $view;
    }

}

