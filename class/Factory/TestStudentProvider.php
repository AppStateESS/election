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


    protected function getFakeResponse()
    {
        $resp = Array();

        $resp['ID'] = '906325016';
        $resp['userName'] = 'BJooker';
        $resp['firstName'] = 'Beremy';
        $resp['lastName'] = 'Jooker';

        $resp['gradYear'] = '18';
        $resp['major'] = '219A';
        $resp['onCampus'] = false;
        $resp['studentLevel'] = 'U';
        $resp['creditHoursEnrolled'] = 14;
        $resp['classification'] = 'Junior';
        $resp['transfer'] = false;
        $resp['studentType'] = 'C';
        $resp['collegeCode'] = 'AS';
        $resp['collegeDesc'] = 'College of Arts & Sciences';
        $resp['collegeCode'] = 'AS';
        $resp['collegeDesc'] = 'College of Arts & Sciences';
        return $resp;
    }

    private function getFakeErrorResponse()
    {
        $obj = new \stdClass();

        $obj->banner_id = '900123456';

        return $obj;
    }
}
