<?php

namespace election\Controller\User;

use election\Factory\Election as Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Election extends \election\Controller\User\Base
{

    public function get(\Canopy\Request $request)
    {
        $data = array();
        $view = $this->getView($data, $request);
        $response = new \Response($view);
        return $response;
    }

    public function getHtmlView($data, \Canopy\Request $request)
    {
        $script[] = '<script type="text/javascript">var defaultPicture = \'' . PHPWS_SOURCE_HTTP . 'mod/election/img/no-picture.gif\';</script>';
        $script[] = $this->getScript('user');
        $react = implode("\n", $script);

        \Layout::addStyle('election', 'style.css');
        \Layout::addStyle('election', 'User/style.css');

        $content = null;
        // Shows student data
        //$content .= '<pre>' . var_export($this->student, true) . '</pre>';
        $content .= <<<EOF
<div id="election"></div>
$react
EOF;

        $view = new \View\HtmlView($content);
        return $view;
    }

    protected function getJsonView($data, \Canopy\Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown Election command');
        }

        $command = $request->getVar('command');
        switch ($command) {
            case 'list':
                $json = self::getVotingData();
                break;

            case 'message':
                $json['message'] = \PHPWS_Settings::get('election',
                                'postVoteMessage');
                break;
        }
        $view = new \View\JsonView($json);
        return $view;
    }

    private function getVotingData()
    {
        $election = Factory::getCurrent();

        // If there's no election going on, then return empty data
        if (empty($election)) {
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
        if ($hasVoted) {
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
        if (!empty($multiple)) {
            $unqualified = \election\Factory\Multiple::filter($multiple,
                            $this->student);
        } else {
            $unqualified = array();
        }
        $referendum = \election\Factory\Referendum::getList($election['id']);
        $voting_data = array(
            'hasVoted' => false,
            'election' => $election,
            'single' => $single,
            'multiple' => $multiple,
            'referendum' => $referendum,
            'unqualified' => $unqualified,
            'supportLink' => \PHPWS_Settings::get('election', 'supportLink')
        );

        return $voting_data;
    }

}
