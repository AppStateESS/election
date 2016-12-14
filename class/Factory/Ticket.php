<?php

namespace election\Factory;

use election\Resource\Ticket as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Ticket extends Base
{

    public static function getList($singleId, $random = false)
    {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_ticket');
        $tbl->addFieldConditional('singleId', $singleId);
        $tbl->addFieldConditional('active', 1);
        if ($random) {
            $tbl->randomOrder();
        } else {
            $tbl->addOrderBy('title');
        }
        $result = $db->select();
        return $result;
    }

    public static function post()
    {
        $ticketId = self::pullPostInteger('ticketId');
        $singleId = self::pullPostInteger('singleId');
        $ticket = self::build($ticketId, new Resource);

        if (!$ticketId) {
            $single = Single::build($singleId, new \election\Resource\Single);
            $electionId = $single->getElectionId();
            if (!Election::allowChange($electionId)) {
                throw new \Exception('Cannot create new ticket in ongoing election');
            }
        }

        $ticket->setSingleId($singleId);
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
            $i = new \phpws2\Variable\Url($url);
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
        $electionId = self::getElectionId($ticket->getId());
        if (!Election::allowChange($electionId)) {
            throw new \Exception('Cannot delete a ticket in ongoing election');
        }

        $ticket->setActive(false);
        self::saveResource($ticket);
    }

    /**
     * Returns an array of tickets within a single chair ballot.
     * 
     * Candidates ARE REQUIRED. A ticket without candidates is unset.
     * 
     * @param type $singleId
     * @param type $random If true, the candidates are returned in a random order.
     *  If false, the order is alphabetical.
     * @return array
     */
    public static function getListWithCandidates($singleId, $random = true)
    {
        $tickets = self::getList($singleId, $random);
        if (empty($tickets)) {
            return array();
        }

        foreach ($tickets as $key => &$value) {
            $candidates = null;
            $candidates = Candidate::getTicketList($value['id']);
            if (empty($candidates)) {
                unset($tickets[$key]);
            } else {
                $value['candidates'] = $candidates;
            }
        }
        return $tickets;
    }

    /**
     * Return the election id for specific ticket
     * @param type $ticketId
     * @return type
     */
    public static function getElectionId($ticketId)
    {
        $db = \Database::getDB();
        $ticketTable = $db->addTable('elect_ticket', null, false);
        $ticketTable->addFieldConditional('id', $ticketId);
        $singleTable = $db->addTable('elect_single', null, false);
        $singleTable->addField('electionId');

        $db->joinResources($singleTable, $ticketTable, new \Database\Conditional($db, $singleTable->getField('id'), $ticketTable->getField('singleId'), '='));

        $db->loadSelectStatement();
        $result = $db->fetchColumn();
        return $result;
    }

}
