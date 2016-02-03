<?php

namespace election\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 * @author Jeremy Booker
 */
class Student
{
    const LEVEL_UNDERGRAD = 'U';

    private $bannerId;
    private $username;
    private $firstName;
    private $lastName;
    private $emailAddress;

    private $studentType;
    private $isTransfer;
    private $studentLevel;

    private $collegeCode;
    private $collegeDesc;
    private $creditHoursEnrolled;

    public function __construct()
    {

    }

    /**
     * Returns true if the student is currently eligible to vote.
     * @return boolean
     */
    public function isEligibleToVote()
    {
        if($this->creditHoursEnrolled >= 1 && $this->studentType == Student::LEVEL_UNDERGRAD){
            return true;
        }

        return false;
    }
}
