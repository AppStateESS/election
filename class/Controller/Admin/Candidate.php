<?php

namespace election\Controller\Admin;

use election\Factory\Candidate as Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Candidate extends \election\Controller\Base
{

    public function post(\Canopy\Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown Candidate command');
        }

        $command = $request->getVar('command');
        switch ($command) {
            case 'save':
                Factory::post();
                break;

            case 'delete':
                Factory::delete(Factory::pullPostInteger('candidateId'));
                break;

            default:
                throw new \Exception('Unknown Single ballot command');
        }

        $view = new \View\JsonView(array('success' => true));
        $response = new \Canopy\Response($view);
        return $response;
    }

    protected function getJsonView($data, \Canopy\Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown Candidate command');
        }
        $json = array('success' => true);

        $command = $request->getVar('command');
        switch ($command) {
            case 'ticketList':
                $json = Factory::getTicketList(Factory::pullGetInteger('ticketId'));
                break;
            case 'candidateList':
                $json = Factory::getCandidateList(Factory::pullGetInteger('multipleId'));
                break;
        }
        $view = new \View\JsonView($json);
        return $view;
    }

}
