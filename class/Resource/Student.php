<?php

namespace election\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 * @author Jeremy Booker
 */
class Student
{
    protected $bannerId;
    protected $firstName;
    protected $lastName;

    public function __construct()
    {
        $this->bannerId = new \Variable\Integer(null, 'bannerId');
        $this->firstName = new \Variable\String(null, 'firstName');
        $this->lastName = new \Variable\String(null, 'lastName');
    }
}
