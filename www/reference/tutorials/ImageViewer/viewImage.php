<?php

$szWidth =  isset($_GET["w"])?$szWidth = $_GET["w"]: $szWidth = "";
$szFileName =  isset($_GET["f"])?$szFileName =$_GET["f"]: $szFileName = "";
$szPercent = isset($_GET["p"])?$szPercent =$_GET["p"]: $szPercent = "";

$szFilePath = dirname(__FILE__)."/samples/".$szFileName;


if($szWidth >0){
    // resize by with with aspect
    
    if($szFileName != ""){

        $width = $szWidth;
        /*** the image file to thumbnail ***/

        if(!file_exists($szFilePath))
        {
            echo 'No file found';
        }
        else
        {
            /*** image info ***/
            list($width_orig, $height_orig, $image_type) = getimagesize($szFilePath);
            /*** check for a supported image type ***/
            if($image_type !== 2){
                echo 'invalid image';
                }
                else
                {
                /*** thumb image name ***/
                $thumb = 'thumb.jpg';

                /*** maintain aspect ratio ***/
                $height = (int) (($width / $width_orig) * $height_orig);

                /*** resample the image ***/
                $image_p = imagecreatetruecolor($width, $height);
                $image = imageCreateFromJpeg($szFilePath);
                imagecopyresampled($image_p, $image, 0, 0, 0, 0, $width, $height, $width_orig, $height_orig);
                header('Content-type: image/jpeg');
                imageJpeg($image_p, null, 100);
            }
        }
    }
}

if($szPercent != ""){
    //resize by percent

    // Get new dimensions
    list($width, $height, $image_type) = getimagesize($szFilePath);

    if($image_type !== 2){
        echo 'invalid image';
        }
        else
        {    
        $new_width = $width * $szPercent;
        $new_height = $height * $szPercent;

        // Resample
        $image_p = imagecreatetruecolor($new_width, $new_height);
        $image = imagecreatefromjpeg($szFilePath);
        imagecopyresampled($image_p, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);

        // Output
        header('Content-type: image/jpeg');
        imagejpeg($image_p, null, 100);
    }
}

?>