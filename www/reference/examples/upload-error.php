<?php

$obj = new stdClass();
$obj->success= false;
$obj->error = new stdClass();
$obj->error->message = "This is a test error of an uploaded file. If this had been a real error this message would hopefully say something useful.";
$obj->error->code = 9999;

echo json_encode($obj);