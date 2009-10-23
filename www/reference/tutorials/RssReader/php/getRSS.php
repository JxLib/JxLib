<?php
include "./lastRSS.php";
include 'var2json.php';

$rss = new lastRSS;
$rss->cache_dir = '';
$rss->cache_time = 0;
// $rss->cp = 'US-ASCII';
$rss->date_format = 'l';

$rssurl = $_REQUEST['url'];

if ($rs = $rss->get($rssurl)) {
    echo var2json($rs);
} else {
    echo '{error: "It is not possible to get $rssurl..."}';
}

?>