<?php

namespace election\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
abstract class Base extends \phpws2\Resource
{
    /**
     * @var \Variable\Bool
     */
    protected $active;

    public function __construct()
    {
        parent::__construct();
        $this->active = new \phpws2\Variable\BooleanVar(true, 'active');
    }
    
    public function setActive($var)
    {
        $this->active->set($var);
    }
    
    public function getActive()
    {
        return $this->active->get();
    }

}
