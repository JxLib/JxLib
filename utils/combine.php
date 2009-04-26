#!/usr/bin/php
<?php

class combine {
	
	private $_deps = array();
	private $_target;
	private $_queue = array();
	private $_basedir;
	private $_type = 'php';
	private $_fileList;
	private $_keys;
	
	public function __construct($args) {
		//remove the script name
		array_shift($args);
		while (!empty($args)):
			$key = array_shift($args);
			$value = array_shift($args);
			switch ($key) {
				case '-filelist':
					$this->_fileList = $value;
					break;
				case '-target':
					$this->_target = $value;
					break;
				case '-basedir':
					$this->_basedir = $value;
					break;
				case '-jsonFile':
					$this->_jsonFile = $value;
					break;
			}
		endwhile;
	}
	
	public function combine(){
		//open JSON file
		$f = file_get_contents($this->_fileList);
		$obj = json_decode($f,true);
		
		//flatten and add file path
		foreach ($obj as $dir => $arr){
			foreach ($arr as $file => $arr2){
				if ($file != 'desc') {
					$this->_flat[$file] = $arr2;
					$this->_flat[$file]['fname'] = $dir.DIRECTORY_SEPARATOR.$file.'.js';
				}
			}
		}
		
		$this->detectCycle();
		
		//sort the dependencies
		foreach($this->_flat as $key => $arr3) {
			$this->includeDependency($key, $depsOut, $depsFinal);
		}
		
		//save the json file
		$json = json_encode($this->_queue);
		file_put_contents($this->_jsonFile,$json);
		
		//check license file for BOM
		$lic = file_get_contents($this->_basedir.DIRECTORY_SEPARATOR.'license.txt');
		$lic = $this->removeBOM($lic);
		file_put_contents($this->_basedir.DIRECTORY_SEPARATOR.'license.txt',$lic);
		
		//write the concatenated file
		$this->_combine();
		
	}
	
	private function includeDependency($key, $flag = false) {
	  $dep = $this->_flat[$key];
	  if (!$flag) {  
		  //check to see if the filename is the same as the directory. If it is, this is
		  //a toplevel namespace generating file so let's include it the first time we see it.
		  $parts = explode('/',$dep['fname']);
		  if (is_array($dep['deps'])) {
		    foreach($dep['deps'] as $anotherDep) {
		      if (!isset($this->_queue[$anotherDep]) && $anotherDep != $key && array_key_exists($anotherDep,$this->_flat) && (is_array($this->_cycle) && !array_key_exists($anotherDep,$this->_cycle))) {
		        $this->includeDependency($anotherDep);
		      } else if (is_array($this->_cycle) && array_key_exists($anotherDep, $this->_cycle)){
		      	$parts = explode('/',$this->_flat[$anotherDep]['fname']);
		      	if (strtolower($parts[0]) == strtolower($anotherDep)){
		      		//just include it now
		      		$this->includeDependency($anotherDep, true);
		      	}//else skip it
		      }
		    }
		  }
	  }
	  $this->_queue[$key] = $dep;
	}

	private function detectCycle() {
		foreach ($this->_flat as $key => $arr){
			$deps = $arr['deps'];
			foreach ($deps as $a){
				if (is_array($this->_flat[$a]['deps'])) {
					if (in_array($key,$this->_flat[$a]['deps'])){
						$this->_cycle[$key][] = $a;
					}
				}
			}
		}
	}
	
	private function _combine(){
		$target = '';
		foreach ($this->_queue as $key => $arr){
			$file = $arr['fname'];
			$f = file_get_contents($this->_basedir.DIRECTORY_SEPARATOR.$file);
			echo $file."\n";
			$l = $this->removeBOM($f);
			$target .= $l;
		}
		file_put_contents($this->_target,$target);
	}
	
	private function removeBOM($str=""){
        if(substr($str, 0,3) == pack("CCC",0xef,0xbb,0xbf)) {
                $str=substr($str, 3);
                echo "bom removed...";
        }
        return $str;
	}	 
}

$c = new combine($argv);
$c->combine();