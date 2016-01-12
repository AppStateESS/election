<?php

namespace election\Factory;

use election\Resource\Ticket as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Ticket extends Base
{

    public static function getList()
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_ticket');
        $tbl->addFieldConditional('active', 1);
        $result = $db->select();
        return $result;
    }

    public static function post()
    {
        $ticket = self::build(self::pullPostInteger('ticketId'), new Resource);

        $ticket->setBallotId(self::pullPostInteger('ballotId'));
        $ticket->setTitle(self::pullPostString('title'));
        $ticket->setPlatform(self::pullPostString('platform'));
        $siteAddress = self::pullPostString('siteAddress');

        if (!empty($siteAddress)) {
            if (!preg_match('@^https?:\/\/@', $siteAddress)) {
                $siteAddress = 'http://' . $siteAddress;
            }
        }
        $ticket->setSiteAddress($siteAddress);

        self::saveResource($ticket);
    }

    public static function checkURL($url)
    {
        if (!preg_match('@^https?:\/\/@', $url)) {
            $url = 'http://' . $url;
        }
        try {
            $i = new \Variable\Url($url);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
    
    public static function delete($ticketId)
    {
        if (empty($ticketId)) {
            throw new \Exception('Missing ticket id');
        }
        $ticket = self::build($ticketId, new Resource);
        $ticket->setActive(false);
        self::saveResource($ticket);
    }
    
    public static function deleteByBallot($ballotId)
    {
        if (empty($ballotId)) {
            throw new \Exception('Missing ballot id');
        }
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_ticket');
        $tbl->addFieldConditional('ballotId', $ballotId);
        $tbl->addValue('active', 0);
        $db->update();
    }

}
