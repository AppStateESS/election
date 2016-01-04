<?php

namespace election\Controller\Admin;

use election\Factory\Ballot as Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Single extends \election\Controller\Base
{

    public function getHtmlView($data, \Request $request)
    {
        javascript('datetimepicker');
        if (ELECTION_REACT_DEV) {
            $script[] = \election\Factory\React::development('Admin/Single/', 'Mixin.jsx');
            $script[] = \election\Factory\React::development('Admin/Single/', 'SingleBallot.jsx');
        } else {
            $script[] = \election\Factory\React::production('Admin/Single/', 'script.min.js');
        }
        $react = implode("\n", $script);

        \Layout::addStyle('election', 'Admin/Single/style.css');
        //$settings = \Current_User::isDeity() ? 'true' : 'false';

        $tabs = parent::getTabs('single');

        $date_format = '<script type="text/javascript">var dateFormat = "'. ELECTION_DATETIME_FORMAT .'";</script>';
        $content = <<<EOF
$tabs
$date_format
<div id="single-ballot"></div>
$react
EOF;
        $view = new \View\HtmlView($content);
        return $view;
    }

    public function post(\Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown Clinician command');
        }

        $command = $request->getVar('command');
        switch ($command) {
            case 'save':
                Factory::post();
                break;

            case 'delete':
                Factory::delete(Factory::pullPostInteger('clinicianId'));
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
            throw new \Exception('Unknown Single ballot command');
        }
        $json = array('success' => true);

        $command = $request->getVar('command');
        switch ($command) {
            case 'list':
                $json = Factory::getList();
                break;
        }
        $view = new \View\JsonView($json);
        return $view;
    }

}
