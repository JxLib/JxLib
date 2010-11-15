<?php

$obj = new stdClass();
$obj->success= false;

$key = $_REQUEST['APC_UPLOAD_PROGRESS'];

//for the test we simply check to see if we have an uploaded file
$tempFile = $_FILES["file-upload-test"]["tmp_name"];
$obj->file = $tempFile;
if (is_uploaded_file($tempFile)) {
    $obj->success = true;
    //grab all $_POST variables
    foreach ($_POST as $key => $value) {
        $obj->$key = $value;
    }
}

echo json_encode($obj);