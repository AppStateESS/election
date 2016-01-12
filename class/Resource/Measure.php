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
    protected $startDate;

    /**
     * Deadline after which voting ceases
     * @var \Variable\DateTime
     */
    protected $endDate;
    
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
        $this->startDate = new \Variable\DateTime(null, 'startDate');
        $this->endDate = new \Variable\DateTime(null, 'endDate');
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
        $this->startDate->set($var);
    }

    public function setEndDate($var, $formatted=true)
    {
        if ($formatted) {
            $var = strtotime($var);
        }
        $this->endDate->set($var);
    }
    
    public function getTitle()
    {
        return $this->title->get();
    }
    
    public function getStartDate()
    {
        return $this->startDate->get();
    }

    public function getEndDate()
    {
        return $this->endDate->get();
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
