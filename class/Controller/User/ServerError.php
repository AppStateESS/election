<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace election\Controller\User;

/**
 * Description of ServerError
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 */
class ServerError extends \election\Controller\User\Base
{
    public function setMessage($message)
    {
        $this->message = $message;
    }

    public function getMessage()
    {
        return $this->message;
    }

    public function getHtmlView($data, \Canopy\Request $request)
    {
        \Layout::addStyle('election', 'User/style.css');
        $reason = $this->getMessage();
        // TODO.. Fill this in with an actual template
        $content = <<<EOF
<div class='well'><p><strong>Sorry, a Banner server error occurred.</strong></p>
<p>$reason</p>
EOF;

        $view = new \View\HtmlView($content);
        return $view;
    }
}
