<?php
if (isset($_POST["reqLen"]) || isset($_GET["reqLen"])) {
	if (isset($_POST["reqLen"])) {
		$reqLen = $_POST["reqLen"];
	}
	if (isset($_GET["reqLen"])) {
		$reqLen = $_GET["reqLen"];
	}
	header("Content-type: application/binary");
	echo "ok\n".(str_repeat("0",$reqLen));
}
?>
