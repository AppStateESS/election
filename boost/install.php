<?php

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
function election_install(&$content)
{
    $db = Database::newDB();
    $db->begin();

    try {
        $election = new \election\Resource\Election;
        $election->createTable($db);
        
        $single = new \election\Resource\Single;
        $single->createTable($db);
        
        $multiple = new \election\Resource\Multiple;
        $multiple->createTable($db);

        $candidate = new \election\Resource\Candidate;
        $candidate->createTable($db);
        
        $referendum = new \election\Resource\Referendum;
        $referendum->createTable($db);
        
        $ticket = new \election\Resource\Ticket;
        $ticket->createTable($db);
        
        $voter = new \election\Resource\Voter;
        $voter->createTable($db);

    } catch (\Exception $e) {
        $db->buildTable($election->getTable())->drop(true);
        $db->buildTable($single->getTable())->drop(true);
        $db->buildTable($multiple->getTable())->drop(true);
        $db->buildTable($candidate->getTable())->drop(true);
        $db->buildTable($referendum->getTable())->drop(true);
        $db->buildTable($ticket->getTable())->drop(true);
        $db->buildTable($voter->getTable())->drop(true);
        
        $db->rollback();
        throw $e;
    }
    $db->commit();

    $content[] = 'Tables created';
    return true;
}
