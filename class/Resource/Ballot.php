<?php

namespace election\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Ballot extends Measure
{
    /**
     * Number of seats a student may vote on
     * @var \Variable\Integer  
     */
    protected $seatNumber;
    
    protected $table = 'elect_ballot';

    public function __construct()
    {
        parent::__construct();
        // default is one seat: a ticket ballot
        $this->seatNumber = new \Variable\Integer(1, 'seatNumber');
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
