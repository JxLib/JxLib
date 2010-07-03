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
$themes = array('crispin','delicious');

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
$cssSrc = array();
$imageList = array();
foreach ($themes as $theme) {
    $cssSrc[$theme] = '';
}

foreach ($libs as $lib){
	$srcString[$lib] = '';
	
	foreach ($deps[$lib] as $file => $arr) {
		if ((in_array($file,$_REQUEST['files']) || 
	    	 (isset($_REQUEST[$lib]) && $_REQUEST[$lib] == 'full')) &&
	     	$file !== 'desc' ) {
			$path = 'src'.DS.$lib.DS.'Source'.DS.$arr['fname'];
			$srcString[$lib] .= removeBOM(file_get_contents($path));

            //get css file if there is one... one for each theme
            if ($lib == 'jxlib') {
                //echo "<br>checking for css and images...";
                foreach ($themes as $theme) {
                    //echo "<br>theme: $theme";
                    $path = dirname(__FILE__). DS .'src'.DS.'jxlib'.DS.'themes' . DS .$theme. DS .'css'.DS;
                    $pathAlt = dirname(__FILE__). DS .'src'.DS.'jxlib'.DS. 'themes' . DS . $theme.DS;
                    if (array_key_exists('css',$arr) && !empty($arr['css'])) {
                        foreach ($arr['css'] as $file) {
                            $p = $path . $file . '.css';
                            //echo "<br>checking main path $p";
                            if (!file_exists($p)) {
                                $p = $pathAlt . $file . '.css';
                                //echo "<br>checking alternate path $p";
                                if (!file_exists($p)) {
                                    continue;
                                }
                            }
                            //echo "<br>including css file $p";
                            $cssSrc[$theme] .= removeBOM(file_get_contents($p));
                        }
                    }

                    if (array_key_exists('images',$arr) && !empty($arr['images'])) {
                        //we'll need to move files to where they belong per theme... but for now,
                        //just get the names of all the images we need
                        $imageList = array_merge($imageList,$arr['images']);
                    }

                }
            }
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

//compress CSS files...
require_once 'includes/minify_css.php';
$cssFiles = array();
foreach ($cssSrc as $key => $src) {
    $cssFiles[$key] = array();
    $cssFiles[$key]['uncompressed'] = $src;
    $cssFiles[$key]['compressed'] = Minify_CSS_Compressor::process($src);
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

$includedPic = false;
//place the theme css files...
$theme_dir = $work_dir.$archiveDir.DS.'themes';
mkdir($theme_dir);
foreach ($themes as $theme) {
    mkdir($theme_dir . DS . $theme);
    mkdir($theme_dir . DS . $theme . DS . 'images');
    //save the two css files...
    $name = $theme_dir . DS . $theme . DS . 'jxtheme.css';
    file_put_contents($name,$cssFiles[$theme]['compressed']);
    $filesToArchive[] = $name;
    $name = $theme_dir . DS . $theme . DS . 'jxtheme.uncompressed.css';
    file_put_contents($name,$cssFiles[$theme]['uncompressed']);
    $filesToArchive[] = $name;

    //copy the two ie files
    $name = $theme_dir.DS.$theme . DS . 'ie6.css';
    copy('src'.DS.'jxlib'.DS.'themes'.DS.$theme.DS.'ie6.css',$name);
    $filesToArchive[] = $name;

    $name = $theme_dir.DS.$theme . DS . 'ie7.css';
    copy('src'.DS.'jxlib'.DS.'themes'.DS.$theme.DS.'ie7.css',$name);
    $filesToArchive[] = $name;

    //now the images for the theme
    foreach ($imageList as $file) {
        $isPic = (strpos($file,'a_pixel.png') !== false)?true:false;
        //echo "<br>file $file is a_pixel.png = ";var_dump($isPic);

        if ($isPic && !$includedPic) {
            $includedPic = true;
            $name = $work_dir.$archiveDir.DS.$file;
            copy('src'.DS.'jxlib'.DS.'themes'.DS.$theme.DS.'images'.DS.$file, $name);
            $filesToArchive[] = $name;
        }
        $name = $theme_dir.DS.$theme . DS . 'images' .DS . $file;
        copy('src'.DS.'jxlib'.DS.'themes'.DS.$theme.DS.'images'.DS.$file, $name);
        $filesToArchive[] = $name;
    }
}

//create JSON profile file
$profile['files'] = $_REQUEST['files'];
$profile['opt-deps'] = isset($_REQUEST['opt_deps'])?true:false;
$profile['f-compress'] = $_REQUEST['f-compress'];

$file = $work_dir.$archiveDir.DS.'profile.json';
file_put_contents($file,json_encode($profile));
$filesToArchive[] = $file;




/*
//add theme and image assets to the file list
$iterator = new RecursiveDirectoryIterator('assets');
$it = new RecursiveIteratorIterator($iterator);
while($it->valid()){
	if (!$it->isDot() && !$it->isDir()){
		$filesToArchive[] = 'assets'.DS.$it->getSubPathName();
	}
	$it->next();
}
*/

$archiveName = '';
$fileName = '';
$archiveSubPath = $archiveDir;
//need zlib and bzip2 compression libraries for this part to work.
switch ($_REQUEST['f-compress']){
	case 'zip':
        //echo "<br><br>creating zip file...";
		$fileName = "jxlib.zip";
		$archiveSubPath .= DS.$fileName;
		$archiveName = $work_dir.$archiveSubPath;
		$archive = new ZipArchive();
		$archive->open($archiveName, ZIPARCHIVE::CREATE);
		$includedPic = false;
		foreach ($filesToArchive as $file){
            //echo "<br>adding File: $file";
			$sections = explode(DS,$file);
			$isPic = (strpos($file,'a_pixel.png') > 0)?true:false;
			if ($sections[0] == 'work') {
                array_shift($sections);
                array_shift($sections);

                //echo "<br>adding to zip file at: jxlib".DS.implode(DS,$sections);
				$archive->addFile($file,'jxlib'.DS.implode(DS,$sections));		
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
			if ($sections[0] == 'work' ) {

				$tar->addString('jxlib'.DS.implode(DS,$sections),file_get_contents($file));
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
			if ($sections[0] == 'work') {
				$tar->addString('jxlib'.DS.implode(DS,$sections),file_get_contents($file));
			} 
		}
		break;
}

/**
//remove the files from the server
foreach ($filesToArchive as $file){
	$sections = explode(DS,$file);
	if ($sections[0] == 'work'){
		unlink($file);
	}
}
*/


//setup the return object to send via JSON
$obj = new stdClass();
$obj->success = true;
$obj->filename = $fileName;
$obj->folder = $archiveDir;

echo(json_encode($obj));

?>
