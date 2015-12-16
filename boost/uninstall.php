<?php

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */

function election_uninstall(&$content)
{
    $db = Database::newDB();

    $db->buildTable('elect_ballot')->drop(true);
    $db->buildTable('elect_candidate')->drop(true);
    $db->buildTable('elect_referendum')->drop(true);
    $db->buildTable('elect_ref_option')->drop(true);
    $db->buildTable('elect_ticket')->drop(true);
    $db->buildTable('elect_voter')->drop(true);
    return true;
}