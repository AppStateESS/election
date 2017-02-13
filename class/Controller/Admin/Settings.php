<?php

namespace election\Controller\Admin;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Settings extends \election\Controller\Base
{

    public function getHtmlView($data, \Canopy\Request $request)
    {
        javascript('jquery');
        $tplvars['studentDataApiUrl'] = \PHPWS_Settings::get('election', 'studentDataApiUrl');
        $tplvars['studentOrgApiUrl'] = \PHPWS_Settings::get('election', 'studentOrgApiUrl');
        $tplvars['fromAddress'] = \PHPWS_Settings::get('election', 'fromAddress');
        $tplvars['surveyLink'] = \PHPWS_Settings::get('election', 'surveyLink');
        $tplvars['supportLink'] = \PHPWS_Settings::get('election', 'supportLink');
        $template = new \phpws2\Template($tplvars);
        $template->setModuleTemplate('election', 'Admin/Settings.html');
        $content = $template->get();

        $view = new \phpws2\View\HtmlView($content);
        return $view;
    }

    public function post(\Canopy\Request $request)
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

        $view = new \phpws2\View\JsonView(array('success' => true));
        $response = new \Canopy\Response($view);
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

        $surveyLink = $request->getVar('surveyLink');
        \PHPWS_Settings::set('election', 'surveyLink', $surveyLink);

        $supportLink = $request->getVar('supportLink');
        \PHPWS_Settings::set('election', 'supportLink', $supportLink);

        \PHPWS_Settings::save('election');
    }

}
