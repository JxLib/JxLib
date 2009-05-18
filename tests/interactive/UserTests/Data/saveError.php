<?php 

header('Content-type:application/json');
$obj = new stdClass();
$obj->success = false;
$obj->requestId = $_REQUEST['requestId'];
$obj->error = new stdClass();
$obj->error->code = 1087;
$obj->error->message = 'Unable to save object';

echo json_encode($obj);

?>