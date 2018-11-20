<?
    $image = imagecreatetruecolor(10,10)
       or die('Cannot create image');

    imagefill($image, 0, 0, 0xFFFFFF);
    header('Content-type: image/png');
    imagepng($image);
    imagedestroy($image);
?>
