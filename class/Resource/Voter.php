<?php

namespace election\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Voter extends \Resource
{
    /**
     *
     * @var \Variable\Hash
     */
    protected $hash;

    public function __construct()
    {
        parent::__construct();
        $this->hash = new \Variable\Hash(null, 'hash');
        $this->hash->setLimit(255);
    }

    public function setHash($var)
    {
        $this->hash->set($var);
    }
    
    public function getHash($var)
    {
        return $this->hash->get();
    }
    

}
