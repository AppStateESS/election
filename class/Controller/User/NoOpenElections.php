<?php

namespace election\Controller\User;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Jeremy Booker
 */
class NoOpenElections extends \election\Controller\User\Base
{

    public function getHtmlView($data, \Canopy\Request $request)
    {
        \Layout::addStyle('election', 'User/style.css');

        // TODO.. Fill this in with an actual template
        $content = 'No elections open right now.';

        $view = new \View\HtmlView($content);
        return $view;
    }
}
