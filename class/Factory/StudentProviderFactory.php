<?php

namespace election\Factory;

if (!defined('STUDENT_DATA_TEST')) {
    define('STUDENT_DATA_TEST', false);
}
if (!defined('ELECTION_FAKE_STUDENT')) {
    define('ELECTION_FAKE_STUDENT', false);
}

/**
 * StudentDataProviderFactory
 *
 * @author Jeremy Booker
 * @package election
 */
class StudentProviderFactory
{

    /**
     * Returns a concrete instance of a StudenDataProvider object,
     * which can then be used to create Student object
     *
     * @return StudentDataProvider
     */
    public static function getProvider()
    {
        if (STUDENT_DATA_TEST) {
            if (ELECTION_FAKE_STUDENT) {
                return new FakeStudentProvider();
            } else {
                return new TestStudentProvider();
            }
        }

        return new BannerStudentProvider();
    }

}
