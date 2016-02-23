<?php

namespace election\Factory;

use Guzzle\Http\Client;
use election\resource\Student as Student;

/**
 * ClubCategoriesProvider - Responsible for getting club categories from SDR's API
 *
 * @author Jeremy Booker
 * @package election
 */
class ClubCategoriesProvider {

    private $client; // Guzzle HTTP client
    private $apiUrl;

    public function __construct()
    {
        $this->apiUrl = \PHPWS_Settings::get('election', 'studentOrgApiUrl');

        if(is_null($this->apiUrl)){
            throw new \InvalidArgumentException('Student org API url is not configured.');
        }

        // Create a Guzzle instance
        $this->client = new Client($this->apiUrl, array('request.options'=>array('verify'=>false)));
    }

    public function getCategoryListForStudent(Student $student)
    {
        // Send the request, final URL is relative to API URL that's set in the constructor above
        $json = $this->sendRequest($student->getUsername());

        // TODO error checking?

        // Log the request
        $this->logRequest('getCategoryListForStudent', 'success', array($student->getUsername()));

        return $json;
    }

    public function sendRequest($username){
        $request = $this->client->get($this->apiUrl . '&username=' . $username);

        $response = $request->send();

        return $response->json();
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
