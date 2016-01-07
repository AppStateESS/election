<?php

namespace election\Factory;

use election\Resource\Candidate as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Candidate extends Base
{
    public static function getListByTicketId($ticket_id) {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_candidate');
        $tbl->addFieldConditional('ticket_id', $ticket_id);
    }
}
