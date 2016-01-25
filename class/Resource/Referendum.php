<?php

namespace election\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Referendum extends Base
{
    /**
     * @var \Variable\String
     */
    protected $title;

    /**
     * @var \Variable\String
     */
    protected $description;

    /**
     * @var \Variable\Integer
     */
    protected $electionId;
    
    protected $table = 'elect_referendum';

    public function __construct()
    {
        parent::__construct();
        $this->title = new \Variable\String(null, 'title');
        $this->title->setLimit(255);
        $this->description = new \Variable\String(null, 'description');
        $this->electionId = new \Variable\Integer(0, 'electionId');
    }

}
