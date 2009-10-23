<?php 
/**
 * Copyright 2009 by Jonathan Bomgardner
 * License: MIT-style
 */
set_time_limit(60*3);

define('DS',DIRECTORY_SEPARATOR);

$basedir = 'src';
$libs = array();
$src = 'Source';
$profile = array();

if ($_REQUEST['mootools-core'] == 'on'){
	$libs[] = 'core';
	$profile['mootools-core'] = true;
	$profile['core'] = $_REQUEST['core'];
}
if ($_REQUEST['mootools-more'] == 'on'){
	$libs[] = 'more';
	$profile['mootools-more'] = true;
	$profile['more'] = $_REQUEST['more'];
}
$libs[] = 'jxlib';

//create the original deps array but it'll be sorted...
foreach ($libs as $lib){
	$deps[$lib] = json_decode(file_get_contents($lib.'.json'),true);	
}


function removeBOM($str=""){
	if(substr($str, 0,3) == pack("CCC",0xef,0xbb,0xbf)) {
		$str=substr($str, 3);
	}
	return $str;
}	

//get files, concatenate them into a long string for each one
//first core
$srcString = array();
foreach ($libs as $lib){
	$srcString[$lib] = '';
	
	foreach ($deps[$lib] as $file => $arr) {
		if ((in_array($file,$_REQUEST['files']) || 
	    	 (isset($_REQUEST[$lib]) && $_REQUEST[$lib] == 'full')) &&
	     	$file !== 'desc' ) {
			$path = 'src'.DS.$lib.DS.'Source'.DS.$arr['fname'];
			$srcString[$lib] .= removeBOM(file_get_contents($path));
		}
	}
}

//put the files together as required
$strFiles = array();
$more = in_array('more',$libs);
$core = in_array('core',$libs);

$profile['build'] = $_REQUEST['build'];

foreach ($_REQUEST['build'] as $name){
	switch ($name) {
		case "jxlib":
		case "jxlib.uncompressed":
			$strFiles[$name] = implode("\n",$srcString);
			break;
		case "jxlib.standalone":
		case "jxlib.standalone.uncompressed":
			$strFiles[$name] = $srcString['jxlib'];
			break;
		case "mootools":
		case "mootools.uncompressed":
			if ($core && $more) {
				$strFiles[$name] = $srcString['core'] . "\n" . $srcString['more'];
			} else if ($core) {
				$strFiles[$name] = $srcString['core'];
			} else if ($more) {
				$strFiles[$name] = $srcString['more'];
			}
			break;
		case "mootools.core":
		case "mootools.core.uncompressed":
			if ($core) {
				$strFiles[$name] = $srcString['core'];
			}
			break;
		case "mootools.more":
		case "mootools.more.uncompressed":
			if ($more) {
				$strFiles[$name] = $srcString['more'];
			}
			break;
	}
}

$profile['j-compress'] = $_REQUEST['j-compress'];

//compress the javascript libs as required
switch ($_REQUEST['j-compress']){
	case 'jsmin':
		require_once 'includes/jsmin-1.1.1.php';
		foreach ($strFiles as $key => $script){
			if (!strpos($key,'uncompressed')) {
				$strFiles[$key] = JSMin::minify($script);
			}
		}
		break;
	case 'packer':
		require_once 'includes/class.JavaScriptPacker.php';
		foreach ($strFiles as $key => $script){
			if (!strpos($key,'uncompressed')) {
				$packer = new JavaScriptPacker($script, $encoding, $fast_decode, $special_char);
  				$strFiles[$key] = $packer->pack();
			}
		}
		break;
}
$licenseFile['jxlib'] = removeBOM(file_get_contents('src'.DS.'jxlib'.DS.'Source'.DS.'license.js'));
$licenseFile['core'] = '/*'.removeBOM(file_get_contents('src'.DS.'core'.DS.'Source'.DS.'license.txt')).'*/';

//add license file(s)
foreach ($strFiles as $key => $value) {
	if (strpos($key,'jxlib')){
		$strFiles[$key] = $licenseFile['jxlib']."\n".$value;
	} else {
		$strFiles[$key] = $licenseFile['core']."\n".$value;
	} 
}

function guid(){
	$g = '';
    if (function_exists('com_create_guid')){
        $g = com_create_guid();
    }else{
        mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
        $charid = strtoupper(md5(uniqid(rand(), true)));
        $hyphen = chr(45);// "-"
        $uuid = chr(123)// "{"
                .substr($charid, 0, 8).$hyphen
                .substr($charid, 8, 4).$hyphen
                .substr($charid,12, 4).$hyphen
                .substr($charid,16, 4).$hyphen
                .substr($charid,20,12)
                .chr(125);// "}"
        $g = $uuid;
    }
    
    $g = str_replace('{','',$g);
    $g = str_replace('}','',$g);
    $g = str_replace('-','',$g);
    return $g;
}

//create the zip/tar archive
$work_dir = 'work'.DS;
$archiveDir = guid();
$filesToArchive = array();

if (!is_dir($work_dir.$archiveDir)){
	mkdir($work_dir.$archiveDir);
}

foreach ($strFiles as $key => $f){
	$name = $work_dir.$archiveDir.DS.$key.".js";
	file_put_contents($name,$f);
	$filesToArchive[] = $name;
}

//create JSON profile file
$profile['files'] = $_REQUEST['files'];
$profile['opt-deps'] = isset($_REQUEST['opt_deps'])?true:false;
$profile['f-compress'] = $_REQUEST['f-compress'];

$file = $work_dir.$archiveDir.DS.'profile.json';
file_put_contents($file,json_encode($profile));
$filesToArchive[] = $file;


//add theme and image assets to the file list
$iterator = new RecursiveDirectoryIterator('assets');
$it = new RecursiveIteratorIterator($iterator);
while($it->valid()){
	if (!$it->isDot() && !$it->isDir()){
		$filesToArchive[] = 'assets'.DS.$it->getSubPathName();
	}
	$it->next();
}

$archiveName = '';
$fileName = '';
$archiveSubPath = $archiveDir;
//need zlib and bzip2 compression libraries for this part to work.
switch ($_REQUEST['f-compress']){
	case 'zip':
		$fileName = "jxlib.zip";
		$archiveSubPath .= DS.$fileName;
		$archiveName = $work_dir.$archiveSubPath;
		$archive = new ZipArchive();
		$archive->open($archiveName, ZIPARCHIVE::CREATE);
		$includedPic = false;
		foreach ($filesToArchive as $file){
			$sections = explode(DS,$file);
			$isPic = (strpos($file,'a_pixel.png') > 0)?true:false;
			if ($sections[0] == 'work' || ($isPic && !$includedPic)) {
			    if ($isPic) {
                    $includedPic = true;
                }
				$archive->addFile($file,'jxlib'.DS.$sections[count($sections)-1]);		
			} else if (!$isPic) {
				$archive->addFile($file, 'jxlib'.DS.$file);
			}
		}
		$archive->close();
		break;
	case 'gzip':
		require_once 'includes/Tar.php';
		$fileName = "jxlib.tar.gz";
		$archiveSubPath .= DS.$fileName;
		$archiveName = $work_dir.$archiveSubPath;
		$tar = new Archive_Tar($archiveName,'gz');
		$includedPic = false;
		foreach ($filesToArchive as $file){
			$sections = explode(DS,$file);
			$isPic = (strpos($file,'a_pixel.png') > 0)?true:false;
			if ($sections[0] == 'work' || ($isPic && !$includedPic)) {
			    if ($isPic) {
			        $includedPic = true;
			    }
				$tar->addString('jxlib'.DS.$sections[count($sections)-1],file_get_contents($file));
			} else if (!$isPic){
				$tar->addString('jxlib'.DS.$file, file_get_contents($file));
			}
		}
		break;
	case 'bz2':
		require_once 'includes/Tar.php';
		$fileName = "jxlib.tar.bz2";
		$archiveSubPath .= DS.$fileName;
		$archiveName = $work_dir.$archiveSubPath;
		$tar = new Archive_Tar($archiveName,'bz2');
		$includedPic = false;
		foreach ($filesToArchive as $file){
			$sections = explode(DS,$file);
			$isPic = (strpos($file,'a_pixel.png') > 0)?true:false;
			if ($sections[0] == 'work' || ($isPic && !$includedPic)) {
			    if ($isPic) {
                    $includedPic = true;
                }
				$tar->addString('jxlib'.DS.$sections[count($sections)-1],file_get_contents($file));
			} else if (!$isPic){
				$tar->addString('jxlib'.DS.$file, file_get_contents($file));
			}
		}
		break;
}

//remove the files from the server
foreach ($filesToArchive as $file){
	$sections = explode(DS,$file);
	if ($sections[0] == 'work'){
		unlink($file);
	}
}

//setup the return object to send via JSON
$obj = new stdClass();
$obj->success = true;
$obj->filename = $fileName;
$obj->folder = $archiveDir;

echo(json_encode($obj));

?>