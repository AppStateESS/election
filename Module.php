<?php

namespace election;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Module extends \Module implements \SettingDefaults
{

    public function __construct()
    {
        parent::__construct();
        $this->setTitle('election');
        $this->setProperName('Election');
    }

    public function beforeRun(\Request $request, \Controller $controller)
    {
        $define_file = PHPWS_SOURCE_DIR . 'mod/election/conf/defines.php';
        if (!is_file($define_file)) {
            exit('Election requires a copy of conf/defines.php to be created.');
        }
        require_once $define_file;
    }

    public function getController(\Request $request)
    {
        \Current_User::requireLogin();
        $cmd = $request->shiftCommand();
        if ($cmd == 'Admin' && \Current_User::allow('election')) {
            $admin = new \election\Controller\Admin($this);
            return $admin;
        } else {
            $user = new \election\Controller\User($this);
            return $user;
        }
    }

    public function getSettingDefaults()
    {
        
    }

    public function runTime(\Request $request)
    {
        if (\Current_User::isLogged()) {
            \election\Controller\User::loadNavBar();
        }
    }

}
