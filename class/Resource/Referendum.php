<?php

namespace election\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Referendum extends \Measure
{
    
    public function __construct()
    {
        parent::__construct();
        $this->description = new \Variable\String(null, 'description');
    }
}
