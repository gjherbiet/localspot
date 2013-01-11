<?php
$test ="";
if (isset($_POST["test"])) {
	$test = $_POST["test"];
}
else if (isset($_GET["test"])) {
	$test = $_GET["test"];
}
else {
	$test ="";
}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Speedtest</title>
<script type="text/javascript" src="jquery.js"></script>
<script type="text/javascript" src="index.js"></script>
</head>
<body onLoad="speedTest(<?php echo "$test" ?>);">
</body>
</html>


