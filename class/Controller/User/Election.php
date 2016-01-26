<?php

namespace election\Controller\User;

use election\Factory\Election as Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Election extends \election\Controller\Base
{
    public function getHtmlView($data, \Request $request)
    {
        if (ELECTION_REACT_DEV) {
            $script[] = \election\Factory\React::development('Mixin/', 'Mixin.js');
            $script[] = \election\Factory\React::development('User/', 'Referendum.js');
            $script[] = \election\Factory\React::development('User/', 'Multiple.js');
            $script[] = \election\Factory\React::development('User/', 'Single.js');
            $script[] = \election\Factory\React::development('User/', 'Election.js');
        } else {
            $script[] = \election\Factory\React::production('User/', 'script.min.js');
        }
        $react = implode("\n", $script);

        \Layout::addStyle('election', 'User/style.css');

        $content = <<<EOF
<div id="election"></div>
$react
EOF;
        $view = new \View\HtmlView($content);
        return $view;
    }

}
