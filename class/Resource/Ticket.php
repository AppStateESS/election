<?php

namespace election\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Ticket extends \Resource
{
    /**
     * @var \Variable\String
     */
    protected $title;
    
    public function __construct()
    {
        parent::__construct();
        
        $this->title = new \Variable\String(null, 'title');
        $this->title->setLimit(200);
        $this->platform = new \Variable\String(null, 'platform');
        $this->site_address = new \Variable\Url(null, 'site_address');
    }
}
