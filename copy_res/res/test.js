var strViewerDivId = "OZViewer";
var pViewer = document.getElementById(strViewerDivId);

window["SetOZParamters_" + strViewerDivId] = function () {
	pViewer.sendToActionScript("information.debug", "true");
	pViewer.sendToActionScript("etcmenu.showconsole", "true");
	pViewer.sendToActionScript("comment.all", "true");
	pViewer.sendToActionScript("connection.servlet", "http://172.31.0.61:8080/oz/server");
	pViewer.sendToActionScript("connection.reportname", "ozr_Old/FreezePane_TopBottom.ozr");
	return true;
}

var opt = new Object();
opt["rendering_mode"] = "svg"; // default: "canvas"

start_ozjs(strViewerDivId, null, opt);