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
    protected $first_name;

    /**
     * @var \Variable\String
     */
    protected $last_name;

    /**
     * @var \Variable\File
     */
    protected $picture;

    /**
     * @var \Variable\Integer
     */
    protected $ticket_id;

    /**
     * @var \Variable\Integer
     */
    protected $ballot_id;

    /**
     * @var string
     */
    protected $table = 'elect_candidate';

    public function __construct()
    {
        parent::__construct();

        $this->first_name = new \Variable\String(null, 'first_name');
        $this->first_name->setLimit(50);
        $this->last_name = new \Variable\String(null, 'last_name');
        $this->last_name->setLimit(50);
        $this->picture = new \Variable\File(null, 'picture');
        $this->ticket_id = new \Variable\Integer(0, 'ticket_id');
        $this->ballot_id = new \Variable\Integer(0, 'ballot_id');
    }

    public function setFirstName($var)
    {
        $this->first_name->set($var);
    }

    public function setLastName($var)
    {
        $this->last_name->set($var);
    }

    public function setPicture($var)
    {
        $this->picture->set($var);
    }

    public function setTicketId($var)
    {
        $this->ticket_id->set($var);
    }

    public function setBallotId($var)
    {
        $this->ballot_id->set($var);
    }

    public function getFirstName()
    {
        return $this->first_name->get();
    }

    public function getLastName()
    {
        return $this->last_name->get();
    }

    public function getPicture()
    {
        return $this->picture->get();
    }

    public function getTicketId()
    {
        return $this->ticket_id->get();
    }

    public function getBallotId()
    {
        return $this->ballot_id->get();
    }

}
