#!/usr/bin/php
<?php

class combineFiles {
	
	public function __construct($args){
		//remove the script name
		array_shift($args);
		while (!empty($args)):
			$key = array_shift($args);
			$value = array_shift($args);
			switch ($key) {
				case '-filelist':
					$this->_fileList = explode(',',$value);
					break;
				case '-target':
					$this->_target = $value;
					break;
				case '-basedir':
					$this->_basedir = $value;
					break;
			}
		endwhile;
		
		$target = '';
		
		//var_dump($this->fileList);
		
		foreach ($this->_fileList as $file) {
			$target .= $this->removeBOM(file_get_contents($this->_basedir.DIRECTORY_SEPARATOR.$file.'.js'));
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


$c = new combineFiles($argv);