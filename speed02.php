<?php
if (isset($_POST["ulTS"]) || isset($_GET["ulTS"])) {
	if (isset($_POST["ulTS"])) {
		$ulTS = $_POST["ulTS"];
	}
	if (isset($_GET["ulTS"])) {
		$ulTS = $_GET["ulTS"];
	}
	echo "ok\n".(strlen($ulTS)-1);
}
else {
	echo "ok\n-1";
}
?>