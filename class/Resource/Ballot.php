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
    protected $seat_number;
    
    protected $table = 'elect_ballot';

    public function __construct()
    {
        parent::__construct();
        // default is one seat: a ticket ballot
        $this->seat_number = new \Variable\Integer(1, 'seat_number');
    }
    
    public function setSeatNumber($var)
    {
        $this->seat_number->set($var);
    }
    
    public function getSeatNumber()
    {
        return $this->seat_number->get();
    }

}
