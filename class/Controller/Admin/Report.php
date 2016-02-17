<?php

namespace election\Controller\Admin;

use election\Factory\Report as Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Report extends \election\Controller\Base
{
    public function getHtmlView($data, \Request $request)
    {
        \Layout::addStyle('election', 'style.css');
        if (!$request->isVar('command')) {
            $command = 'show';
        } else {
            $command = $request->getVar('command');
        }
        switch ($command) {
            case 'show':
                $content = $this->showResults(Factory::pullGetInteger('electionId'));
                break;

            default:
                throw new \Http\NotAcceptableException('Unknown Report command');
                break;
        }

        $view = new \View\HtmlView($content);
        return $view;
    }
    
    public function showResults($electionId)
    {
        \Layout::addStyle('election', 'Admin/Report/style.css');
        $singleResults = Factory::getSingleResults($electionId);
        $multipleResults = Factory::getMultipleResults($electionId);
        $referendumResults = Factory::getReferendumResults($electionId);
        
        $template = new \Template;
        $template->add('single', $singleResults);
        $template->add('multiple', $multipleResults);
        $template->add('referendum', $referendumResults);
        $template->setModuleTemplate('election', 'Admin/Report/Results.html');
        return $template->get();
    }
}
