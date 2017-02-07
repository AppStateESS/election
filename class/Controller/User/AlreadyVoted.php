<?php

namespace election\Controller\User;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Jeremy Booker
 */
class AlreadyVoted extends \election\Controller\User\Base
{

    public function getHtmlView($data, \Canopy\Request $request)
    {
        \Layout::addStyle('election', 'User/style.css');

        // TODO.. Fill this in with an actual template
        $content = "<div class='well'><p><strong>You've already voted in this election.</strong></p>";

        $view = new \View\HtmlView($content);
        return $view;
    }
}
