<?php

$obj = new stdClass();
$obj->success= false;

$key = $_REQUEST['APC_UPLOAD_PROGRESS'];

//for the test we simply check to see if we have an uploaded file
$tempFile = $_FILES["file-upload-test"]["tmp_name"];
$obj->file = $tempFile;
if (is_uploaded_file($tempFile)) {
    $obj->success = true; 
}

echo json_encode($obj);