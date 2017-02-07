<?php

namespace election\Controller\Admin;

use election\Factory\Ticket as Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Ticket extends \election\Controller\Base
{
    protected function getJsonView($data, \Canopy\Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown Ticket command');
        }
        $json = array('success' => true);

        $command = $request->getVar('command');
        switch ($command) {
            case 'list':
                $json = Factory::getList(Factory::pullGetString('singleId'));
                break;
            
            case 'checkUrl':
                $json = array('success'=> Factory::checkURL(Factory::pullGetString('checkUrl')));
                break;
        }
        $view = new \View\JsonView($json);
        return $view;
    }
    
    
    public function post(\Canopy\Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown Ticket command');
        }

        $command = $request->getVar('command');
        switch ($command) {
            case 'save':
                Factory::post();
                break;

            case 'delete':
                Factory::delete(Factory::pullPostInteger('ticketId'));
                break;

            default:
                throw new \Exception('Unknown Ticket command');
        }

        $view = new \View\JsonView(array('success' => true));
        $response = new \Response($view);
        return $response;
    }
}
