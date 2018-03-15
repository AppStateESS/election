<?php

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */

function election_update(&$content, $version)
{
    switch (1) {
        case version_compare($version, '1.0.1', '<'):
            $db = \phpws2\Database::getDB();
            $single = $db->addTable('elect_single_chair_vote');
            $single->renameField($single->getField('ballotId'), 'singleId');
            $sdt = new \phpws2\Database\Datatype\Integer($single, 'electionId');
            $sdt->add();
            
            $multiple = $db->addTable('elect_multi_chair_vote');
            $multiple->renameField($multiple->getField('ballotId'), 'multipleId');
            $mdt = new \phpws2\Database\Datatype\Integer($multiple, 'electionId');
            $mdt->add();
            
            $ref = $db->addTable('elect_referendum_vote');
            $rdt = new \phpws2\Database\Datatype\Integer($ref, 'electionId');
            $rdt->add();
            
            $vcomplete = $db->addTable('elect_vote_complete');
            $vhash = $vcomplete->addDataType('voterHash', 'varchar');
            $electionId = $vcomplete->addDataType('electionId', 'int');
            $vcomplete->create();
            
            $voter = $db->addTable('elect_voter');
            $voter->drop(true);
            
        case version_compare($version, '1.0.2', '<'):
            $db = \phpws2\Database::getDB();
            $vcomplete = $db->addTable('elect_vote_complete');
            $vcomplete->renameField($vcomplete->getField('voterHash'), 'bannerId');
            
        case version_compare($version, '1.0.3', '<'):
            $db = \phpws2\Database::getDB();
            $candidate = $db->addTable('elect_candidate');
            $title_column = new \phpws2\Database\Datatype\Varchar($candidate, 'title');
            $title_column->add();
            
        case version_compare($version, '1.0.4', '<'):
            $db = \phpws2\Database::getDB();
            $db->exec('ALTER TABLE elect_single_chair_vote add unique singlevote (voterHash, electionId, singleId)');
            $db->exec('ALTER TABLE elect_multi_chair_vote add unique multivote (voterHash, electionId, multipleId, candidateId);');
            $db->exec('ALTER TABLE elect_referendum_vote add unique refvote (voterHash, electionId, referendumId);');
            $db->exec('ALTER TABLE elect_vote_complete add unique finalvote (bannerId, electionId);');
            $tbl = $db->addTable('elect_referendum_vote');
            $newdt = new \phpws2\Database\Datatype\Varchar($tbl, 'answer', 10);
            $tbl->alter($tbl->getDataType('answer'), $newdt);
            
        case version_compare($version, '2.0.0', '<'):
            $db = \phpws2\Database::getDB();
            $tbl = $db->addTable('elect_multiple');
            $newdt = new \phpws2\Database\Datatype\Text($tbl, 'category');
            $tbl->alter($tbl->getDataType('category'), $newdt);
            
        case version_compare($version, '2.1.0', '<'):
            $content[] = '<pre>';
            $content[] = '2.1.0';
            $content[] = '------';
            $content[] = '+ Added graduate student voting';
            $content[] = '+ Added new transfer logic';
            $content[] = '</pre>';
            
        case version_compare($version, '2.1.1', '<'):
            $content[] = '<pre>';
            $content[] = '2.1.1';
            $content[] = '------';
            $content[] = '+ Added travis';
            $content[] = '+ Updated babel compiler';
            $content[] = '</pre>';
            
        case version_compare($version, '2.1.2', '<'):
            $content[] = '<pre>';
            $content[] = '2.1.2';
            $content[] = '------';
            $content[] = '+ Titles change based on election type';
            $content[] = '</pre>';
        case version_compare($version, '2.1.3', '<'):
            $content[] = '<pre>';
            $content[] = '2.1.3';
            $content[] = '------';
            $content[] = '+ Greek status update.';
            $content[] = '</pre>';
    }
    
    return true;
}