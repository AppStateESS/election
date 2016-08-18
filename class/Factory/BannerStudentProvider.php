<?php

namespace election\Factory;

require_once PHPWS_SOURCE_DIR . 'mod/election/vendor/autoload.php';

use election\Resource\Student;
use Guzzle\Http\Client;

if (!defined('STUDENT_DATA_TEST')) {
    define('STUDENT_DATA_TEST', false);
}

/**
 * BannerStudentProvider
 *
 * Returns a Student object with data pulled from a web service connected to Banner.
 *
 * @author Jeremy Booker
 * @package election
 */
class BannerStudentProvider extends StudentProvider
{

    private $client;

    // Student level: grad, undergrad
    const UNDERGRAD = 'U';
    const GRADUATE = 'G';
    const GRADUATE2 = 'G2';
    const DOCTORAL = 'D';
    const POSTDOC = 'P'; // Guessing at the name here, not sure what 'P' really is
    const FRESHMEN = 'Freshman';
    const SOPHOMORE = 'Sophomore';
    const JUNIOR = 'Junior';
    const SENIOR = 'Senior';

    public function __construct()
    {
        // Get the REST API URL from the module's settings
        $apiUrl = \PHPWS_Settings::get('election', 'studentDataApiUrl');

        if (is_null($apiUrl)) {
            throw new \InvalidArgumentException('Student data API url is not configured.');
        }

        // If the URL doesn't end with a trailing slash, then add one
        if (substr($apiUrl, -1) != '/') {
            $apiUrl .= '/';
        }

        // Create a Guzzle instance
        $this->client = new Client($apiUrl);
    }

    /**
     * Returns a Student object
     * @return Student
     */
    public function getStudent($studentId)
    {
        if ($studentId === null || $studentId == '') {
            throw new \InvalidArgumentException('Missing student ID.');
        }
        $json = $this->sendRequest($studentId);

        // Check for error response like ['Message'] = 'An error has occurred.';
        // TODO
        // Log the request
        $this->logRequest('getStudent', 'success', array($studentId));

        // Create the Student object and plugin the values
        $student = new \election\Resource\Student();
        $this->plugValues($student, $json);

        $clubProvider = new ClubCategoriesProvider();
        $clubTypes = $clubProvider->getCategoryListForStudent($student);

        $student->setClubTypes(isset($clubTypes['clubCategories']) ? $clubTypes['clubCategories'] : array());
        $student->setGreekOrgs(isset($clubTypes['greekOrgs']) ? ($clubTypes['greekOrgs']) : array());
        return $student;
    }

    protected function sendRequest($studentId)
    {
        $request = $this->client->get($studentId, null, array('timeout' => 4)); //NB: URL is relative to the base URL from the module's settings

        $response = $request->send();

        return $response->json();
    }

    /**
     * Takes a reference to a Student object and a SOAP response,
     * Plugs the SOAP values into Student object.
     *
     * @param Student $student
     * @param Array $data
     */
    protected function plugValues(&$student, Array $data)
    {
        /**
         * Basic Demographics *
         */
        $student->setBannerId($data['ID']);
        $student->setUsername($data['userName']);

        $student->setFirstName($data['firstName']);
        $student->setLastName($data['lastName']);
        $student->setPreferredName($data['preferredName']);

        /**
         * Academic Info
         */
        // Level (grad vs undergrad)
        if ($data['studentLevel'] == self::UNDERGRAD) {
            $student->setLevel(Student::UNDERGRAD);
        } elseif ($data['studentLevel'] == self::GRADUATE) {
            $student->setLevel(Student::GRADUATE);
        } elseif ($data['studentLevel'] == self::GRADUATE2) {
            $student->setLevel(Student::GRADUATE2);
        } elseif ($data['studentLevel'] == self::DOCTORAL) {
            $student->setLevel(Student::DOCTORAL);
        } elseif ($data['studentLevel'] == self::POSTDOC) {
            $student->setLevel(Student::POSTDOC);
        } else {
            throw new \InvalidArgumentException("Unrecognized student level ({$data['studentLevel']}) for {$data->banner_id}.");
        }

        // Credit Hours
        $student->setCreditHours(isset($data['creditHoursEnrolled']) ? $data['creditHoursEnrolled'] : 0);

        // Type
        $student->setStudentType($data['studentType']);

        // Classification
        //TODO Check the API's actual format and possible values for this field
        $student->setClass($data['classification']);

        // College
        $student->setCollegeCode($data['collegeCode']);
        $student->setCollegeDesc($data['collegeDesc']);
    }

    /**
     * Logs this request to PHPWS' soap.log file
     */
    private function logRequest($functionName, $result, Array $params)
    {
        $args = implode(', ', $params);
        $msg = "$functionName($args) result: $result";
        \PHPWS_Core::log($msg, 'soap.log', 'SOAP');
    }

    public function pullStudentId()
    {
        return preg_replace('/@appstate.edu/', '',
                $_SERVER['HTTP_SHIB_CAMPUSPERMANENTID']);
    }

}
