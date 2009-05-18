<?php 

header('Content-type:application/json');
$obj = new stdClass();
$obj->success = true;
$obj->requestId = $_REQUEST['requestId'];

echo json_encode($obj);

?>