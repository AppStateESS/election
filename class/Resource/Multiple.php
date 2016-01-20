<?php

namespace election\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Multiple extends Ballot
{
    /**
     * Number of seats a student may vote on
     * @var \Variable\Integer  
     */
    protected $seatNumber;

    /**
     * @var string
     */
    protected $table = 'elect_multiple';

    public function __construct()
    {
        parent::__construct();
        $this->seatNumber = new \Variable\Integer(2, 'seatNumber');
    }

    public function setSeatNumber($var)
    {
        $this->seatNumber->set($var);
    }

    public function getSeatNumber()
    {
        return $this->seatNumber->get();
    }

}
