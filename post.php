<?php
$data = $_POST['data'];

$file = fopen("articles.txt","a+");
fwrite($file,"\n".$data);
fclose($file);

echo 'ready';
?>