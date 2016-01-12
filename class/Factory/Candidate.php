<?php

namespace election\Factory;

use election\Resource\Candidate as Resource;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Candidate extends Base
{
    public static function getListByTicketId($ticketId) {
        $db = \Database::getDB();
        $tbl = $db->addTable('elect_candidate');
        $tbl->addFieldConditional('ticketId', $ticketId);
    }
    
    public static function post()
    {
        $candidate = self::build(self::pullPostInteger('candidateId'), new Resource);
        
        $candidate->setBallotId(self::pullPostInteger('ballotId'));
        $candidate->setTicketId(self::pullPostInteger('ticketId'));
        $candidate->setFirstName(self::pullPostString('firstName'));
        $candidate->setLastName(self::pullPostString('lastName'));

        if (!empty($_FILES)) {
            $picture = self::savePicture($_FILES[0], $candidate->getBallotId());
        }
        
        var_dump($_POST);
        var_dump($_FILES);
        exit();
    }
    
    
    private static function savePicture(array $file, $ballotId)
    {
        $filename = $file['name'];
        $tmpDir = $file['tmp_name'];
        $filetype = $file['type'];
        $size = $file['size'];
        
        $imageDirectory = PHPWS_HOME_DIR . 'images/election/';
        $subDirectory = $imageDirectory . $ballotId;
        
        if (!is_dir($subDirectory)) {
            mkdir($subDirectory, 0644);
        }
        
        if (!is_writable($subDirectory)) {
            throw new \Exception('Election image directory not writable.');
        }
        
        move_uploaded_file($tmp_dir, $destination);
    }
    
  
}
