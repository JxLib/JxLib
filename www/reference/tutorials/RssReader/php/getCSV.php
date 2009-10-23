<?php
include 'var2json.php';

$csvurl = $_REQUEST['url'];
$headers = $_REQUEST['headers'];

$result = null;
$result->cached = false;
$result->success = true;
$result->message = '';
$result->headers = null;
$result->data = array();

$csvFile = $csvurl;

$cache = @file('../cache/cache.txt');
$cacheName = '../cache/'.preg_replace('/\W/', '_', $csvurl);
$now = time();

if ($cache !== false) {
    foreach($cache as $key => $entry) {
        list($url, $time, $file) = explode('|', trim($entry));
        if ($url == $csvurl && $now - $time < 3600) {
            $result->cached = true;
            $cache[$key] = $url."|".$now."|".$file;
            break;
        }
    }
} else {
    $cache = array();
}

if (!$result->cached) {
    copy($csvurl, $cacheName);
    array_push($cache, $csvurl."|".$now."|".$cacheName);
}

$rs = array();
$h = fopen($cacheName, 'r');
if ($h === false) {
    $result->success = false;
    $result->message = 'failed to open CSV file $csvurl';
} else {
    while ($row = fgetcsv($h)) {
        if ($headers == 'true' && $result->headers == null) {
            $result->headers = $row;
        } else {
            array_push($result->data, $row);        
        }
    }
    fclose($h);
}

echo var2json($result);

$h = fopen('../cache/cache.txt', 'w');
foreach($cache as $entry) {
    if (trim($entry) != '')
    fwrite($h, $entry."\n");
}
fclose($h);    
?>