<?php

namespace election\Factory;

use election\Resource\Candidate as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Candidate extends Base
{

    public static function post()
    {
        $candidateId = self::pullPostInteger('candidateId');
        $candidate = self::build($candidateId, new Resource);

        $type = self::pullPostString('type');

        if ($type == 'ticket') {
            $candidate->setTicketId((int) self::pullPostInteger('ticketId'));
        } elseif ($type === 'multiple') {
            $candidate->setMultipleId((int) self::pullPostInteger('multipleId'));
        } else {
            throw new \Exception('Unknown candidate type');
        }

        $ticket_id = $candidate->getTicketId();
        $multiple_id = $candidate->getMultipleId();

        if ((int) $ticket_id === 0 && (int) $multiple_id === 0) {
            throw new \Exception('Missing candidate foreign key');
        }

        /**
         * If this is a new candidate make sure the election
         * is not ongoing or the person doesn't have rights.
         */
        if (!$candidateId) {
            if ($ticket_id) {
                $election_id = Ticket::getElectionId($ticket_id);
            } else {
                $election_id = Multiple::getElectionId($multiple_id);
            }
            if (!Election::allowChange($election_id)) {
                throw new \Exception('Cannot create new candidate in active election');
            }
        }


        $candidate->setFirstName(ucfirst(self::pullPostString('firstName')));
        $candidate->setLastName(ucfirst(self::pullPostString('lastName')));
        $candidate->setTitle(self::pullPostString('title'));

        if (!empty($_FILES)) {
            $picture = self::savePicture($_FILES[0], $candidate);
            if ($candidate->getId()) {
                self::deletePicture($candidate);
            }
            $candidate->setPicture($picture);
        }
        self::saveResource($candidate);
        return true;
    }

    public static function getTicketList($ticketId = 0, $active_only = true)
    {
        if (empty($ticketId)) {
            throw new \Exception('Missing ticket id');
        }

        $db = \phpws2\Database::getDB();
        $tbl = $db->addTable('elect_candidate');
        $tbl->addFieldConditional('ticketId', $ticketId);
        if ($active_only) {
            $tbl->addFieldConditional('active', 1);
        }
        $result = $db->select();
        if (empty($result)) {
            return array();
        }
        foreach ($result as &$c) {
            if (!empty($c['picture'])) {
                $c['picture'] = self::getImageHttp() . $c['picture'];
            }
        }
        return $result;
    }

    public static function getCandidateList($multipleId = 0, $active_only = true)
    {
        if (empty($multipleId)) {
            throw new \Exception('Missing multiple id');
        }

        $db = \phpws2\Database::getDB();
        $tbl = $db->addTable('elect_candidate');
        $tbl->addFieldConditional('multipleId', $multipleId);
        if ($active_only) {
            $tbl->addFieldConditional('active', 1);
        }
        $result = $db->select();
        if (empty($result)) {
            return array();
        }
        foreach ($result as &$c) {
            if (!empty($c['picture'])) {
                $c['picture'] = self::getImageHttp() . $c['picture'];
            }
        }
        return $result;
    }

    public static function deletePicture(\election\Resource\Candidate $candidate)
    {
        $image_name = $candidate->getPicture();
        if (empty($image_name)) {
            return;
        }
        $image_directory = self::getImageDirectory();
        if (is_file($image_directory . $image_name)) {
            unlink($image_directory . $image_name);
        }
    }

    private static function savePicture(array $file,
            \election\Resource\Candidate $candidate)
    {
        $filename = $file['name'];
        $tmpDir = $file['tmp_name'];
        $filetype = $file['type'];
        $size = $file['size'];

        if (!in_array($filetype,
                        array('image/png', 'image/jpg', 'image/jpeg', 'image/gif'))) {
            throw new \Exception('Bad file type. Expecting image.');
        }

        $subDirectory = self::getImageDirectory();

        if (!is_dir($subDirectory)) {
            mkdir($subDirectory, 0755);
        }

        if (!is_writable($subDirectory)) {
            throw new \Exception('Election image directory not writable.');
        }
        $extension = \PHPWS_File::getFileExtension($filename);
        if (empty($extension)) {
            throw new \Exception('Bad file type. Expecting image.');
        }
        $filename = preg_replace('/[^\w\-]/', '-', $candidate->getFirstName()) .
                '-' . preg_replace('/[^\w\-]/', '-', $candidate->getLastName()) . '-' . time();


        $destination = $subDirectory . $filename . '.' . $extension;

        $count = 0;
        while (is_file($destination)) {
            $count++;
            $destination = $subDirectory . $filename . $count . '.' . $extension;
        }

        move_uploaded_file($tmpDir, $destination);
        list($width, $height) = getimagesize($destination);

        if ($width >= $height) {
            \PHPWS_File::cropImage($destination, $destination, $height,
                    $height);
        } else {
            \PHPWS_File::cropImage($destination, $destination, $width,
                    $width);
        }
        if ($width > ELECTION_MAX_CANDIDATE_WIDTH || $height > ELECTION_MAX_CANDIDATE_HEIGHT) {
            \PHPWS_File::scaleImage($destination, $destination, $height, $height);
        }
        return $filename . '.' . $extension;
    }

    public static function getImageDirectory()
    {
        return PHPWS_HOME_DIR . 'images/election/';
    }

    public static function getImageHttp()
    {
        return "./images/election/";
    }

    public static function delete($candidateId)
    {
        if (empty($candidateId)) {
            throw new \Exception('Missing id');
        }
        $candidate = self::build($candidateId, new Resource);

        $election_id = self::getElectionId($candidate);
        if (!Election::allowChange($election_id)) {
            throw new \Exception('Cannot delete candidate in active election');
        }

        $candidate->setActive(false);
        self::saveResource($candidate);
    }

    public static function getElectionId(\election\Resource\Candidate $candidate)
    {
        $candidateId = $candidate->getId();
        if (empty($candidate) || empty($candidateId)) {
            throw new \Exception('Missing candidate');
        }
        $db = \phpws2\Database::getDB();
        $t1 = $db->addTable('elect_candidate', null, false);
        $t1->addFieldConditional('id', $candidateId);
        $ticketId = $candidate->getTicketId();
        $multipleId = $candidate->getMultipleId();
        if ($ticketId) {
            $t2 = $db->addTable('elect_ticket', null, false);
            $cond = new \phpws2\Database\Conditional($db,
                    $t1->getField('ticketId'), $t2->getField('id'), '=');
            $join = $db->joinResources($t1, $t2, $cond, 'left');
            $t3 = $db->addTable('elect_single', null, false);
            $cond2 = new \phpws2\Database\Conditional($db,
                    $t2->getField('singleId'), $t3->getField('id'), '=');
            $db->joinResources($t2, $t3, $cond2, 'left');
            $t3->addField('electionId');
        } elseif ($multipleId) {
            $t2 = $db->addTable('elect_multiple', null, false);
            $cond = new \phpws2\Database\Conditional($db,
                    $t1->getField('multipleId'), $t2->getField('id'), '=');
            $db->joinResources($t1, $t2, $cond, 'left');
            $t2->addField('electionId');
        } else {
            throw new \Exception('Missing foreign key id');
        }
        $db->loadSelectStatement();
        $result = $db->fetchColumn();
        return $result;
    }

}
