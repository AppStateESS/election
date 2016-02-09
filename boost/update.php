<?php

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */

function election_update(&$content, $version)
{
    switch (1) {
        case version_compare($version, '1.0.1', '<'):
            $db = \Database::getDB();
            $single = $db->addTable('elect_single_chair_vote');
            $single->renameField($single->getField('ballotId'), 'singleId');
            $sdt = new \Database\Datatype\Integer($single, 'electionId');
            $sdt->add();
            
            $multiple = $db->addTable('elect_multi_chair_vote');
            $multiple->renameField($multiple->getField('ballotId'), 'multipleId');
            $mdt = new \Database\Datatype\Integer($multiple, 'electionId');
            $mdt->add();
            
            $ref = $db->addTable('elect_referendum_vote');
            $rdt = new \Database\Datatype\Integer($ref, 'electionId');
            $rdt->add();
            
            $vcomplete = $db->addTable('elect_vote_complete');
            $vhash = $vcomplete->addDataType('voterHash', 'varchar');
            $electionId = $vcomplete->addDataType('electionId', 'int');
            $vcomplete->create();
            
            $voter = $db->addTable('elect_voter');
            $voter->drop(true);
            
        case version_compare($version, '1.0.2', '<'):
            $db = \Database::getDB();
            $vcomplete = $db->addTable('elect_vote_complete');
            $vcomplete->renameField($vcomplete->getField('voterHash'), 'bannerId');
            
        case version_compare($version, '1.0.3', '<'):
            $db = \Database::getDB();
            $candidate = $db->addTable('elect_candidate');
            $title_column = new \Database\Datatype\Varchar($candidate, 'title');
            $title_column->add();
            
        case version_compare($version, '1.0.4', '<'):
            $db = \Database::getDB();
            $db->exec('ALTER TABLE elect_single_chair_vote add unique singlevote (voterHash, electionId, singleId)');
            $db->exec('ALTER TABLE elect_multi_chair_vote add unique multivote (voterHash, electionId, multipleId, candidateId);');
            $db->exec('ALTER TABLE elect_referendum_vote add unique refvote (voterHash, electionId, referendumId);');
            $db->exec('ALTER TABLE elect_vote_complete add unique finalvote (bannerId, electionId);');
            $tbl = $db->addTable('elect_referendum_vote');
            $newdt = new \Database\Datatype\Varchar($tbl, 'answer', 10);
            $tbl->alter($tbl->getDataType('answer'), $newdt);
    }
    
    return true;
}