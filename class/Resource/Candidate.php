<?php

namespace election\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Candidate extends Base
{
    /**
     * @var \Variable\StringVar
     */
    protected $firstName;

    /**
     * @var \Variable\StringVar
     */
    protected $lastName;

    /**
     * @var \Variable\FileVar
     */
    protected $picture;

    /**
     * @var \Variable\StringVar
     */
    protected $title;

    /**
     * @var \Variable\IntegerVar
     */
    protected $ticketId;

    /**
     * @var \Variable\IntegerVar
     */
    protected $multipleId;

    /**
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

        $this->firstName = new \phpws2\Variable\StringVar(null, 'firstName');
        $this->firstName->setLimit(50);
        $this->lastName = new \phpws2\Variable\StringVar(null, 'lastName');
        $this->lastName->setLimit(50);
        $this->title = new \phpws2\Variable\StringVar('', 'title');
        $this->title->setLimit(100);
        $this->picture = new \phpws2\Variable\FileVar(null, 'picture');
        $this->ticketId = new \phpws2\Variable\IntegerVar(0, 'ticketId');
        $this->multipleId = new \phpws2\Variable\IntegerVar(0, 'multipleId');
        $this->active = new \phpws2\Variable\BooleanVar(true, 'active');
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

    public function setMultipleId($var)
    {
        $this->multipleId->set($var);
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

    public function getMultipleId()
    {
        return $this->multipleId->get();
    }

    public function setActive($var)
    {
        $this->active->set($var);
    }

    public function getActive()
    {
        return $this->active->get();
    }

    public function setTitle($var)
    {
        $this->title->set($var);
    }

    public function getTitle()
    {
        return $this->title->get();
    }

}
