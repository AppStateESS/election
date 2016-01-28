<?php

namespace election\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Student extends \Resource
{
    protected $first_name;
    protected $last_name;
    
    public function __construct()
    {
        parent::__construct();
        $this->first_name = new \Variable\String(null, 'first_name');
        $this->last_name = new \Variable\String(null, 'last_name');
        
    }
}
