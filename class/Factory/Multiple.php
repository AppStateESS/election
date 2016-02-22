<?php

namespace election\Factory;

use election\Resource\Multiple as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Multiple extends Ballot
{

    public static function post()
    {
        $multiple = self::build(self::pullPostInteger('multipleId'), new Resource);

        $multiple->setTitle(self::pullPostString('title'));
        $multiple->setSeatNumber(self::pullPostInteger('seatNumber'));
        $multiple->setElectionId(self::pullPostInteger('electionId'));
        $multiple->setCategory(self::pullPostString('category'));

        self::saveResource($multiple);
    }

    public static function delete($multipleId)
    {
        if (empty($multipleId)) {
            throw new \Exception('Missing id');
        }
        $multiple = self::build($multipleId, new Resource);
        $multiple->setActive(false);
        self::saveResource($multiple);
    }

    public static function getList($electionId)
    {
        return parent::ballotList($electionId, 'elect_multiple');
    }

    public static function getListWithCandidates($electionId)
    {
        $multiple = self::getList($electionId);
        if (empty($multiple)) {
            return array();
        }

        foreach ($multiple as &$value) {
            $candidates = Candidate::getCandidateList($value['id']);
            $value['candidates'] = $candidates;
        }
        return $multiple;
    }

    public static function filter(array $multiple, $student)
    {
        foreach ($multiple as $ballot) {
            $category = $ballot['category'];
        }
    }

}
