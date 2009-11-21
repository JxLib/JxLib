<?php 

$method = $_SERVER['REQUEST_METHOD'];
header('Content-type:application/json');

$obj = new stdClass();
$obj->meta = new stdClass();
$obj->meta->success = true;

if ($method === 'GET') {
   
    $obj->meta->columns = array();
    
    for ($x = 1; $x <= 10; $x++){
        $col = new stdClass();
        $col->name = 'col'.$x;
        $col->type = 'alphanumeric';
        $obj->meta->columns[] = $col;
    }
    
    $obj->data = array();
    
    for ($x = 1; $x <= 10; $x++){
        $obj2 = new stdClass();
        for ($i = 1; $i <= 10; $i++) {
            $col = 'col'.$i;
            $obj2->$col = "$x.value.$i";
        }
        $obj->data[] = $obj2;
    }

} else {

    $obj->meta->method = $method;
}

 echo json_encode($obj);