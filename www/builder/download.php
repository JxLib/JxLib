<?php
/**
 * Copyright 2009 by Jonathan Bomgardner
 * License: MIT-style
 */
//session_start();

define('DS',DIRECTORY_SEPARATOR);

$file = $_REQUEST['file'];

//echo "File = $file";

$sections = explode('/',$file);

$archiveName = 'work'.DS.$file;

//make sure the file we're getting is in the work directory
if (count($sections) != 2 && !file_exists('work'.DS.$sections[0])){
	die('No valid file to download...');
}

$archiveName = 'work'.DS.$file;

//send the file to the browser

header("Content-type: application/octet-stream");
header("Content-Disposition: attachment; filename=".$sections[1]);
header("Content-length: ".@filesize($archiveName));
readfile($archiveName);


//remove all working files from the server
$iterator = new RecursiveDirectoryIterator(dirname(__FILE__).DS.'work'.DS.$sections[0]);
foreach (new RecursiveIteratorIterator($iterator, RecursiveIteratorIterator::CHILD_FIRST) as $filename => $file) {
    if ($file->isFile()) {
         //echo "<br>checking $filename";
       unlink($file->getRealPath());
    } else {
       rmdir($file->getRealPath());
    }
}

rmdir(dirname(__FILE__).DS.'work'.DS.$sections[0]);