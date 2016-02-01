<?php

namespace election\Controller\Admin;

use election\Factory\Election as Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Election extends \election\Controller\Base
{

    public function getHtmlView($data, \Request $request)
    {
        javascript('datetimepicker');

        $script[] = '<script type="text/javascript" src="' . PHPWS_SOURCE_HTTP . 'mod/election/node_modules/react-dropzone/dist/react-dropzone.js"></script>';

        if (ELECTION_REACT_DEV) {
            $script[] = \election\Factory\React::development('Mixin/', 'Mixin.js');
            $script[] = \election\Factory\React::development('Admin/Election/', 'Referendum.js');
            $script[] = \election\Factory\React::development('Admin/Election/', 'Candidate.js');
            $script[] = \election\Factory\React::development('Admin/Election/', 'Ticket.js');
            $script[] = \election\Factory\React::development('Admin/Election/', 'Multiple.js');
            $script[] = \election\Factory\React::development('Admin/Election/', 'Single.js');
            $script[] = \election\Factory\React::development('Admin/Election/', 'Election.js');
        } else {
            $script[] = \election\Factory\React::production('Admin/Election/', 'script.min.js');
        }
        $react = implode("\n", $script);

        \Layout::addStyle('election', 'style.css');
        \Layout::addStyle('election', 'Admin/style.css');
        //$settings = \Current_User::isDeity() ? 'true' : 'false';

        $date_format = '<script type="text/javascript">var dateFormat = "' . ELECTION_DATETIME_FORMAT . '";</script>';
        $content = <<<EOF
$date_format
<div id="election-dashboard"></div>
$react
EOF;
        $view = new \View\HtmlView($content);
        return $view;
    }

    public function post(\Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown Election command');
        }

        $command = $request->getVar('command');
        switch ($command) {
            case 'save':
                Factory::post();
                break;

            case 'delete':
                Factory::delete(Factory::pullPostInteger('electionId'));
                break;

            default:
                throw new \Exception('Unknown Election command');
        }

        $view = new \View\JsonView(array('success' => true));
        $response = new \Response($view);
        return $response;
    }

    protected function getJsonView($data, \Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown Election command');
        }
        $json = array('success' => true);

        $command = $request->getVar('command');
        switch ($command) {
            case 'list':
                $json = Factory::getList();
                break;
            
            case 'getElectionTypes':
                echo Factory::getFilterTypes();
                exit();
                break;
            
            case 'checkConflict':
                $json = Factory::checkForConflict(Factory::pullGetInteger('startDate'),
                        Factory::pullGetInteger('endDate'), Factory::pullGetInteger('electionId'));
                break;
        }
        $view = new \View\JsonView($json);
        return $view;
    }

}
