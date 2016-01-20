<?php

namespace election\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Ballot extends Base
{
    protected $electionId;

    public function __construct()
    {
        parent::__construct();
        $this->electionId = new \Variable\Integer(0, 'electionId');
    }

}
