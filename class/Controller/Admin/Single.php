<?php

namespace election\Controller\Admin;

use election\Factory\Single as Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Single extends \election\Controller\Base
{

    /**
     * @deprecated
     * @param type $data
     * @param \Canopy\Request $request
     * @return string
     */
    public function getHtmlView($data, \Canopy\Request $request)
    {
        return '';
    }
    
    public function post(\Canopy\Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown Single ballot command');
        }

        $command = $request->getVar('command');
        switch ($command) {
            case 'save':
                Factory::post();
                break;

            case 'delete':
                Factory::delete(Factory::pullPostInteger('singleId'));
                break;

            default:
                throw new \Exception('Unknown Single ballot command');
        }

        $view = new \phpws2\View\JsonView(array('success' => true));
        $response = new \Canopy\Response($view);
        return $response;
    }

    protected function getJsonView($data, \Canopy\Request $request)
    {
        if (!$request->isVar('command')) {
            throw new \Exception('Unknown Single ballot command');
        }
        $json = array('success' => true);

        $command = $request->getVar('command');
        switch ($command) {
            case 'list':
                $json = Factory::getList(Factory::pullGetInteger('electionId'));
                break;
        }
        $view = new \phpws2\View\JsonView($json);
        return $view;
    }

}
