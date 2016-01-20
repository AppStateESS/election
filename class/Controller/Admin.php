<?php

namespace election\Controller;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Admin extends \Http\Controller
{

    public function get(\Request $request)
    {
        $command = $this->routeCommand($request);
        return $command->get($request);
    }

    public function post(\Request $request)
    {
        $command = $this->routeCommand($request);
        return $command->post($request);
    }

    private function routeCommand($request)
    {
        $command = $request->shiftCommand();

        if (empty($command)) {
            $command = 'Election';
        }
        $className = 'election\Controller\Admin\\' . $command;
        if (!class_exists($className)) {
            throw new \Exception('Unknown command');
        }
        $commandObject = new $className($this->getModule());
        return $commandObject;
    }
    
    public static function loadAdminBar()
    {
        $auth = \Current_User::getAuthorization();
        
        $vars['is_deity'] = \Current_User::isDeity();
        $vars['logout_uri'] = $auth->logout_link;
        $vars['username'] = \Current_User::getDisplayName();
        $template =  new \Template($vars);
        $template->setModuleTemplate('election', 'Admin/navbar.html');
        $content = $template->get();
        \Layout::plug($content, 'NAV_LINKS');
    }

}
