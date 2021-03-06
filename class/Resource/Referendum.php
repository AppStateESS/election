<?php

namespace election\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Referendum extends Ballot
{
    /**
     * @var \Variable\StringVar
     */
    protected $description;

    protected $table = 'elect_referendum';

    public function __construct()
    {
        parent::__construct();
        $this->description = new \phpws2\Variable\StringVar(null, 'description');
    }
    
    public function setDescription($var)
    {
        $this->description->set($var);
    }
    
    public function getDescription()
    {
        return $this->description->get();
    }

}
