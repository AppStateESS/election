<?php

namespace election\Controller\User;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
abstract class Base extends \election\Controller\Base
{
    protected $student;
    
    protected $message;

    public function setStudent(\election\Resource\Student $student){
        $this->student = $student;
    }
}
