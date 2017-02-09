<?php

namespace election\Resource;

define('EMAIL_USERNAME_SUFFIX', '@appstate.edu');

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 * @author Jeremy Booker
 */
class Student
{

    const UNDERGRAD = 'ugrad';
    const GRADUATE = 'grad';
    const GRADUATE2 = 'grad2';
    const DOCTORAL = 'doctoral';
    const POSTDOC = 'postdoc';
    const CLASS_FR = 'Freshman';
    const CLASS_SO = 'Sophomore';
    const CLASS_JR = 'Junior';
    const CLASS_SR = 'Senior';

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
    private $clubTypes; // Array of club types for voting eligibility
    private $greekOrgs;
    private $preferredName;

    public function __construct()
    {
        
    }

    /**
     * Returns true if the student is currently eligible to vote.
     * @return boolean
     */
    public function isEligibleToVote()
    {
        if ($this->creditHours >= 1 && $this->level == Student::UNDERGRAD) {
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
        if (!isset($electionId) || $electionId == '') {
            throw new \InvalidArgumentException('Missing election id.');
        }

        if (!isset($this->bannerId) || $this->bannerId == '') {
            throw new \InvalidArgumentException('Missing banner ID.');
        }

        $db = \phpws2\Database::getDB();
        $vote = $db->addTable('elect_vote_complete');
        $vote->addFieldConditional('electionId', $electionId);
        $vote->addFieldConditional('bannerId', $this->bannerId);
        $result = $db->selectOneRow();

        return (bool) $result;
    }

    /**
     * Returns an array of category names this student is eligible to vote in
     */
    public function getVotingCategories()
    {
        // Get their class category (fresh/soph/jr/sr)
        $classCategory = $this->getClassCategory();

        // Get the college category
        $collegeCategory = $this->getCollegeCategory();

        // Get the club & org categories
        // TODO
        $clubAffiliation = $this->getClubAffiliation();

        $greekLife = $this->getGreekList();

        // Put the lists together
        return array('Class' => $classCategory, 'College' => $collegeCategory, 'Club Affiliation' => $clubAffiliation,
            'Greek Life' => $greekLife, 'Student Type' => $this->getStudentType());
    }

    private function getClassCategory()
    {
        switch ($this->class) {
            case self::CLASS_FR:
                return self::CLASS_FR;
            case self::CLASS_SO:
                return self::CLASS_SO;
            case self::CLASS_JR:
                return self::CLASS_JR;
            case self::CLASS_SR:
                return self::CLASS_SR;
            default:
                return null;
        }
    }

    public function getCollegeCategory()
    {
        return $this->collegeCode;
    }

    public function getClubAffiliation()
    {
        $clubs = $this->clubTypes;
        return $clubs;
    }

    public function getGreekList()
    {
        $greeks = array();
        $affil = null;
        include PHPWS_SOURCE_DIR . 'mod/election/inc/greek.php';

        foreach ($this->greekOrgs as $greek_title) {
            if (isset($greeks[$greek_title])) {
                $affil[] = $greeks[$greek_title];
            }
        }
        return $affil;
    }

    public function isMemberOfClubType($type)
    {
        if (in_array($type, $this->clubTypes)) {
            return true;
        }

        return false;
    }

    public function getBannerId()
    {
        return $this->bannerId;
    }

    public function getStudentType()
    {
        return $this->studentType;
    }

    public function setBannerId($id)
    {
        $this->bannerId = $id;
    }

    public function getUsername()
    {
        return $this->username;
    }

    public function setUsername($username)
    {
        $this->username = $username;
    }

    public function setFirstName($firstName)
    {
        $this->firstName = $firstName;
    }

    public function setPreferredName($name)
    {
        $this->preferredName = $name;
    }

    public function setLastName($lastName)
    {
        $this->lastName = $lastName;
    }

    public function getFullName()
    {
        if (!empty($this->preferredName)) {
            $first_name = $this->preferredName;
        } else {
            $first_name = $this->firstName;
        }

        return $first_name . ' ' . $this->lastName;
    }

    public function setLevel($level)
    {
        $this->level = $level;
    }

    public function setCreditHours($hours)
    {
        $this->creditHours = $hours;
    }

    public function setClass($class)
    {
        $this->class = $class;
    }

    public function setCollegeCode($code)
    {
        $this->collegeCode = $code;
    }

    public function setCollegeDesc($desc)
    {
        $this->collegeDesc = $desc;
    }

    public function setStudentType($type)
    {
        $this->studentType = $type;

        // TODO: set $this->isTransfer
    }

    public function setIsTransfer($transfer)
    {
        $this->isTransfer = (bool) $transfer;
    }

    public function getIsTransfer()
    {
        return $this->isTransfer;
    }

    public function getClubTypes()
    {
        return $this->clubTypes;
    }

    public function setClubTypes(Array $clubTypes)
    {
        $this->clubTypes = $clubTypes;
    }

    public function setGreekOrgs(Array $greekOrgs)
    {
        $this->greekOrgs = $greekOrgs;
    }

    public function getEmail()
    {
        return $this->username . EMAIL_USERNAME_SUFFIX;
    }

}
