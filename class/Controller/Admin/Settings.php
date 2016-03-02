<?php

namespace election\Controller\Admin;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Settings extends \election\Controller\Base
{

    public function getHtmlView($data, \Request $request)
    {
        javascript('jquery');
        $tplvars['studentDataApiUrl'] = \PHPWS_Settings::get('election', 'studentDataApiUrl');
        $tplvars['studentOrgApiUrl'] = \PHPWS_Settings::get('election', 'studentOrgApiUrl');
        $tplvars['fromAddress'] = \PHPWS_Settings::get('election', 'fromAddress');
        $tplvars['postVoteMessage'] = \PHPWS_Settings::get('election', 'postVoteMessage');
        $template = new \Template($tplvars);
        $template->setModuleTemplate('election', 'Admin/Settings.html');
        $content = $template->get();

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
                $this->save($request);
                break;
        }

        $view = new \View\JsonView(array('success' => true));
        $response = new \Response($view);
        return $response;
    }

    private function save($request)
    {
        $studentDataApiUrl = $request->getVar('studentDataApiUrl');
        \PHPWS_Settings::set('election', 'studentDataApiUrl', $studentDataApiUrl);

        $studentOrgApiUrl = $request->getVar('studentOrgApiUrl');
        \PHPWS_Settings::set('election', 'studentOrgApiUrl', $studentOrgApiUrl);

        $fromAddress = $request->getVar('fromAddress');
        \PHPWS_Settings::set('election', 'fromAddress', $fromAddress);

        $postVoteMessage = $request->getVar('postVoteMessage');
        \PHPWS_Settings::set('election', 'postVoteMessage', $postVoteMessage);

        \PHPWS_Settings::save('election');
    }

}
