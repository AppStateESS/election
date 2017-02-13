<?php

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */

function election_uninstall(&$content)
{
    $db = \phpws2\Database::newDB();

    $db->buildTable('elect_candidate')->drop(true);
    $db->buildTable('elect_election')->drop(true);
    $db->buildTable('elect_multiple')->drop(true);
    $db->buildTable('elect_multi_chair_vote')->drop(true);
    $db->buildTable('elect_referendum')->drop(true);
    $db->buildTable('elect_referendum_vote')->drop(true);
    $db->buildTable('elect_single')->drop(true);
    $db->buildTable('elect_single_chair_vote')->drop(true);
    $db->buildTable('elect_ticket')->drop(true);
    $db->buildTable('elect_vote_complete')->drop(true);
    return true;
}