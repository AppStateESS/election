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
        $candidate = self::build(self::pullPostInteger('candidateId'), new Resource);
        
        $candidate->setTicketId((int)self::pullPostInteger('ticketId'));
        $candidate->setMultipleId((int)self::pullPostInteger('multipleId'));
        if (empty($candidate->getTicketId()) && empty($candidate->getMultipleId())) {
            throw \Exception('Candidate missing foreign key');
        }
        $candidate->setFirstName(self::pullPostString('firstName'));
        $candidate->setLastName(self::pullPostString('lastName'));

        if (!empty($_FILES)) {
            $picture = self::savePicture($_FILES[0], $candidate);
            $candidate->setPicture($picture);
        }
        self::saveResource($candidate);
        return true;
    }

    public static function getTicketList($ticketId=0, $active_only=true)
    {
        if (empty($ticketId)) {
            throw new \Exception('Missing ticket id');
        }
        
        $db = \Database::getDB();
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
    
    private static function savePicture(array $file, \election\Resource\Candidate $candidate)
    {
        $filename = $file['name'];
        $tmpDir = $file['tmp_name'];
        $filetype = $file['type'];
        $size = $file['size'];
        
        if (!in_array($filetype, array('image/png', 'image/jpg', 'image/jpeg'))) {
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
        while(is_file($destination)) {
            $count++;
            $destination = $subDirectory . $filename . $count . '.' . $extension;
        }
        
        move_uploaded_file($tmpDir, $destination);
        list($width, $height) = getimagesize($destination);
        if ($width > ELECTION_MAX_CANDIDATE_WIDTH) {
            \PHPWS_File::scaleImage($destination, $destination, ELECTION_MAX_CANDIDATE_WIDTH, ELECTION_MAX_CANDIDATE_HEIGHT);
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
        $candidate = self::build($candidateId, new Resource);
        $candidate->setActive(false);
        self::saveResource($candidate);
    }
  
}
