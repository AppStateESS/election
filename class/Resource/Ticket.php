<?php

namespace election\Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Ticket extends Base
{
    /**
     * The ticket is attached to this ballot
     * @var \Variable\Integer
     */
    protected $singleId;

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
     * @var string
     */
    protected $table = 'elect_ticket';

    public function __construct()
    {
        parent::__construct();
        $this->singleId = new \Variable\Integer(0, 'singleId');
        $this->title = new \Variable\String(null, 'title');
        $this->title->setLimit(100);
        $this->platform = new \Variable\String(null, 'platform');
        $this->platform->allowNull(true);
        $this->platform->setLimit(500);
        $this->siteAddress = new \Variable\Url(null, 'siteAddress');
        $this->siteAddress->allowNull(true);
    }

    public function setSingleId($var)
    {
        $this->singleId->set($var);
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

    public function getSingleId()
    {
        return $this->singleId->get();
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

}
