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
     * @var \Variable\CanopyString
     */
    protected $title;

    /**
     * @var \Variable\CanopyString
     */
    protected $platform;

    /**
     * @var \Variable\CanopyString
     */
    protected $siteAddress;

    /**
     * @var string
     */
    protected $table = 'elect_ticket';

    public function __construct()
    {
        parent::__construct();
        $this->singleId = new \phpws2\Variable\Integer(0, 'singleId');
        $this->title = new \phpws2\Variable\CanopyString(null, 'title');
        $this->title->setLimit(100);
        $this->platform = new \phpws2\Variable\CanopyString(null, 'platform');
        $this->platform->allowNull(true);
        $this->platform->setLimit(500);
        $this->siteAddress = new \phpws2\Variable\Url(null, 'siteAddress');
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
