<?php

namespace election\Factory;

/**
 * TestStudentProvider - Always returns student objects with hard-coded testing data
 *
 * @author Jeremy Booker
 * @package election
 */
class TestStudentProvider extends BannerStudentProvider {

    public function pullStudentId()
    {
        return TEST_STUDENT_ID;
    }
}
