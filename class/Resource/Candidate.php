<?php

namespace election\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Candidate extends \Resource
{
    /**
     * @var \Variable\String
     */
    protected $first_name;

    /**
     * @var \Variable\String
     */
    protected $last_name;

    /**
     * @var \Variable\File
     */
    protected $picture;

    public function __construct()
    {
        parent::__construct();

        $this->first_name = new \Variable\String(null, 'first_name');
        $this->first_name->setLimit(50);
        $this->last_name = new \Variable\String(null, 'last_name');
        $this->last_name->setLimit(50);
        $this->picture = new \Variable\File(null, 'picture');
    }

}
