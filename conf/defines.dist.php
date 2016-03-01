<?php

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */

define('ELECTION_REACT_DEV', false);

// This format works correctly with the Javascript Date class. Alter at your own risk.
define('ELECTION_DATETIME_FORMAT', 'M d, Y, G:i');

// Candidate photos will be resized to match these dimensions.
// IF CHANGED - make sure to update your the Candidate form style sheet
// as they will expect the defaults set in defines.dist.php
define('ELECTION_MAX_CANDIDATE_WIDTH', 150);
define('ELECTION_MAX_CANDIDATE_HEIGHT', 200);

// If true, tickets displayed randomly. False, alphabetically.
define('ELECTION_RANDOMIZE_TICKETS', true);

define('ELECTION_LOGIN_DIRECTORY', 'secure/');

// if true, any student who signs in will get the fake account
define('STUDENT_DATA_TEST', false);

// set banner id or user name
define('TEST_STUDENT_ID', '000000000');

// Address to test voter completion. Prevents sending email to test user
define('TEST_STUDENT_EMAIL', 'name@address.com');