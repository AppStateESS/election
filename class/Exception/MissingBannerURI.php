<?php

namespace election\Exception;
/**
 * Description of MissingBannerURI
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 */
class MissingBannerURI extends \Exception
{
    public function __construct() {
        parent::__construct();
        $this->message = 'Student data API url is not configured.';
    }
}
