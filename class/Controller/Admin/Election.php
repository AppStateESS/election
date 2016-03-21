<?php

namespace election\Controller\Admin;

use election\Factory\Election as Factory;
use election\Resource\Election as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Election extends \election\Controller\Base
{

    public function getHtmlView($data, \Request $request)
    {
        \Layout::addStyle('election', 'style.css');
        if (!$request->isVar('command')) {
            $command = 'list';
        } else {
            $command = $request->getVar('command');
        }
        switch ($command) {
            case 'edit':
                $content = $this->edit($request->getVar('electionId'));
                break;

            case 'list':
            default:
                $content = $this->electionList();
                break;
        }

        $view = new \View\HtmlView($content);
        return $view;
    }

    private function getElection($electionId)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_election');
        $tbl->addFieldConditional('id', $electionId);
        $result = $db->selectOneRow();
        Factory::plugExtraValues($result);
        return $result;
    }

    private function edit($electionId)
    {
        javascript('datetimepicker');
        $script[] = '<script type="text/javascript" src="' . PHPWS_SOURCE_HTTP . 'mod/election/node_modules/react-dropzone/dist/react-dropzone.js"></script>';

        $allowChange = Factory::allowChange($electionId) ? 'true' : 'false';
        
        $script[] = '<script type="text/javascript">var allowChange=' . $allowChange  . ';var electionId = ' . $electionId . ';</script>';

        if (ELECTION_REACT_DEV) {
            $script[] = \election\Factory\React::development('Mixin/', 'Mixin.js');
            $script[] = \election\Factory\React::development('Mixin/', 'Date.js');
            $script[] = \election\Factory\React::development('Admin/Election/', 'script.js');
        } else {
            $script[] = \election\Factory\React::production('Admin/Election/', 'script.min.js');
        }
        $react = implode("\n", $script);

        $date_format = '<script type="text/javascript">var dateFormat = "' . ELECTION_DATETIME_FORMAT . '";var tomorrow="' .
                strftime('%Y/%m/%d', time() + 86400) . '";</script>';

        \Layout::addStyle('election', 'Admin/style.css');

        $content = <<<EOF
$date_format
<div id="election-dashboard"></div>
$react
EOF;
        return $content;
    }

    private function electionList()
    {
        javascript('datetimepicker');
        \Layout::addStyle('election', 'Admin/style.css');
        $deity = \Current_User::isDeity() ? 'true' : 'false';
        $date_format = '<script type="text/javascript">var admin = ' . $deity . ';var dateFormat = "' . ELECTION_DATETIME_FORMAT . '";var tomorrow="' .
                strftime('%Y/%m/%d', time() + 86400) . '";</script>';

        if (ELECTION_REACT_DEV) {
            $script[] = \election\Factory\React::development('Mixin/', 'Mixin.js');
            $script[] = \election\Factory\React::development('Mixin/', 'Date.js');
            $script[] = \election\Factory\React::development('Admin/List/', 'List.js');
        } else {
            $script[] = \election\Factory\React::production('Admin/List/', 'script.min.js');
        }
        $react = implode("\n", $script);
        $content = <<<EOF
$date_format
<div id="election-listing"></div>
$react
EOF;
        return $content;
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
                if (\Current_User::isDeity()) {
                    Factory::delete(Factory::pullPostInteger('electionId'));
                } else {
                    throw new \Exception('Non-deity election deletion not allowed.');
                }
                break;

            case 'saveTitle':
                $this->saveTitle();
                break;

            case 'saveDates':
                $this->saveDates();
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

            case 'getElection':
                $json = $this->getElection($request->getVar('electionId'));
                break;

            case 'getElectionTypes':
                echo Factory::getFilterTypes();
                exit();
                break;

            case 'checkConflict':
                $json = Factory::checkForConflict(Factory::pullGetInteger('startDate'), Factory::pullGetInteger('endDate'), Factory::pullGetInteger('electionId'));
                break;
        }
        $view = new \View\JsonView($json);
        return $view;
    }

    private function saveTitle()
    {
        $electionId = Factory::pullPostInteger('electionId');
        $election = Factory::build($electionId, new Resource);
        $title = Factory::pullPostString('title');
        $election->setTitle($title);
        Factory::saveResource($election);
    }

    private function saveDates()
    {
        $electionId = Factory::pullPostInteger('electionId');
        $election = Factory::build($electionId, new Resource);
        $startDate = Factory::pullPostInteger('startDate');
        $endDate = Factory::pullPostInteger('endDate');
        $election->setStartDate($startDate, false);
        $election->setEndDate($endDate, false);
        Factory::saveResource($election);
    }

}
