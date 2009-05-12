#!/usr/bin/php
<?php

class createDeps {
	
	public function __construct($args){
		$fileLoc = "";
		array_shift($args);
		while (!empty($args)):
			$key = array_shift($args);
			$value = array_shift($args);
			switch ($key) {
				case '-fileLoc':
					$fileLoc = $value;
					break;
			}
		endwhile;
		
		$jxlib = file_get_contents($fileLoc.DIRECTORY_SEPARATOR.'jxlib.json');
		$more = file_get_contents($fileLoc.DIRECTORY_SEPARATOR.'more.json');
		$core = file_get_contents($fileLoc.DIRECTORY_SEPARATOR.'core.json');
		
		$jxlib = json_decode($jxlib,true);
		$more = json_decode($more,true);
		$core = json_decode($core,true);
		
		$deps = array_merge($core,$more,$jxlib);
		
		file_put_contents($fileLoc.DIRECTORY_SEPARATOR.'deps.json',json_encode($deps));
	}
}

$c = new createDeps($argv);
