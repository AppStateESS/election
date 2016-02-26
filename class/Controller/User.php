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

        // Get the current election
        $election = \election\Factory\Election::getCurrent();

        // If there's no current election, redirect to friendly error message
        if ($election === false) {
            $command = 'NoOpenElections';
        }

        $provider = \election\Factory\StudentProviderFactory::getProvider();
        $studentId = $provider->pullStudentId();

        try {
            $student = \election\Factory\StudentFactory::getStudentByBannerId($studentId);
        } catch (\election\Exception\NotAllowed $ex) {
            $controller = new User\NotAllowed($this->getModule());
            $controller->setMessage($ex->getMessage());
            return $controller;
        }
        // If there's an election going on, check to see if this student has already voted in it
        if ($election !== false && $student->hasVoted($election['id'])) {
            $command = 'AlreadyVoted';
        }

        // Default command name is 'Election'
        if (empty($command)) {
            $command = 'Election';
        }

        $className = 'election\Controller\User\\' . $command;
        if (!class_exists($className)) {
            throw new \Exception('Unknown command: ' . $className);
        }
        $controller = new $className($this->getModule());
        $controller->setStudent($student);

        return $controller;
    }

    public static function loadNavBar()
    {
        $auth = \Current_User::getAuthorization();

        $vars['is_admin'] = \Current_User::allow('election');
        $vars['logout_uri'] = $auth->logout_link;
        $vars['username'] = \Current_User::getDisplayName();
        $template = new \Template($vars);
        $template->setModuleTemplate('election', 'navbar.html');
        $content = $template->get();
        \Layout::plug($content, 'NAV_LINKS');
    }

    public static function welcomeScreen()
    {
        \Layout::addStyle('election', 'User/style.css');
        $template = new \Template;
        $template->setModuleTemplate('election', 'User/welcome.html');
        if (!\Current_User::isLogged()) {
            $template->add('color', 'primary');
            $template->add('label', '<i class="fa fa-check-square-o"></i> Sign in to Vote');
            $template->add('url', ELECTION_LOGIN_DIRECTORY);
        } else {
            $template->add('color', 'success');
            $template->add('label', '<i class="fa fa-check-square-o"></i> Get started voting!');
            $template->add('url', 'election/');
        }
        $template->add('image', PHPWS_SOURCE_HTTP . 'mod/election/img/background1.jpg');
        \Layout::add($template->get());
    }

}
