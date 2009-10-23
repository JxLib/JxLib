<?php
/**
 * Copyright 2009 by Jonathan Bomgardner
 * License: MIT-style
 */
//session_start();

define('DS',DIRECTORY_SEPARATOR);

$file = $_REQUEST['file'];

$sections = explode(DS,$file);


//make sure the file we're getting is in the work directory
if (count($sections) != 2 && !is_dir('work'.DS.$sections[0])){
	die('No valid file todownload...');
}

$archiveName = 'work'.DS.$file;

//send the file to the browser
header("Content-type: application/octet-stream");
header("Content-Disposition: attachment; filename=".$sections[1]);
header("Content-length: ".@filesize($archiveName));
readfile($archiveName);

unlink($archiveName);
rmdir($work_dir.$sections[0]);

?>