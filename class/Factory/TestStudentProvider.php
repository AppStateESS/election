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
        $obj = new \stdClass();

        // ID & email
        $obj->banner_id = '900123456';
        $obj->user_name = 'jb67803';
        $obj->email     = 'jb67803@appstate.edu';

        // Basic demographics
        $obj->first_name    = 'Jeremy';
        $obj->last_name     = 'Booker';
        $obj->preferred_name = 'j-dogg';

        return $obj;
    }

    private function getFakeErrorResponse()
    {
        $obj = new \stdClass();

        $obj->banner_id = '900123456';

        return $obj;
    }
}
