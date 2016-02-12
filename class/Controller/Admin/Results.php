<?php

namespace election\Controller\Admin;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Results extends \election\Controller\Base
{

    public function getHtmlView($data, \Request $request)
    {
        $content = 'report here';
        $view = new \View\HtmlView($content);
        return $view;
    }

}
