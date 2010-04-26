<?php

header('Content-type:application/json');

$key = isset($_REQUEST['id'])?$_REQUEST['id']:null;

$obj = new stdClass();
if (isset($key)){
    $status = apc_fetch("upload_$key");
    if (!empty($status)){
        $obj->success = true;
        foreach ($status as $key => $value) {
            $obj->$key = $value;
        }
    } else {
        $obj->success = false;
        $obj->status = $status;
    }
}


echo json_encode($obj);