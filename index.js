 var 
    ajaxReq01 = null,
	gDomain = "",   

    geS = " System Error - Please try again",
    g_SpeedTestT1 = null,
    g_SpeedTestT2 = null,
    g_BitRateU = '',
    g_BitRateD = '',
    g_UnitsU = {}, g_UnitsD = {}, 
    g_STfactDL = 1.5,
    g_STfactUL = 1.2,
    geSt1 = ": Speed test unknown error - Please try again",
    geSt2 = ": Speed test bad ajax status - Please try again",

	max_BitRateU = 102400;
	max_BitRateD = 512000;
	download_speed = 0;
	upload_speed = 0;
	
	g_DownloadCnt = 2;
    g_DownloadIdx = 0;
    g_DownloadAvg = null;
	g_DownloadBits = 0;

	g_UploadCnt = 2;
    g_UploadIdx = 0;
    g_UploadAvg = null;
	g_UploadBits = 0,
	g_downloadimages = [ ['speedtest1.jpg',343085], ['speedtest2.jpg',450794] , ['speedtest3.jpg',402868]];

	
function eUC(a) {
    return encodeURIComponent(a)
}


function postAjax(a, c, d, type) {
	if (type == undefined){
	 type = 'POST';	
	}
	a = a.join("&");
	$.ajax({
  		type: type,
		async:false,
 		 url: d,
 		 data: a,
  		success  : c,
		beforeSend  : function(){g_SpeedTestT1 = (new Date).getTime();},
		error: function(){alert("st01a" + geSt2);}
	});
    return !1
}


function getByteLength(a) {
    a = encodeURI(a);
    if (-1 != a.indexOf("%")) {
        var b = a.split("%").length - 1;
        0 === b && b++;
        b += a.length - 3 * b
    } else b = a.length;
    return b
}

function buildBitRateHtml(a, b, c) {
    var d;
    1E6 > b ? (b = parseFloat((b / 1E3).toFixed(2)), d = a + b + 'Kb\/s', c.speed = '' + b, c.units = 'Kb\/s') : 1E9 > b ? (b = parseFloat((b / 1E6).toFixed(2)), d = a + b + 'Mb\/s', c.speed ='' + b, c.units = 'Mb\/s') : 1E12 > b && (b = parseFloat((b / 1E9).toFixed(2)), d = a + b + 'Gb\/s', c.speed = '' + b, c.units = 'Gb\/s');
    return d
}

function buildByteString(a, b) {
    for (var c = "", d = 0; d < b; d++) c += a;
    return c + "\x00"
}

/*--------------------------*/
//Определение DOWNLOAD SPEED методом вызова вызова серверного скрипта speed01.php, который возвращает пакет данных в размере sizeInBite байт
//@PARAM sizeInBite - integer размер пакета в байтах
/*-------------------------*/

function speedTestDownload1(sizeInBite) {
	sizeInBite = (sizeInBite == undefined) ? max_BitRateD : sizeInBite;
	var a = [];
	a[a.length] = "reqLen=" + eUC(sizeInBite);
	a[a.length] = "sid=" + (new Date).valueOf();
	postAjax(a, speedTestDownload1Complite, gDomain+"speed01.php", 'POST');
	return !1
}
/*-----------------------*/
//Обработчик ответа от сервера вызванного в функции speedTestDownload1
/*-----------------------*/
function speedTestDownload1Complite(responseText) {

	var a = "";
	a = responseText.split("\n");
	
	 if ("ok" == a[0]) {
            g_SpeedTestT2 = (new Date).getTime();
			 var b = g_SpeedTestT2 - g_SpeedTestT1;
			 console.log('b='+b);
			 console.log('getByteLength='+getByteLength(a[1]));
			 g_DownloadBits+=getByteLength(a[1]);
			 g_DownloadAvg += b;
			 g_DownloadIdx++;
			 if (g_DownloadIdx < g_DownloadCnt ){
				 setTimeout("speedTestDownload1()", 1);
			 }else{
				console.log('g_DownloadBits='+g_DownloadBits);
				console.log('g_DownloadAvg='+g_DownloadAvg);
	            g_BitRateD = 1E3 * (8 * g_DownloadBits / g_DownloadAvg);
				console.log('g_BitRateD='+g_BitRateD);
            	a = g_BitRateD *= g_STfactDL;
				download_speed = parseFloat(a.toFixed(2));
            	setTimeout("speedTestUpload()", 1E3)
			}
     } else  alert("st01a" + geSt1);
}

/*--------------------------*/
//Определение DOWNLOAD SPEED методом загрузки с сервера фалов. Список файлов описан в массиве g_downloadimages
/*-------------------------*/
function speedTestDownload2() {
	var a = [];
	postAjax(a, speedTestDownload2Complite, gDomain+g_downloadimages[g_DownloadIdx][0]+"?" + Math.random(), 'GET');
   return !1
}
/*-----------------------*/
//Обработчик ответа от сервера вызванного в функции speedTestDownload2
/*-----------------------*/
function speedTestDownload2Complite(responseText){
	
			g_SpeedTestT2 = (new Date).getTime();
			var b = g_SpeedTestT2 - g_SpeedTestT1;
			g_DownloadAvg += b;
			g_DownloadBits+=g_downloadimages[g_DownloadIdx][1];
			console.log('g_downloadimages='+g_downloadimages[g_DownloadIdx][1]);
			console.log('getByteLength='+getByteLength(responseText));
			g_DownloadIdx++;
			if (g_DownloadIdx < g_downloadimages.length ){
				 setTimeout("speedTestDownload2()", 1);
			}else{
	 			console.log(g_DownloadBits);
				g_BitRateD = 1E3 * (8 * g_DownloadBits / g_DownloadAvg);
     			a = g_BitRateD *= g_STfactDL;
	 			download_speed = parseFloat(a.toFixed(2));
				 setTimeout("speedTestUpload()", 1E3);
			}
}

/*--------------------------*/
//Определение DOWNLOAD SPEED методом динамического создания елементов IMG в теле документа с сылками на файлы сервера. Список файлов описан в массиве g_downloadimages
/*-------------------------*/
function speedTestDownload3()
{
	var img_url = gDomain+g_downloadimages[g_DownloadIdx][0]+"?" + Math.random();	
	myImage = $("<img>");
	myImage.bind("load",function(){
		g_SpeedTestT2 = (new Date).getTime();
			var b = g_SpeedTestT2 - g_SpeedTestT1;
			g_DownloadAvg += b;
			g_DownloadBits+=g_downloadimages[g_DownloadIdx][1];
			g_DownloadIdx++;
			if (g_DownloadIdx < g_downloadimages.length ){

				 setTimeout("speedTestDownload3()", 1);
			}else{
	 			console.log(g_DownloadBits+'bite');
				console.log(g_DownloadAvg+'мсек');
				g_BitRateD = 1E3 * (8 * g_DownloadBits / g_DownloadAvg);
     			a = g_BitRateD *= g_STfactDL;
	 			download_speed = parseFloat(a.toFixed(2));
				 setTimeout("speedTestUpload()", 1E3);
			}
		});	
	g_SpeedTestT1 = (new Date).getTime();
	myImage.attr('src',img_url);
	
}

/*--------------------------*/
//Определение UPLOAD SPEED методом POSTа на сервер данных в размере  sizeInBite байт
//@PARAM sizeInBite - integer размер пакета в байтах
/*-------------------------*/
function speedTestUpload(sizeInBite) {
		sizeInBite = (sizeInBite == undefined) ? max_BitRateU : sizeInBite;
        var a = [],
        b = buildByteString("0", max_BitRateU);
        a[a.length] = "ulTS=" + eUC(b);
        a[a.length] = "sid=" + (new Date).valueOf();
     //   g_SpeedTestT1 = (new Date).getTime();
        postAjax(a, speedTestUploadComplite, gDomain+"speed02.php");
        return !1
}
/*-----------------------*/
//Обработчик ответа от сервера вызванного в функции speedTestUpload
/*-----------------------*/
function speedTestUploadComplite(responseText) {
    var a = "";
	a = responseText.split("\n");
    if ( "ok" == a[0] ){
		g_SpeedTestT2 = (new Date).getTime();
		var b = g_SpeedTestT2 - g_SpeedTestT1;
		console.log('b='+b);

		g_UploadAvg += b;
		g_UploadIdx++;
		if (g_UploadIdx < g_UploadCnt ){
				 setTimeout("speedTestUpload()", 1);
		}else{

			g_BitRateU = 1E3 * (8 * max_BitRateU * g_UploadCnt / g_UploadAvg);
			g_BitRateU = Math.round(g_BitRateU);
			console.log('g_BitRateU='+g_BitRateU);

			g_BitRateU *= 1;
			a = g_BitRateU *= g_STfactUL;
			console.log('a='+a);
			upload_speed =  parseFloat(a.toFixed(2));
			setTimeout("printResult('txt')",1E3);
		}
	} else alert("st02a" + geSt1);

}
/*-----------------------*/
//Вывод на екран результатов замера
/*-----------------------*/
function printResult(type){
//	download_speed = buildBitRateHtml("", download_speed, g_UnitsU);
//	upload_speed = buildBitRateHtml("", upload_speed, g_UnitsU);	
	document.body.innerHTML+=(download_speed + '<br/>' + upload_speed);
}
/*-----------------------*/
//Запуск змера скорости
////@PARAM t - integer тип замера
/*-----------------------*/
function speedTest(t)
{
	switch (t) {
	case 1:
      speedTestDownload1();
     break
   case 2:
      speedTestDownload2();
     break
   case 3:
      speedTestDownload3();
     break
   default:
     speedTestDLDownload1();
     break
}
	
	
}