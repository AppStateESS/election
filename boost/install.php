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
        $ballot = new \election\Resource\Ballot;
        $ballot->createTable($db);

        $candidate = new \election\Resource\Candidate;
        $candidate->createTable($db);
        
        $referendum = new \election\Resource\Referendum;
        $referendum->createTable($db);
        
        $refOption = new \election\Resource\ReferendumOption;
        $refOption->createTable($db);
        
        $ticket = new \election\Resource\Ticket;
        $ticket->createTable($db);
        
        $voter = new \election\Resource\Voter;
        $voter->createTable($db);

    } catch (\Exception $e) {
        $db->buildTable($ballot->getTable())->drop(true);
        $db->buildTable($candidate->getTable())->drop(true);
        $db->buildTable($referendum->getTable())->drop(true);
        $db->buildTable($refOption->getTable())->drop(true);
        $db->buildTable($ticket->getTable())->drop(true);
        $db->buildTable($voter->getTable())->drop(true);
        
        $db->rollback();
        throw $e;
    }
    $db->commit();

    $content[] = 'Tables created';
    return true;
}
