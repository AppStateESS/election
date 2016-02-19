<?php

namespace election\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 * @author Jeremy Booker
 */
class Student
{
    const UNDERGRAD = 'ugrad';
    const GRADUATE  = 'grad';
    const GRADUATE2 = 'grad2';
    const DOCTORAL  = 'doctoral';
    const POSTDOC   = 'postdoc';

    private $bannerId;
    private $username;
    private $firstName;
    private $lastName;

    private $studentType;
    private $isTransfer;
    private $level;
    private $class;

    private $collegeCode;
    private $collegeDesc;
    private $creditHours;

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

    /**
     * Determines whether a student has voted in given election
     *
     * @param   int $electionId The id of the election to check for votes in
     * @return  bool True if the student has voted in the given election, false otherwise
     */
    public function hasVoted($electionId)
    {
        if(!isset($electionId) || $electionId == ''){
            throw new \InvalidArgumentException('Missing election id.');
        }

        if(!isset($this->bannerId) || $this->bannerId == ''){
            throw new \InvalidArgumentException('Missing banner ID.');
        }

        $db = \Database::getDB();
        $vote = $db->addTable('elect_vote_complete');
        $vote->addFieldConditional('electionId', $electionId);
        $vote->addFieldConditional('bannerId', $this->bannerId);
        $result = $db->selectOneRow();

        return (bool)$result;
    }

    public function getBannerId(){
        return $this->bannerId;
    }

    public function setBannerId($id){
        $this->bannerId = $id;
    }

    public function setUsername($username){
        $this->username = $username;
    }

    public function setFirstName($firstName){
        $this->firstName = $firstName;
    }

    public function setLastName($lastName){
        $this->lastName = $lastName;
    }

    public function setLevel($level){
        $this->level = $level;
    }

    public function setCreditHours($hours){
        $this->creditHours = $hours;
    }

    public function setClass($class){
        $this->class = $class;
    }

    public function setCollegeCode($code){
        $this->collegeCode = $code;
    }

    public function setCollegeDesc($desc){
        $this->collegeDesc = $desc;
    }

    public function setStudentType($type){
        $this->studentType = $type;

        // TODO: set $this->isTransfer
    }
}
