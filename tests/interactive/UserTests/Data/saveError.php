<?php 

header('Content-type:application/json');
$obj = new stdClass();
$obj->meta = new StdClass();
$obj->meta->requestId = $_REQUEST['requestId'];
$obj->meta->success = false;
$obj->meta->error = new stdClass();
$obj->meta->error->code = 1087;
$obj->meta->error->message = 'Unable to save object';

echo json_encode($obj);

?>