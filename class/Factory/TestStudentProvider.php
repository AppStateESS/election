<?php

namespace election\Factory;

/**
 * TestStudentProvider - Always returns student objects with hard-coded testing data
 *
 * @author Jeremy Booker
 * @package election
 */
class TestStudentProvider extends BannerStudentProvider {

    /**
     * Empty constructor to overwrite parent's constructor.
     */
    public function __construct() {
    }

    protected function sendRequest($studentId)
    {
        return $this->getFakeResponse();
        //return $this->getFakeErrorResponse();
    }


    private function getFakeResponse()
    {
        $resp = Array();

        $resp['ID'] = '900325006';
        $resp['userName'] = 'jb67803';
        $resp['firstName'] = 'Jeremy';
        $resp['lastName'] = 'Booker';

        $resp['studentLevel'] = \election\Resource\Student::UNDERGRAD;

        $resp['classification'] = 'Junior'; //TODO Check the API's actual format and possible values for this field

        // TODO Check API's possible values here
        $resp['collegeCode'] = 'AS';
        $resp['collegeDesc'] = 'College of Arts & Sciences';

        return json_encode($resp);
    }

    private function getFakeErrorResponse()
    {
        $obj = new \stdClass();

        $obj->banner_id = '900123456';

        return $obj;
    }
}
