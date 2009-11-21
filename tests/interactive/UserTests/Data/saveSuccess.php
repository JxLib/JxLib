<?php 

header('Content-type:application/json');
$obj = new stdClass();
$obj->meta = new stdClass();
$obj->meta->success = true;
$obj->meta->requestId = $_REQUEST['requestId'];

echo json_encode($obj);

?>