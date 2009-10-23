<?php

if(isset($_GET["exif"])){
    // get the images exif data
    $aExtension = split("\.",$_GET["exif"]);
    //print_r(exif_read_data(dirname(__FILE__)."/samples/".$_GET["exif"]));
    if(strtolower($aExtension[count($aExtension)-1]) == "jpg"){
        echo var2json(createExifObject(exif_read_data(dirname(__FILE__)."/samples/".$_GET["exif"])));
    }
    else
    {
        echo "null";
    }

}
else
{
    // show the directory
    getImagesDirectory();
}

function getImagesDirectory(){
    $handle = opendir(dirname(__FILE__)."/samples") or die("Unable to open this directory");
    $aFiles = array();
    /* loop through files in directory */
    while (false!==($file = readdir($handle))) {
        $aExtension = split("\.",$file);
        switch(strtolower($aExtension[count($aExtension)-1])){
            case "png":
            case "gif":
            case "jpg":{
                array_push($aFiles,$file);
            break;
            }
        }
    }

    /* close the directory */
    closedir($handle);
    echo var2json($aFiles);
}
function var2json($var) {
    $result = "";
    if (is_object($var)) {
        $result .= "{";
        $sep = "";
        foreach($var as $key => $val) {
            $result .= $sep.'"'.$key.'":'.var2json($val);
            $sep = ",";
        }
        $result .= "}";
    } else if (is_array($var)) {
        $result .= "[";
        $sep = "";
        for($i=0; $i<count($var); $i++) {
            $result .= $sep.var2json($var[$i]);
            $sep = ",";
        }
        $result .= "]";
    } else if (is_string($var)) {
        //$tmpStr = str_replace("'", "\'", $var);
        $tmpStr = str_replace('"', '\"', $var);
        $result = '"'.str_replace("\n", '\n', $tmpStr).'"';
    } else if (is_bool($var)) {
        $result = $var ? 'true' : 'false';
    } else if (is_null($var)) {
        $result = 'null';
    }else {
        $result = $var;
    }
    return $result;
}


function createExifObject($aArray){

    $oTmp = NULL;
    $oTmp->make = @$aArray["Make"];
    $oTmp->model = @$aArray["Model"];
    $oTmp->fsize = @$aArray["FileSize"];
    $oTmp->width = @$aArray["COMPUTED"]["Width"];
    $oTmp->height = @$aArray["COMPUTED"]["Height"];
    $oTmp->datetime = @$aArray["DateTime"];
    $oTmp->exposure = @$aArray["ExposureTime"];
    $oTmp->apature = @$aArray["MaxApertureValue"];
    $oTmp->bias = @$aArray["ExposureBiasValue"];
    $oTmp->focalLength = @$aArray["FocalLength"];

    return $oTmp;

}


?>