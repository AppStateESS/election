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
    protected $ballotId;
    
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
    protected $siteAddress;
    
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

        $this->ballotId = new \Variable\Integer(0, 'ballotId');
        $this->title = new \Variable\String(null, 'title');
        $this->title->setLimit(200);
        $this->platform = new \Variable\String(null, 'platform');
        $this->platform->allowNull(true);
        $this->siteAddress = new \Variable\Url(null, 'siteAddress');
        $this->siteAddress->allowNull(true);
        $this->active = new \Variable\Bool(true, 'active');
    }

    public function setBallotId($var)
    {
        $this->ballotId->set($var);
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
        $this->siteAddress->set($var);
    }
    
    public function getBallotId()
    {
        return $this->ballotId->get();
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
        return $this->siteAddress->get();
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
