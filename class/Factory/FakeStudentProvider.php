<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace election\Factory;

/**
 * Description of FakeStudentProvider
 *
 * @author matt
 */
class FakeStudentProvider extends BannerStudentProvider
{
    public function __construct(){}


    public function pullStudentId()
    {
        return 'bjooker';
    }

    protected function sendRequest($studentId)
    {
        $json = Array();

        $json['ID'] = '900123456';
        $json['userName'] = 'bjooker';
        $json['firstName'] = 'Beremy';
        $json['lastName'] = 'Jooker';
        $json['preferredName'] = 'BeJe';
        $json['emailAddress'] = 'jbe@nasdasd.com';

        $json['gradYear'] = '18';
        $json['major'] = '219A';
        $json['onCampus'] = false;
        $json['studentLevel'] = BannerStudentProvider::UNDERGRAD;
        $json['creditHoursEnrolled'] = 14;
        $json['classification'] = BannerStudentProvider::FRESHMEN;
        $json['transfer'] = false;
        $json['studentType'] = 'C';
        $json['collegeCode'] = 'AS';
        $json['collegeDesc'] = 'College of Arts & Sciences';
        return $json;
    }

}
