<?php

namespace election\Factory;

use election\Resource\Single as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Single extends Ballot
{

    public static function post()
    {
        $single = self::build(self::pullPostInteger('singleId'), new Resource);

        $single->setTitle(self::pullPostString('title'));
        $single->setElectionId(self::pullPostInteger('electionId'));

        self::saveResource($single);
    }

    public static function delete($singleId)
    {
        $single = self::build($singleId, new Resource);
        $single->setActive(false);
        self::saveResource($single);
        Ticket::deleteByBallotId($singleId);
    }

    public static function getList($electionId)
    {
        return parent::ballotList($electionId, 'elect_single');
    }
    
}
