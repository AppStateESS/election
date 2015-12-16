<?php

namespace election\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class ReferendumOption extends \Resource
{

    public function __construct()
    {
        parent::__construct();
        
        $this->label = new \Variable\String(null, 'label');
        $this->label->setLimit(50);
        $this->color = new \Variable\String(null, 'color');
        $this->color->setLimit(50);
    }

}
