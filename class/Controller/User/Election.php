<?php

namespace election\Controller\User;

use election\Factory\Election as Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Election extends \election\Controller\Base
{

    public function getHtmlView($data, \Request $request)
    {
        if (ELECTION_REACT_DEV) {
            $script[] = \election\Factory\React::development('Mixin/', 'Mixin.js');
            $script[] = \election\Factory\React::development('User/', 'Referendum.js');
            $script[] = \election\Factory\React::development('User/', 'Multiple.js');
            $script[] = \election\Factory\React::development('User/', 'Single.js');
            $script[] = \election\Factory\React::development('User/', 'Election.js');
        } else {
            $script[] = \election\Factory\React::production('User/', 'script.min.js');
        }
        $react = implode("\n", $script);

        \Layout::addStyle('election', 'User/style.css');

        $content = <<<EOF
<div id="election"></div>
$react
EOF;
        $view = new \View\HtmlView($content);
        return $view;
    }

    protected function getJsonView($data, \Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown Election command');
        }
        $json = array('success' => true);

        $command = $request->getVar('command');
        switch ($command) {
            case 'list':
                $json = self::getVotingData();
                break;
        }
        $view = new \View\JsonView($json);
        return $view;
    }

    private function getVotingData()
    {
        $student_id = \election\Factory\Student::getId();
        $election = Factory::getCurrent();
        if (!empty($election)) {
            $hasVoted = \election\Factory\Student::hasVoted($election['id']);

            if (!$hasVoted) {
                $single = \election\Factory\Single::getListWithTickets($election['id']);
                $multiple = \election\Factory\Multiple::getListWithCandidates($election['id']);
                $referendum = \election\Factory\Referendum::getList($election['id']);
                $voting_data = array(
                    'election' => $election,
                    'single' => $single,
                    'multiple' => $multiple,
                    'referendum' => $referendum
                );
            } else {
                $voting_data = array(
                    'hasVoted' => true,
                    'election' => $election,
                    'single' => array(),
                    'multiple' => array(),
                    'referendum' => array()
                );
            }
        } else {
            $voting_data = array(
                'hasVoted' => false,
                'election' => array(),
                'single' => array(),
                'multiple' => array(),
                'referendum' => array()
            );
        }

        return $voting_data;
    }

}
