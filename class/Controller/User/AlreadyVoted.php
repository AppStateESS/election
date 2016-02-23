<?php

namespace election\Controller\User;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Jeremy Booker
 */
class AlreadyVoted extends \election\Controller\User\Base
{

    public function getHtmlView($data, \Request $request)
    {
        \Layout::addStyle('election', 'User/style.css');

        // TODO.. Fill this in with an actual template
        $content = "You've already voted in this election.";

        $view = new \View\HtmlView($content);
        return $view;
    }
}
