<?php

namespace election\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
abstract class Base extends \Resource
{
    /**
     * Name of the ballot
     * @var \Variable\String 
     */
    protected $title;
    
    /**
     * @var \Variable\Bool
     */
    protected $active;

    public function __construct()
    {
        parent::__construct();
        $this->title = new \Variable\String(null, 'title');
        $this->title->setLimit(100);
        $this->title->allowEmpty(false);
        $this->active = new \Variable\Bool(true, 'active');
    }

    public function setTitle($var)
    {
        $this->title->set($var);
    }

    public function getTitle()
    {
        return $this->title->get();
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
