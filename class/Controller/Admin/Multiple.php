<?php

namespace election\Controller\Admin;

use election\Factory\Multiple as Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Multiple extends \election\Controller\Base
{

    /**
     * @deprecated
     * @param type $data
     * @param \Request $request
     * @return string
     */
    public function getHtmlView($data, \Request $request)
    {
        return '';
    }

    public function post(\Request $request)
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
                Factory::delete(Factory::pullPostInteger('ballotId'));
                break;

            default:
                throw new \Exception('Unknown Single ballot command');
        }

        $view = new \View\JsonView(array('success' => true));
        $response = new \Response($view);
        return $response;
    }

    protected function getJsonView($data, \Request $request)
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
        $view = new \View\JsonView($json);
        return $view;
    }

}
