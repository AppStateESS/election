<?php

namespace election\Factory;

use Guzzle\Http\Client;

/**
 * BannerStudentProvider
 *
 * Returns a Student object with data pulled from a web service connected to Banner.
 *
 * @author Jeremy Booker
 * @package election
 */
class BannerStudentProvider extends StudentProvider {

    private $client;

    // Campus: main campus, distance ed
    const MAIN_CAMPUS = 'Main Campus';

    // Student level: grad, undergrad
    const UNDERGRAD = 'U';
    const GRADUATE  = 'G';
    const GRADUATE2 = 'G2';
    const DOCTORAL  = 'D';
    const POSTDOC   = 'P'; // Guessing at the name here, not sure what 'P' really is

    public function __construct()
    {
        // Get the REST API URL from the module's settings
        $apiUrl = \PHPWS_Settings::get('election', 'studentDataApiUrl');

        // If the URL doesn't end with a trailing slash, then add one
        if($substr($apiUrl, -1) != '/'){
            $apiUrl .= '/';
        }

        // Create a Guzzle instance
        $this->client = new Client($apiUrl);
    }

    /**
     * Returns a Student object with hard-coded data
     * @return Student
     */
    public function getStudent($studentId)
    {
        if($studentId === null || $studentId == ''){
            throw new \InvalidArgumentException('Missing student ID.');
        }

        $json = $response->sendRequest($studentId);

        // Check for error response like ['Message'] = 'An error has occurred.';
        // TODO

        // Log the request
        $this->logRequest('getStudent', 'success', $params);

        // Create the Student object and plugin the values
        $student = new Student();
        $this->plugValues($student, $response);

        return $student;
    }

    protected function sendRequest($studentId)
    {
        $request = $this->client->get($studentId); //NB: URL is relative to the base URL from the module's settings

        $response = $request->send();

        return $response->json();
    }

    /**
     * Takes a reference to a Student object and a SOAP response,
     * Plugs the SOAP values into Student object.
     *
     * @param Student $student
     * @param stdClass $data
     */
    protected function plugValues(&$student, \stdClass $data)
    {
        /**********************
         * Basic Demographics *
         **********************/
        $student->setStudentId($data->banner_id);
        $student->setUsername($data->user_name);

        $student->setFirstName($data->first_name);
        $student->setLastName($data->last_name);

        /*****************
         * Academic Info *
         *****************/

        // Campus
        if($data->campus == BannerStudentProvider::MAIN_CAMPUS) {
            // If campus is 'Main Campus', then we know it's a main campus student
            $student->setCampus(Student::MAIN_CAMPUS);
        } else if ($data->campus != '') {
            // If the campus is set, but is not 'Main Campus', then we know it's some other campus name (e.g. "Catawba EdD EdLead")
            // We're not going to check for every possible campus name; as long as there's *something* there, we'll assume it's distance ed
            $student->setCampus(Student::DISTANCE_ED);
        } else {
            // If the campus isn't set, then throw an exception
            //throw new \InvalidArgumentException("Unrecognized campus ({$data->campus}) for {$data->banner_id}.");
        }

        // Level (grad vs undergrad)
        if($data->level == self::UNDERGRAD) {
            $student->setLevel(Student::UNDERGRAD);
        } else if ($data->level == self::GRADUATE) {
            $student->setLevel(Student::GRADUATE);
        } else if ($data->level == self::GRADUATE2) {
            $student->setLevel(Student::GRADUATE2);
        } else if ($data->level == self::DOCTORAL) {
            $student->setLevel(Student::DOCTORAL);
        } else if ($data->level == self::POSTDOC) {
            $student->setLevel(Student::POSTDOC);
        } else {
            throw new \InvalidArgumentException("Unrecognized student level ({$data->level}) for {$data->banner_id}.");
        }

        // Credit Hours
        $student->setCreditHours($data->creditHours);
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
}
