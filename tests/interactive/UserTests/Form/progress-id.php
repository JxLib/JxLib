<?php

header('Content-type:application/json');

$obj = new stdClass();
$obj->id = uniqid();
$obj->success = true;

echo json_encode($obj);