<?php

namespace election\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Ticket extends \Resource
{
    
    /**
     * The ticket is attached to this ballot
     * @var \Variable\Integer
     */
    protected $ballot_id;
    
    /**
     * @var \Variable\String
     */
    protected $title;

    /**
     * @var \Variable\String
     */
    protected $platform;

    /**
     * @var \Variable\String
     */
    protected $site_address;
    
    /**
     * @var \Variable\Integer
     */
    protected $active;
    
    /**
     * @var string
     */
    protected $table = 'elect_ticket';

    public function __construct()
    {
        parent::__construct();

        $this->ballot_id = new \Variable\Integer(0, 'ballot_id');
        $this->title = new \Variable\String(null, 'title');
        $this->title->setLimit(200);
        $this->platform = new \Variable\String(null, 'platform');
        $this->platform->allowNull(true);
        $this->site_address = new \Variable\Url(null, 'site_address');
        $this->site_address->allowNull(true);
        $this->active = new \Variable\Bool(true, 'active');
    }

    public function setBallotId($var)
    {
        $this->ballot_id->set($var);
    }
    
    public function setTitle($var)
    {
        $this->title->set($var);
    }

    public function setPlatform($var)
    {
        $this->platform->set($var);
    }

    public function setSiteAddress($var)
    {
        $this->site_address->set($var);
    }
    
    public function getBallotId()
    {
        return $this->ballot_id->get();
    }

    public function getTitle()
    {
        return $this->title->get();
    }

    public function getPlatform()
    {
        return $this->platform->get();
    }

    public function getSiteAddress()
    {
        return $this->site_address->get();
    }

    public function setActive($active)
    {
        $this->active->set($active);
    }
    
    public function getActive()
    {
        return $this->active->get();
    }
}
