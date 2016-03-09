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
        $seatNumber = self::pullPostInteger('seatNumber');
        if ((int)$seatNumber < 1) {
            $seatNumber = 1;
        }
        $multiple->setSeatNumber($seatNumber);
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

    public static function filter(array &$multiple, $student)
    {
        $unqualified = array();
        $categoryListByType = self::categoryListingByType();
        $studentCategories = $student->getVotingCategories();
        foreach ($multiple as $key => $ballot) {
            // ballots without candidates skipped
            if (empty($ballot['candidates'])) {
                unset($multiple[$key]);
            }
            $categoryType = $ballot['category'];
            if (!isset($categoryListByType[$categoryType])) {
                throw new \Exception('Bad category type');
            }
            $category = $categoryListByType[$categoryType];
            if (isset($studentCategories[$category->matchName])) {
                $match = $studentCategories[$category->matchName];
                if (is_array($match)) {
                    $matchValue = $category->matchValue;
                    if (is_array($matchValue)) {
                        $intersect = array_intersect($matchValue, $match);
                        if (empty($intersect)) {
                            unset($multiple[$key]);
                            $unqualified[] = $ballot['title'];
                        }
                    } elseif (!in_array($matchValue, $match)) {
                        unset($multiple[$key]);
                        $unqualified[] = $ballot['title'];
                    }
                } else {
                    if ($category->matchValue !== $match) {
                        unset($multiple[$key]);
                        $unqualified[] = $ballot['title'];
                    }
                }
            } else {
                unset($multiple[$key]);
                $unqualified[] = $ballot['title'];
            }
        }
        //reset index
        $multiple = array_values($multiple);
        return $unqualified;
    }

    private static function categoryListingByType()
    {
        $json = Election::getFilterTypes();
        if (empty($json)) {
            throw new \Exception('Missing election types');
        }
        $types = json_decode($json);
        foreach ($types->electionTypes as $cat) {
            foreach ($cat->subcategory as $sub) {
                $categories[$sub->type] = $sub;
            }
        }
        return $categories;
    }

}
