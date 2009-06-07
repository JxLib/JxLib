<?php 

header('Content-type:application/json');
$obj = new stdClass();
$obj->success = true;
//$obj->requestId = $_REQUEST['requestId'];
$obj->data = new stdClass();
$obj->data->columns = array();

for ($x = 1; $x <= 10; $x++){
    $col = new stdClass();
    $col->name = 'col'.$x;
    $col->type = 'alphanumeric';
    $obj->data->columns[] = $col;
}

$obj->data->data = array();

for ($x = 1; $x <= 10; $x++){
	$obj2 = new stdClass();
	for ($i = 1; $i <= 10; $i++) {
		$col = 'col'.$i;
		$obj2->$col = "$x.value.$i";
	}
	$obj->data->data[] = $obj2;
}

echo json_encode($obj);

?>