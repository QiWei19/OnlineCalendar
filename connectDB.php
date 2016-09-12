<?php
$db_host="localhost";
$db_user="wustl_inst";
$db_psw="wustl_pass";
$db_name="calendar";
$mysqli = new mysqli($db_host, $db_user, $db_psw, $db_name);
if ($mysqli->connect_error) {
	echo "Connection Error: ".htmlentities($mysqli->connect_error);
	exit;
}
?>