<?php

namespace election\Controller\User;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class NotAllowed extends \election\Controller\User\Base
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
<div class='well'><p><strong>Sorry, but you are not eligible to vote.</strong></p>
<p><strong>Reason:</strong> $reason</p>
EOF;

        $view = new \phpws2\View\HtmlView($content);
        return $view;
    }

}
