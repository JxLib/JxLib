<?php

$obj = new stdClass();
$obj->success= false;

//$key = $_REQUEST['APC_UPLOAD_PROGRESS'];

//for the test we simply check to see if we have an uploaded file
$tempFile = $_FILES["file-upload-test"]["tmp_name"];

if (is_uploaded_file($tempFile)) {
    $obj->success = true;
    //grab all $_POST variables
    foreach ($_POST as $key => $value) {
        $obj->$key = $value;
    }
    
}

//check file-upload-test2

$tempFiles = $_FILES["file-upload-test2"]["tmp_name"];
if (is_array($tempFiles)) {
    foreach($tempFiles as $f) {
        if (is_uploaded_file($f)) {
            $obj->success = true;
        }
    }
}
foreach ($_POST as $key => $value) {
    $obj->$key = $value;
}
$obj->file = $_FILES;

echo "<pre>";
var_dump($obj);
echo "</pre>";