<?php

namespace election\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Candidate extends \Resource
{
    /**
     * @var \Variable\String
     */
    protected $firstName;

    /**
     * @var \Variable\String
     */
    protected $lastName;

    /**
     * @var \Variable\File
     */
    protected $picture;

    /**
     * @var \Variable\Integer
     */
    protected $ticketId;

    /**
     * @var \Variable\Integer
     */
    protected $ballotId;
    
    /**
     *
     * @var \Variable\Bool
     */
    protected $active;

    /**
     * @var string
     */
    protected $table = 'elect_candidate';

    public function __construct()
    {
        parent::__construct();

        $this->firstName = new \Variable\String(null, 'firstName');
        $this->firstName->setLimit(50);
        $this->lastName = new \Variable\String(null, 'lastName');
        $this->lastName->setLimit(50);
        $this->picture = new \Variable\File(null, 'picture');
        $this->ticketId = new \Variable\Integer(0, 'ticketId');
        $this->ballotId = new \Variable\Integer(0, 'ballotId');
        $this->active = new \Variable\Bool(true, 'active');
    }

    public function setFirstName($var)
    {
        $this->firstName->set($var);
    }

    public function setLastName($var)
    {
        $this->lastName->set($var);
    }

    public function setPicture($var)
    {
        $this->picture->set($var);
    }

    public function setTicketId($var)
    {
        $this->ticketId->set($var);
    }

    public function setBallotId($var)
    {
        $this->ballotId->set($var);
    }

    public function getFirstName()
    {
        return $this->firstName->get();
    }

    public function getLastName()
    {
        return $this->lastName->get();
    }

    public function getPicture()
    {
        return $this->picture->get();
    }

    public function getTicketId()
    {
        return $this->ticketId->get();
    }

    public function getBallotId()
    {
        return $this->ballotId->get();
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
