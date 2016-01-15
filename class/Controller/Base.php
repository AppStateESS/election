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
    
    public function getTabs($active) {
        $template = new \Template();
        $template->setModuleTemplate('election', 'Admin/tabs.html');
        $vars['single_active'] = null;
        $vars['multiple_active'] = null;
        $vars['referendum_active'] = null;
        
        switch ($active) {
            case 'single':
                $vars['single_active'] = 'active';
                break;
            case 'multiple':
                $vars['multiple_active'] = 'active';
                break;
            case 'referendum':
                $vars['referendum_active'] = 'active';
                break;
        }
        $template->addVariables($vars);
        
        return $template->get();
    }

}
