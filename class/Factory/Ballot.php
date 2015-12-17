<?php

namespace election\Factory;

use election\Resource\Ballot as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Ballot extends Base
{

    public static function post()
    {
        $ballot = self::build(self::pullPostInteger('ballotId'));
        
        $ballot->setTitle(self::pullPostString('title'));
        $ballot->setStartDate(self::pullPostString('startDate'));
        $ballot->setEndDate(self::pullPostString('endDate'));
        
        $seats = self::pullPostInteger('seatNumber');
        if ($seats) {
            // no seats will set as single seat ballot
            $ballot->setSeatNumber($seats);
        }
        
        self::saveResource($ballot);
    }

    
    public static function build($id = 0)
    {
        $ballot = new Resource;
        if ($id) {
            $ballot->setId($id);
            if (!parent::loadByID($ballot)) {
                throw new \Exception('Ballot id not found:' . $id);
            }
        }
        return $ballot;
    }

}
