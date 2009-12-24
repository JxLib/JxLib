<?php

/**
 * This file is for use with the paging-grid.html example
 */

//first, get the requested info (page number, itemsPerPage)
$pageNum = $_REQUEST['page'];
$itemsPerPage = $_REQUEST['itemsPerPage'];

//now read in the data
$records = file('./popplace.csv', FILE_IGNORE_NEW_LINES);

//the first line is the headers
$headers = explode(',',rtrim($records[0]));
$headers[] = 'id';


//send results
$obj = new stdClass();
$obj->success = true;


$obj->meta = new stdClass();
$obj->meta->columns = array();
$obj->meta->totalItems = count($records) - 1;
$obj->meta->totalPages = ceil($obj->meta->totalItems/$itemsPerPage);
$obj->meta->primaryKey = 'id';

//now figure out the required records
$start = ($pageNum - 1) * $itemsPerPage + 1;

if ($pageNum == $obj->meta->totalPages) {
    //we may not have that many records left, figure it out
    $itemsPerPage = $obj->meta->totalItems - $start + 1;
}

$results = array();
for ($i = $start; $i < $start + $itemsPerPage; $i++) {
    $values = explode(',',rtrim($records[$i]));
    $values['id'] = $i;
    $results[] = array_combine($headers,$values);
}
$obj->data = $results;



foreach ($headers as $name){
    $col = new stdClass();
    $col->name = $name;
    if ($name == 'UNIQUE_KEY' || 
        $name == 'NAME' || 
        $name == 'NTS50' || 
        $name == 'NAME_E' || 
        $name == 'NAME_F') {
        $col->type = 'alphanumeric';
    } else {
        $col->type = 'numeric';
    }
    $obj->meta->columns[] = $col;
}

header('Content-type:application/json');
echo json_encode($obj);