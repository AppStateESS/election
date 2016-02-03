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

        // Check for an open Election
        $election = \election\Factory\Election::getCurrent();

        if($election === false){
            $command = 'NoOpenElections';
        }

        // Check to see if this student has already voted
        // TODO

        // Default command name is 'Election'
        if (empty($command)) {
            $command = 'Election';
        }

        $className = 'election\Controller\User\\' . $command;
        if (!class_exists($className)) {
            throw new \Exception('Unknown command: ' . $className);
        }
        $commandObject = new $className($this->getModule());
        return $commandObject;
    }

    public static function loadNavBar()
    {
        $auth = \Current_User::getAuthorization();

        $vars['is_admin'] = \Current_User::allow('election');
        $vars['logout_uri'] = $auth->logout_link;
        $vars['username'] = \Current_User::getDisplayName();
        $template =  new \Template($vars);
        $template->setModuleTemplate('election', 'navbar.html');
        $content = $template->get();
        \Layout::plug($content, 'NAV_LINKS');
    }


}
