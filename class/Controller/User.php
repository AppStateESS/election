<?php

namespace election\Controller;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class User extends \Http\Controller
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

        $className = 'election\Controller\User\\' . $command;
        if (!class_exists($className)) {
            throw new \Exception('Unknown command');
        }
        $commandObject = new $className($this->getModule());
        return $commandObject;
    }
    
    public static function loadUserBar()
    {
        $auth = \Current_User::getAuthorization();
        $vars['logout_uri'] = $auth->logout_link;
        $vars['username'] = \Current_User::getDisplayName();
        $template =  new \Template($vars);
        $template->setModuleTemplate('election', 'User/navbar.html');
        $content = $template->get();
        \Layout::plug($content, 'NAV_LINKS');
    }

}
