<?php

namespace election\Controller\User;

use election\Factory\Election as Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Election extends \election\Controller\User
{
    public function get(\Request $request)
    {
        $data = array();
        $view = $this->getView($data, $request);
        $response = new \Response($view);
        return $response;
    }

    public function getHtmlView($data, \Request $request)
    {
        // NB: This is here so I can test JSON through a normal GET request
        // TODO: remove this before production
        /*
        $command = $request->getVar('command');
        switch ($command) {
            case 'list':
                $json = self::getVotingData();
                $view = new \View\JsonView($json);
                return $view;
                break;
        }
        */


        $script[] = '<script type="text/javascript">var defaultPicture = \'' . PHPWS_SOURCE_HTTP . 'mod/election/img/no-picture.gif\';</script>';
        if (ELECTION_REACT_DEV) {
            $script[] = \election\Factory\React::development('Mixin/', 'Mixin.js');
            $script[] = \election\Factory\React::development('User/', 'Review.js');
            $script[] = \election\Factory\React::development('User/', 'Referendum.js');
            $script[] = \election\Factory\React::development('User/', 'Multiple.js');
            $script[] = \election\Factory\React::development('User/', 'Single.js');
            $script[] = \election\Factory\React::development('User/', 'Election.js');
        } else {
            $script[] = \election\Factory\React::production('User/', 'script.min.js');
        }
        $react = implode("\n", $script);

        \Layout::addStyle('election', 'style.css');
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
        $unqualified = array('Fake election One', 'Fake election two', 'Fake election three');

        //var_dump($student);

        $student_id = $this->student->getBannerId();

        $election = Factory::getCurrent();

        // If there's no election going on, then return empty data
        if(empty($election)){
            return array(
                'hasVoted' => false,
                'election' => null,
                'single' => array(),
                'multiple' => array(),
                'referendum' => array(),
                'unqualified' => array()
            );
        }

        // Check if student has voted already
        $hasVoted = $this->student->hasVoted($election['id']);

        // If already voted, return minimal voting info
        if($hasVoted){
            return array(
                'hasVoted' => true,
                'election' => $election,
                'single' => array(),
                'multiple' => array(),
                'referendum' => array(),
                'unqualified' => array());
        }

        // Assemble the voting data
        $single = \election\Factory\Single::getListWithTickets($election['id']);
        $multiple = \election\Factory\Multiple::getListWithCandidates($election['id']);
        $referendum = \election\Factory\Referendum::getList($election['id']);
        $voting_data = array(
            'hasVoted' => false,
            'election' => $election,
            'single' => $single,
            'multiple' => $multiple,
            'referendum' => $referendum,
            'unqualified' => $unqualified
        );

        return $voting_data;
    }

}