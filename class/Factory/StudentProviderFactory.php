<?php

namespace election\Factory;

if (!defined('STUDENT_DATA_TEST')) {
    define('STUDENT_DATA_TEST', false);
}

/**
 * StudentDataProviderFactory
 *
 * @author Jeremy Booker
 * @package election
 */
class StudentProviderFactory {

    /**
     * Returns a concrete instance of a StudenDataProvider object,
     * which can then be used to create Student object
     *
     * @return StudentDataProvider
     */
    public static function getProvider()
    {
        if(STUDENT_DATA_TEST){
            return new TestStudentProvider();
        }
        
        return new BannerStudentProvider();
    }
}
