<?php

namespace election\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Ballot extends Base
{
    /**
     * Name of the ballot
     * @var \Variable\StringVar 
     */
    protected $title;

    /**
     * @var \Variable\IntegerVar
     */
    protected $electionId;

    public function __construct()
    {
        parent::__construct();
        $this->title = new \phpws2\Variable\StringVar(null, 'title');
        $this->title->setLimit(100);
        $this->title->allowEmpty(false);
        $this->electionId = new \phpws2\Variable\IntegerVar(0, 'electionId');
        $this->electionId->setRange(1);
    }

    public function setTitle($var)
    {
        $this->title->set($var);
    }

    public function getTitle()
    {
        return $this->title->get();
    }

    public function setElectionId($var)
    {
        $this->electionId->set($var);
    }

    public function getElectionId()
    {
        return $this->electionId->get();
    }

}
