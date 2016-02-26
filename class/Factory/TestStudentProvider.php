<?php

namespace election\Factory;

/**
 * TestStudentProvider - Always returns student objects with hard-coded testing data
 *
 * @author Jeremy Booker
 * @package election
 */
class TestStudentProvider extends BannerStudentProvider {

    protected function getFakeResponse()
    {
        $resp = Array();

        $resp['ID'] = '900123456';
        $resp['userName'] = 'BJooker';
        $resp['firstName'] = 'Beremy';
        $resp['lastName'] = 'Jooker';

        $resp['gradYear'] = '18';
        $resp['major'] = '219A';
        $resp['onCampus'] = false;
        $resp['studentLevel'] = BannerStudentProvider::UNDERGRAD;
        $resp['creditHoursEnrolled'] = 14;
        $resp['classification'] = BannerStudentProvider::JUNIOR;
        $resp['transfer'] = false;
        $resp['studentType'] = 'C';
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
    
    public function pullStudentId()
    {
        return TEST_STUDENT_ID;
    }
}
