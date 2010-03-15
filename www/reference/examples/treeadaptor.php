<?php
session_start();
define(DS, DIRECTORY_SEPARATOR);

/**
 * check to see if we have a directory within the www path. If not, start it at
 * the main www directory.
 */

$node_id = isset($_GET['node'])?$_GET['node']:-1;
//echo "node id:".$node_id;
$paths = array();
$startDir = '';
if ($node_id == -1) {
    //starting from the top.
    $startDir = '..'.DS.'..';
    unset($_SESSION['paths']);
} else {
    //get the saved paths
    $paths = $_SESSION['paths'];
    //var_dump($paths);
    $startDir = $paths[$node_id]->realPath;
}

$results = new stdClass();
$results->success = true;
$data = array();
$files = array();
$dirs = array();
$dir = new DirectoryIterator($startDir);
foreach ($dir as $fileinfo) {
    if (!$fileinfo->isDot() && substr($fileinfo->getFilename(), 0, 1) != '.') {
        //var_dump($fileinfo);
        $file = new stdClass();
        $file->folder = !$fileinfo->isFile();
        $file->name = $fileinfo->getFilename();
        $file->parent = $node_id;
        $file->id = count($paths);
        $file->realPath = $fileinfo->getRealPath();
        $paths[] = $file;
        if ($file->folder) {
            $dirs[] = $file;
        } else {
            $files[] = $file;
        }
    }
}

$data = array_merge($dirs, $files);
$_SESSION['paths'] = $paths;

$results->data = $data;


header('Content-type:application/json');
echo json_encode($results);