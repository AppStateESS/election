<?php

namespace election\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
abstract class Measure extends \Resource
{
    /**
     * Name of the ballot
     * @var \Variable\String 
     */
    protected $title;

    /**
     * Time to allow students to vote
     * @var \Variable\DateTime 
     */
    protected $start_date;

    /**
     * Deadline after which voting ceases
     * @var \Variable\DateTime
     */
    protected $end_date;
    
    /**
     *
     * @var \Variable\Bool
     */
    protected $active;

    public function __construct()
    {
        parent::__construct();
        $this->title = new \Variable\String(null, 'title');
        $this->title->setLimit(100);
        $this->title->allowEmpty(false);
        $this->start_date = new \Variable\DateTime(null, 'start_date');
        $this->end_date = new \Variable\DateTime(null, 'end_date');
        $this->active = new \Variable\Bool(true, 'active');
    }

    public function setTitle($var)
    {
        $this->title->set($var);
    }

    public function setStartDate($var, $formatted=true)
    {
        if ($formatted) {
            $var = strtotime($var);
        }
        $this->start_date->set($var);
    }

    public function setEndDate($var, $formatted=true)
    {
        if ($formatted) {
            $var = strtotime($var);
        }
        $this->end_date->set($var);
    }
    
    public function getTitle()
    {
        return $this->title->get();
    }
    
    public function getStartDate()
    {
        return $this->start_date->get();
    }

    public function getEndDate()
    {
        return $this->end_date->get();
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
