
// # PolyFill - Object.assign
if (typeof Object.assign != 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
        value: function assign(target, varArgs) { // .length of function is 2
            'use strict';
            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) { // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
}


window.ozviewer = null;
window.OZ = (function () {
    OZ = {};
    OZ.VIEWER_ActiveX = 1;
    OZ.VIEWER_EXE = 2;
    OZ.VIEWER_Applet = 3;
    OZ.VIEWER_HTML5_PC = 4;
    OZ.VIEWER_HTML5_Mobile = 5;
    OZ.VIEWER_HTML5SVG_PC = 6;
    OZ.VIEWER_HTML5SVG_Mobile = 7;
    OZ.VIEWER_Android = 8;
    OZ.VIEWER_iOS = 9;
    OZ.VIEWER_WinUWP = 10;
    OZ.VIEWER_MultiScreen = 11;
    OZ.WebConsole = 12;
    OZ.CloudType = 13;
    OZ.OnPremiseType = 14;
    OZ.VIEWER_TotoFramework = 15;

    OZ.ViewerType = OZ.VIEWER_HTML5_PC;

    OZ.__ViewerID__ = "ozviewer";
    OZ.__ViewerHTML5PATH__ = "ozviewer";
    OZ.__FrameID__ = "ozviewer_frame";
    OZ.__ExternalFrameID__ = "dev-test-external";


    OZ._bt_isIOS__ = (navigator.userAgent.indexOf("iPhone") != -1 || navigator.userAgent.indexOf("iPad") != -1 || navigator.userAgent.indexOf("iPod") != -1
        || (typeof navigator.platform != "undefined" && navigator.platform === "MacIntel" && navigator["maxTouchPoints"] > 1));
    OZ._bt_isAndroid__ = navigator.userAgent.indexOf("Android") != -1;
    OZ._bt_isStockBrowser__ = OZ._bt_isAndroid__ && (navigator.userAgent.indexOf("SamsungBrowser") != -1 || navigator.userAgent.indexOf("Version") != -1);
    OZ._bt_isBlackBerry__ = navigator.userAgent.indexOf("BlackBerry") != -1;
    OZ._bt_isOldIE__ = navigator.appName.indexOf("Microsoft") != -1;
    OZ._bt_isIE__ = OZ._bt_isOldIE__ || (navigator.userAgent.indexOf("Trident") != -1);
    OZ._bt_isIE_8__ = false;
    OZ._bt_isOpera__ = navigator.userAgent.indexOf("Opera") != -1;
    OZ._bt_isSafari__ = navigator.userAgent.indexOf("Safari") != -1;
    OZ._bt_isFirefox__ = navigator.userAgent.indexOf("Firefox") != -1;
    OZ._bt_isChrome__ = navigator.userAgent.indexOf("Chrome") != -1;
    OZ._bt_isIOS_Chrome__ = navigator.userAgent.indexOf("CriOS") != -1;
    OZ._bt_isIOS_Webview__ = navigator.userAgent.indexOf("OZ HTML5/7.0 (ios-webview)") != -1;
    OZ._bt_isEdge__ = navigator.userAgent.indexOf("Edge") != -1;
    OZ._bt_isAndroid_2_x__ = OZ._bt_isAndroid__ && (navigator.userAgent.match(/android 2\./i));
    OZ._bt_isPC_OS__ = (navigator.appVersion.indexOf("Win") != -1 || navigator.appVersion.indexOf("Mac") != -1 || navigator.appVersion.indexOf("X11") != -1 || navigator.appVersion.indexOf("Linux") != -1);
    if (OZ._bt_isAndroid__ || OZ._bt_isIOS__
        || (navigator.userAgent.indexOf("webOS") != -1)
        || (navigator.userAgent.indexOf("BlackBerry") != -1)
        || (navigator.userAgent.indexOf("Windows Phone") != -1)) {
        OZ._bt_isPC_OS__ = false;
    }
    else {
        OZ._bt_isPC_OS__ = true;
    }
    OZ._bt_isOZTotoFramework__ = navigator.userAgent.indexOf("OZTotoFramework") != -1;// || s_ReqUserAgent.indexOf("OZTotoFramework") != -1;
    OZ._bt_isWinUWP__ = OZ._bt_isOZTotoFramework__ && OZ._bt_isPC_OS__;

    OZ.IsTotoFramework = function () {
        //OZ._bt_isOZTotoFramework__ || 
        if (OZ.ViewerType == OZ.VIEWER_TotoFramework || OZ.ViewerType == OZ.VIEWER_Android || OZ.ViewerType == OZ.VIEWER_iOS || OZ.ViewerType == OZ.VIEWER_WinUWP) {
            return true;
        }
        return false;
    };

    OZ.IsHTML5 = function () {
        if (OZ.ViewerType == OZ.VIEWER_HTML5_PC || OZ.ViewerType == OZ.VIEWER_HTML5_Mobile || OZ.ViewerType == OZ.VIEWER_HTML5SVG_PC || OZ.ViewerType == OZ.VIEWER_HTML5SVG_Mobile) {
            return true;
        }
        return false;
    };

    OZ.int = function (nValue) {
        return nValue | 0;
    };
    OZ.getRandomInt = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    OZ.IsEmpty = function (strValue) {
        if (strValue != null && strValue.length > 0) {
            return false;
        } else {
            return true;
        }
    };
    OZ.Trim = function (strValue) {
        if (OZ.IsEmpty(strValue)) {
            return "";
        } else {
            return strValue.replace(/^\s+|\s+$/g, "");
        }
    };
    OZ.Bind = function (scope, func /*, args ... */) {
        var extraArgs = null;
        if (arguments.length > 2) {
            extraArgs = Array.prototype.slice.call(arguments, 2);
        }
        return function () {
            var refArgs = arguments;
            if (extraArgs != null) {
                var _refArgs = Array.prototype.slice.call(arguments);
                refArgs = _refArgs.concat(extraArgs);
            }
            return func.apply(scope, refArgs);
        };
    };
    OZ.IsFunction = function (func) {
        if (typeof func == "function" || func instanceof Function) {
            return true;
        }
        return false;
    };
    OZ.GetOptionalArgsObj = function (nArgsCount, _arguments) {
        var refArgs = Array.prototype.slice.call(_arguments);
        var resolveFunc = refArgs[refArgs.length - 1];
        var pCallback = null;
        if (OZ.IsFunction(resolveFunc)) {
            pCallback = refArgs.splice(refArgs.length - 1, 1);
        }
        var nLength = refArgs.length;
        if (nLength < nArgsCount) {
            for (var i = nLength; i < nArgsCount; i++) {
                refArgs.push(undefined);
            }
        }
        var retObj = {};
        retObj.Args = refArgs;
        retObj.Callback = pCallback;
        return retObj;
    };

    OZ.GetExternalFrame = function () {
        return top.document.getElementById(OZ.__ExternalFrameID__);
    };

    OZ.GetChildFrame = function () {
        return top.document.getElementById(OZ.__FrameID__);
    };

    OZ.GetChildFrameWindow = function () {
        var viewerFrame = OZ.GetChildFrame();
        if (viewerFrame) {
            return viewerFrame.contentWindow;
        }
        return null;
    };

    OZ.GetOZViewer = function () {
        if (OZ.IsTotoFramework()) {
            return top.ozviewer;
        }
        var viewerFrameWnd = OZ.GetChildFrameWindow();
        return viewerFrameWnd.ozviewer;
    };

    return OZ;
})();


//s_ViewerParameters = {};
//s_ViewerEvents = {};
//s_ViewerParams_JSON = [];
//for (var i = 0; i < 7; i++) {
//    var strPrefix = "";
//    if (i > 0) {
//        strPrefix = "child" + i + ".";
//    }
//    s_ViewerParams_JSON.push(strPrefix + "toolbar.custombuttons");
//    s_ViewerParams_JSON.push(strPrefix + "eform.custom_ui");
//    s_ViewerParams_JSON.push(strPrefix + "viewer.userdefined_format_json");
//    s_ViewerParams_JSON.push(strPrefix + "viewer.closemessage_json");
//    s_ViewerParams_JSON.push(strPrefix + "pdf.custom_metadata_json");

//    s_ViewerParams_JSON.push(strPrefix + "connection.inputjson");
//    s_ViewerParams_JSON.push(strPrefix + "eform.attachmentbutton_save_info");
//    s_ViewerParams_JSON.push(strPrefix + "eform.direct_input_highlight_stylejson");
//    s_ViewerParams_JSON.push(strPrefix + "eform.onvaluechanged_callrule_json");
//    s_ViewerParams_JSON.push(strPrefix + "etcmenu.copyinputdata_json");

//    s_ViewerParams_JSON.push(strPrefix + "connection.alternativereport_json");
//    s_ViewerParams_JSON.push(strPrefix + "eform.highlight_stylejson");
//    s_ViewerParams_JSON.push(strPrefix + "eform.inputcomponent_toolbar_button_json");
//    s_ViewerParams_JSON.push(strPrefix + "eform.imagepicker_seal_stylejson");
//    s_ViewerParams_JSON.push(strPrefix + "multiscreen.custom_ui");
//}

window.OZDevTest = (function () {
    OZDevTest = {};

    //react => js
    OZDevTest.InitializeResources = function (currentViewerType, resObj, pCallback) {
        OZDevTest.SetViewerType(currentViewerType);

        if (OZ.IsTotoFramework()) {
            if (typeof top.window.OZTotoFramework != "undefined") {
                pCallback();
                return;
            }
            resArray.push(resObj["totoframework_js_url"]);

        } else {
            var strJqueryPath = resObj["jquery_path"];
            var strViewerPath = resObj["viewer_path"];
            var resArray = [];
            resArray.push(strJqueryPath + "jquery-2.0.3.min.js");
            resArray.push(strJqueryPath + "jquery-ui.css");
            resArray.push(strJqueryPath + "jquery-ui.min.js");
            
            if (OZ.ViewerType == OZ.VIEWER_ActiveX || OZ.ViewerType == OZ.VIEWER_MultiScreen) {
                resArray.push(strViewerPath + "ztransferx_browers.js");
                resArray.push(strViewerPath + "ozviewer_browers.js");

            } else if (OZ.IsHTML5()) {
                var bIsHTML5Mobile = OZ.ViewerType == OZ.VIEWER_HTML5_Mobile || OZ.ViewerType == OZ.VIEWER_HTML5SVG_Mobile;
                if (bIsHTML5Mobile) {
                    resArray.push(strJqueryPath + "jquery.mobile-1.4.5.min.css");
                    resArray.push(strJqueryPath + "jquery.mobile-1.4.5.min.js");
                    resArray.push(strJqueryPath + "jquery.mobile.simpledialog.min.css");
                    resArray.push(strJqueryPath + "jquery.mobile.simpledialog2.min.js");
                }
                resArray.push(strViewerPath + "ui.dynatree.css");
                resArray.push(strViewerPath + "jquery.dynatree.js");
                if (OZ.ViewerType == OZ.VIEWER_HTML5SVG_PC || OZ.ViewerType == OZ.VIEWER_HTML5SVG_Mobile) {
                    resArray.push(strViewerPath + "OZJSSVGViewer.js");
                } else {
                    resArray.push(strViewerPath + "OZJSViewer.js");
                }
                if (bIsHTML5Mobile) {
                    resArray.push(strViewerPath + "jquery.mouseSwipe.js");
                }
                resArray.push(strViewerPath + "pdf_js/web/compatibility.js");
                resArray.push(strViewerPath + "pdf_js/build/pdf.js");
                if (OZ.ViewerType == OZ.VIEWER_HTML5_PC) {
                    var strSummerNotePath = resObj["viewer_summernote_path"];
                    resArray.push(strSummerNotePath + "summernote-lite.min.css");
                    resArray.push(strSummerNotePath + "summernote-lite.min.js");
                    resArray.push(strSummerNotePath + "lang/summernote-ko-KR.min.js");
                    resArray.push(strSummerNotePath + "summernote-ext-table.css");
                    resArray.push(strSummerNotePath + "summernote-ext-table.js");
                    //resArray.push(strViewerPath + "HtmlEditor/summernote-ext-table.css");
                    //resArray.push(strViewerPath + "HtmlEditor/summernote-ext-table.js");
                }
            } else if (OZ.ViewerType == OZ.VIEWER_EXE) {
                resArray.push(resObj["exe_js_url"]);   //ozws.js
            }
        }

        var viewerFrameWnd = (OZ.IsTotoFramework() ? top.window: OZ.GetChildFrameWindow());
        var pGetDocument = function (bUseTopWindow) {
            if (bUseTopWindow) {
                return top.document;
            }
            return viewerFrameWnd.document;
        };
        var pAppendResource = function (strURL) {
            var bIsStyleCSS = strURL.indexOf(".css") != -1;
            //var pDocument = pGetDocument(strURL.indexOf("summernote") != -1);
            var pDocument = pGetDocument(false);
            var targetNode = null;
            if (bIsStyleCSS) {
                targetNode = pDocument.createElement("link");
                targetNode.rel = "stylesheet";
                targetNode.href = strURL;
            } else {
                targetNode = pDocument.createElement("script");
                targetNode.type = "text/javascript";
                targetNode.src = strURL;
            }
            targetNode.onerror = pCheckCallback;
            targetNode.onload = pCheckCallback;
            pDocument.head.appendChild(targetNode);
        };
        var pCheckCallback = function (e) {
            if (resArray.length == 0) {
                pCallback();
            } else {
                pAppendResource(resArray.splice(0, 1)[0]);
            }
        };
        pAppendResource(resArray.splice(0, 1)[0]);
    };

    //react => js
    OZDevTest.Initialize = function (currentViewerType, extEventObjList, viewerExtOptions) {
        //OZDevTest.SetViewerType(currentViewerType);
        if (currentViewerType == OZ.VIEWER_ActiveX || currentViewerType == OZ.VIEWER_MultiScreen) {
            var viewerFrameWnd = OZ.GetChildFrameWindow();
            viewerFrameWnd.ztransfer_version = viewerExtOptions["ztransfer_version"];
            viewerFrameWnd.ZTInstallEndCommand_ZTransferX = function (param1, param2) {
                viewerFrameWnd.Create_Div();
                viewerFrameWnd.Initialize_OZViewer(OZ.__ViewerID__, "CLSID:0DEF32F8-170F-46f8-B1FF-4BF7443F5F25", "99%", "95%", "application/OZRViewer");
                viewerFrameWnd.Insert_OZViewer_Param("viewer.isframe", "false");
                viewerFrameWnd.Insert_OZViewer_Param("viewer.namespace", viewerExtOptions["namespace"] + "\\ozviewer");
                OZDevTest.StartViewerDelegate = viewerFrameWnd["Start_OZViewer"];
            };
            viewerFrameWnd.Initialize_ZT("ZTransferX", "CLSID:C7C7225A-9476-47AC-B0B0-FF3B79D55E67", "0", "0", viewerExtOptions["viewer_path"] + "ZTransferX_" + viewerExtOptions["ztransfer_version"] + ".cab#version=" + viewerExtOptions["ztransfer_version"]);
            viewerFrameWnd.Insert_ZT_Param("download.server", viewerExtOptions["download_server_url"]);
            viewerFrameWnd.Insert_ZT_Param("download.port", viewerExtOptions["download_server_port"]);
            viewerFrameWnd.Insert_ZT_Param("download.instruction", "ozrviewer.idf");
            viewerFrameWnd.Insert_ZT_Param("install.base", "<PROGRAMS>/Forcs");
            viewerFrameWnd.Insert_ZT_Param("install.namespace", viewerExtOptions["namespace"]);
            viewerFrameWnd.Start_ZT();

        } else if (currentViewerType == OZ.VIEWER_EXE) {
            var viewerFrameWnd = OZ.GetChildFrameWindow();
            viewerFrameWnd.OZUtil = viewerFrameWnd.start_OZUtil;
            viewerFrameWnd.namespace = viewerExtOptions["namespace"];
            viewerFrameWnd.protocolversion = viewerExtOptions["protocolversion"];
            viewerFrameWnd.download_server_url = viewerExtOptions["download_server_url"];
            viewerFrameWnd.download_server_port = viewerExtOptions["download_server_port"];
            viewerFrameWnd.setup_exe_download_path = viewerExtOptions["setup_exe_download_path"];
            viewerFrameWnd.ozviewer.GetResolveObj = function () {
                var obj = {};
                obj.HasResult = false;
                obj.Result = "";
                return obj;
            };
            viewerFrameWnd.ozviewer.ResolveHelper = function (obj, retArgs) {
                try {
                    var resultObj = JSON.parse(retArgs[0]);
                    if (resultObj && resultObj.retval !== undefined) {
                        obj.Result = resultObj.retval;
                        obj.HasResult = true;
                    }
                } catch (e) {
                } finally {
                }
            };
            viewerFrameWnd.ozviewer.CallbackHelper = function (strType) {   // , strArg, ..., pCallback
                var refArgs = Array.prototype.slice.call(arguments);
                var resolveFunc = refArgs[refArgs.length - 1];
                var retFunc = null;
                if (OZ.IsFunction(resolveFunc)) {     // && resolveFunc.name == "OZResolve"
                    retFunc = OZ.Bind(null, function () {
                        var resolveObj = viewerFrameWnd.ozviewer.GetResolveObj();
                        var retArgs = Array.prototype.slice.call(arguments);
                        viewerFrameWnd.ozviewer.ResolveHelper(resolveObj, retArgs);
                        var _resolveFunc = retArgs[retArgs.length - 1];
                        if (resolveObj.HasResult) {
                            _resolveFunc.call(null, resolveObj.Result);
                        } else {
                            _resolveFunc.apply(null, arguments);
                        }
                    }, resolveFunc);
                }

                refArgs.splice(0, 1);
                if (retFunc) {
                    refArgs.splice(refArgs.length - 1, 1);
                    refArgs.push(retFunc);
                }

                var targetArgs = [];
                targetArgs.push(OZ.__ViewerID__);
                targetArgs = targetArgs.concat(refArgs);

                var OZUtil = viewerFrameWnd.OZUtil;
                var targetFunc = null;
                switch (strType) {
                    case "GetInformation": {
                        targetFunc = OZUtil.GetInformation;
                        //OZUtil.GetInformation.apply(null, targetArgs);
                        // OZUtil.GetInformation(OZ.__ViewerID__, refArgs[1], retFunc);
                    } break;
                    case "Script": {
                        targetFunc = OZUtil.Script;
                    } break;
                    case "ScriptEx": {
                        targetFunc = OZUtil.ScriptEx;
                    } break;
                    case "CreateReport": {
                        targetFunc = OZUtil.CreateReport;
                    } break;
                    case "CreateReportEx": {
                        targetFunc = OZUtil.CreateReportEx;
                    } break;
                    case "ReBind": {
                        targetFunc = OZUtil.ReBind;
                    } break;
                    case "Document_SetGlobal": {
                        targetFunc = OZUtil.Document_SetGlobal;
                    } break;
                    case "Document_GetGlobal": {
                        targetFunc = OZUtil.Document_GetGlobal;
                    } break;

                    case "Document_SetChartStyle": {
                        targetFunc = OZUtil.Document_SetChartStyle;
                    } break;
                    case "Document_GetTitle": {
                        targetFunc = OZUtil.Document_GetTitle;
                    } break;
                    case "Document_GetPaperWidth": {
                        targetFunc = OZUtil.Document_GetPaperWidth;
                    } break;
                    case "Document_GetPaperHeight": {
                        targetFunc = OZUtil.Document_GetPaperHeight;
                    } break;
                    case "Document_PingOZServer": {
                        targetFunc = OZUtil.Document_PingOZServer;
                    } break;

                    case "Document_TriggerExternalEvent": {
                        targetFunc = OZUtil.Document_TriggerExternalEvent;
                    } break;
                    case "Document_TriggerExternalEventByDocIndex": {
                        targetFunc = OZUtil.Document_TriggerExternalEventByDocIndex;
                    } break;
                    case "Document_TriggerLocationUpdated": {
                        targetFunc = OZUtil.Document_TriggerLocationUpdated;
                    } break;
                    case "Document_TriggerLocationUpdatedByDocIndex": {
                        targetFunc = OZUtil.Document_TriggerLocationUpdatedByDocIndex;
                    } break;

                }
                if (targetFunc) {
                    targetFunc.apply(null, targetArgs);
                }
            };
        }
        OZDevTest.ExtendsViewerCommand(extEventObjList);
    };

    OZDevTest.SetViewerType = function (viewerType) {
        OZ.ViewerType = viewerType;
    };

    //js => react
    OZDevTest.OnLoadedViewerFrame = function (currentViewerType) {
        try {
            var externalFrame = OZ.GetExternalFrame();
            externalFrame.OnLoadedViewerFrame();
        } catch (e) {
            console.error(e);
        }
    };

    OZDevTest.alert = function (strValue) {
        try {
            //if (OZ.IsTotoFramework()) {
            //    OZTotoFramework.util.alert(strValue);
            //} else {
            //    alert(strValue);
            //}
            var externalFrame = OZ.GetExternalFrame();
            externalFrame.alert("" + strValue);
        } catch (e) {
            console.error(e);
        }
    };

    OZDevTest.SetExternalObjArray = function (strText, pOnClickFunc, strID, strType) {
        try {
            var externalFrame = OZ.GetExternalFrame();
            externalFrame.SetExternalObjArray("" + strText, pOnClickFunc, strID, strType);
        } catch (e) {
            console.error(e);
        }
    };

    OZDevTest.SetExternalViewerEvent = function (strEventName, pFunc) {
        try {
            var externalFrame = OZ.GetExternalFrame();
            externalFrame.SetExternalViewerEvent("" + strEventName, pFunc);
        } catch (e) {
            console.error(e);
        }
    };

    OZDevTest.LogLine = function (strValue) {
        OZDevTest.Log(strValue, "\n");
    };
    OZDevTest.Log = function (strValue, strDelimiter) {
        try {
            var externalFrame = OZ.GetExternalFrame();
            externalFrame.Log("" + strValue, strDelimiter);
        } catch (e) {
            console.error(e);
        }
    };
    OZDevTest.ClearLog = function () {
        try {
            var externalFrame = OZ.GetExternalFrame();
            externalFrame.ClearLog();
        } catch (e) {
            console.error(e);
        }
    };
    OZDevTest.RemoveLog = function () {
        OZDevTest.ClearLog();
    };

    OZDevTest.CopyText = function (strText) {

    };

    //react => js
    OZDevTest.CheckInstalledViewer = function (pErrorFunc, pSuccessFunc) {
        var viewerFrameWnd = OZ.GetChildFrameWindow();

        var ztParam = new Object();
        ztParam.InstallBase = "<PROGRAMS>/Forcs";
        ztParam.InstallNamespace = viewerFrameWnd.namespace;
        ztParam.DownloadServer = viewerFrameWnd.download_server_url;
        ztParam.DownloadPort = viewerFrameWnd.download_server_port;
        ztParam.DownloadInstruction = "ozrviewer.idf";

        viewerFrameWnd.OZUtil.installViewer(viewerFrameWnd.protocolversion, ztParam, function () {
            if (viewerFrameWnd.confirm("설치가 필요 합니다. 프로그램 설치 후 다시 시도 하십시오.")) {
                viewerFrameWnd.document.getElementById("downfrm").src = viewerFrameWnd.setup_exe_download_path;
            }
            pErrorFunc();
        }, pSuccessFunc);
    };

    //react => js
    OZDevTest.StartViewer = function (pSuccessFunc) {
        var viewerFrameWnd = OZ.GetChildFrameWindow();
        OZDevTest.StartViewerDelegate.call(viewerFrameWnd);
        setTimeout(function () {
            parent.ozviewer = viewerFrameWnd.ozviewer;
            if (pSuccessFunc) {
                pSuccessFunc();
            }
        }, 0);
    };

    OZDevTest.GetInformation = function (strArg, pCallback) {
        var ozviewer = OZ.GetOZViewer();
        if (OZ.IsTotoFramework()) {
            ozviewer.getInformation(strArg, pCallback);
        } else if (OZ.ViewerType == OZ.VIEWER_EXE) {
            // extends from dev_test_frame.js
            ozviewer.CallbackHelper("GetInformation", strArg, pCallback);
        } else {
            var retValue = ozviewer.GetInformation(strArg);
            if (OZ.IsFunction(pCallback)) {
                pCallback(retValue);
            }
        }
    };
    OZDevTest.Script = function (strArg) {
        var ozviewer = OZ.GetOZViewer();
        if (OZ.IsTotoFramework()) {
            ozviewer.script(strArg);
        } else if (OZ.ViewerType == OZ.VIEWER_EXE) {
            ozviewer.CallbackHelper("Script", strArg);
        } else {
            ozviewer.Script(strArg);
        }
    };
    OZDevTest.ScriptEx = function (strCommand, strArg, strDelimiter, pCallback) {
        var ozviewer = OZ.GetOZViewer();
        if (OZ.IsTotoFramework()) {
            ozviewer.scriptEx(strCommand, strArg, strDelimiter, pCallback);
        } else if (OZ.ViewerType == OZ.VIEWER_EXE) {
            ozviewer.CallbackHelper("ScriptEx", strCommand, strArg, strDelimiter, pCallback);
        } else {
            ozviewer.ScriptEx(strCommand, strArg, strDelimiter);
        }
    };
    OZDevTest.CreateReport = function (strArg) {
        var ozviewer = OZ.GetOZViewer();
        if (OZ.IsTotoFramework()) {
            ozviewer.createReport(strArg);
        } else if (OZ.ViewerType == OZ.VIEWER_EXE) {
            ozviewer.CallbackHelper("CreateReport", strArg);
        } else {
            ozviewer.CreateReport(strArg);
        }
    };
    OZDevTest.CreateReportEx = function (strArg, strDelimiter) {
        var ozviewer = OZ.GetOZViewer();
        if (OZ.IsTotoFramework()) {
            //ozviewer.createReportEx(strArg, strDelimiter);
            ozviewer.createReport(strArg, strDelimiter);
        } else if (OZ.ViewerType == OZ.VIEWER_EXE) {
            ozviewer.CallbackHelper("CreateReportEx", strArg, strDelimiter);
        } else {
            ozviewer.CreateReportEx(strArg, strDelimiter);
        }
    };
    OZDevTest.ReBind = function (report_index, rebind_type, str_param, str_delimiter, str_keepediting, pCallback) {
        //var refArgs = Array.prototype.slice.call(arguments);
        var ozviewer = OZ.GetOZViewer();
        if (OZ.IsTotoFramework()) {
            ozviewer.rebind(report_index, rebind_type, str_param, str_delimiter, str_keepediting);
        } else if (OZ.ViewerType == OZ.VIEWER_EXE) {
            ozviewer.CallbackHelper("ReBind", report_index, rebind_type, str_param, str_delimiter, str_keepediting, pCallback);
        } else {
            ozviewer.ReBind(report_index, rebind_type, str_param, str_delimiter, str_keepediting);
        }
    };

    OZDevTest.Document_SetGlobal = function (strKey, pValue, nIndex, pCallback) {
        var ozviewer = OZ.GetOZViewer();
        if (OZ.IsFunction(nIndex)) {
            pCallback = nIndex;
            nIndex = undefined;
        }
        if (OZ.IsTotoFramework()) {
            ozviewer.document.setGlobal(strKey, pValue, nIndex);
        } else if (OZ.ViewerType == OZ.VIEWER_EXE) {
            ozviewer.CallbackHelper("Document_SetGlobal", strKey, pValue, nIndex, pCallback);
        } else {
            ozviewer.Document_SetGlobal(strKey, pValue, nIndex);
        }
    };
    OZDevTest.Document_GetGlobal = function (strKey, nIndex, pCallback) {
        var ozviewer = OZ.GetOZViewer();
        if (OZ.IsFunction(nIndex)) {
            pCallback = nIndex;
            nIndex = undefined;
        }
        if (OZ.IsTotoFramework()) {
            var retValue = ozviewer.document.getGlobal(strKey, nIndex);
            if (OZ.IsFunction(pCallback)) {
                pCallback(retValue);
            }
        } else if (OZ.ViewerType == OZ.VIEWER_EXE) {
            ozviewer.CallbackHelper("Document_GetGlobal", strKey, nIndex, pCallback);
        } else {
            var retValue = ozviewer.Document_GetGlobal(strKey, nIndex);
            if (OZ.IsFunction(pCallback)) {
                pCallback(retValue);
            }
        }
    };

    OZDevTest.Document_GetTitle = function (pCallback) {
        var ozviewer = OZ.GetOZViewer();
        if (OZ.IsTotoFramework()) {
            var retValue = ozviewer.document.getTitle();
            if (OZ.IsFunction(pCallback)) {
                pCallback(retValue);
            }
        } else if (OZ.ViewerType == OZ.VIEWER_EXE) {
            ozviewer.CallbackHelper("Document_GetTitle", pCallback);
        } else {
            var retValue = ozviewer.Document_GetTitle();
            if (OZ.IsFunction(pCallback)) {
                pCallback(retValue);
            }
        }
    };
    OZDevTest.Document_PingOZServer = function (strURL, strPort, pCallback) {
        var ozviewer = OZ.GetOZViewer();
        var refArgs = Array.prototype.slice.call(arguments);
        var resolveFunc = refArgs[refArgs.length - 1];
        if (OZ.IsFunction(resolveFunc)) {
            refArgs.splice(refArgs.length - 1, 1);
            pCallback = resolveFunc;
        }
        if (OZ.IsTotoFramework()) {
            var retValue = ozviewer.document.pingOZServer.apply(ozviewer.document, refArgs);
            pCallback(retValue);
        } else if (OZ.ViewerType == OZ.VIEWER_EXE) {
            ozviewer.CallbackHelper("Document_PingOZServer", strURL, strPort, pCallback);
        } else {
            var retValue = ozviewer.Document_PingOZServer(refArgs[0], refArgs[1]);
            pCallback(retValue);
            //if (OZ.IsFunction(ozviewer.Document_PingOZServer)) {
            //    var retValue = ozviewer.Document_PingOZServer.apply(ozviewer, refArgs);
            //    pCallback(retValue);
            //} else {
            //    var retValue = ozviewer.Document_PingOZServer(refArgs[0], refArgs[1]);
            //    pCallback(retValue);
            //}
        }
    };

    OZDevTest.Document_GetPaperWidth = function (pCallback) {
        var ozviewer = OZ.GetOZViewer();
        if (OZ.IsTotoFramework()) {
            var retValue = ozviewer.document.getPaperWidth();
            if (OZ.IsFunction(pCallback)) {
                pCallback(retValue);
            }
        } else if (OZ.ViewerType == OZ.VIEWER_EXE) {
            ozviewer.CallbackHelper("Document_GetPaperWidth", pCallback);
        } else {
            var retValue = ozviewer.Document_GetPaperWidth();
            if (OZ.IsFunction(pCallback)) {
                pCallback(retValue);
            }
        }
    };
    OZDevTest.Document_GetPaperHeight = function (pCallback) {
        var ozviewer = OZ.GetOZViewer();
        if (OZ.IsTotoFramework()) {
            var retValue = ozviewer.document.getPaperHeight();
            if (OZ.IsFunction(pCallback)) {
                pCallback(retValue);
            }
        } else if (OZ.ViewerType == OZ.VIEWER_EXE) {
            ozviewer.CallbackHelper("Document_GetPaperHeight", pCallback);
        } else {
            var retValue = ozviewer.Document_GetPaperHeight();
            if (OZ.IsFunction(pCallback)) {
                pCallback(retValue);
            }
        }
    };

    OZDevTest.Document_SetChartStyle = function (strValue, pCallback) {
        var ozviewer = OZ.GetOZViewer();
        if (OZ.IsTotoFramework()) {
            var retValue = ozviewer.document.setChartStyle(strValue);
            if (OZ.IsFunction(pCallback)) {
                pCallback(retValue);
            }
        } else if (OZ.ViewerType == OZ.VIEWER_EXE) {
            ozviewer.CallbackHelper("Document_SetChartStyle", strValue, pCallback);
        } else {
            var retValue = ozviewer.Document_SetChartStyle(strValue);
            if (OZ.IsFunction(pCallback)) {
                pCallback(retValue);
            }
        }
    };


    OZDevTest.Document_TriggerExternalEvent = function (param1, param2, param3, param4, pCallback) {
        var ozviewer = OZ.GetOZViewer();
        var refArgs = Array.prototype.slice.call(arguments);
        if (OZ.ViewerType == OZ.VIEWER_EXE) {
            refArgs.splice(0, 0, "Document_TriggerExternalEvent");
            ozviewer.CallbackHelper.apply(null, refArgs);
        } else {
            var retObj = OZ.GetOptionalArgsObj(4, arguments);
            var refArgs = retObj.Args;
            var pCallback = retObj.Callback;
            if (OZ.IsTotoFramework()) {
                refArgs.push(pCallback);
                ozviewer.document.triggerExternalEvent.apply(ozviewer.document, refArgs);
            } else {
                var retValue = ozviewer.Document_TriggerExternalEvent(refArgs[0], refArgs[1], refArgs[2], refArgs[3]);
                //var retValue = ozviewer.Document_TriggerExternalEvent.apply(ozviewer, refArgs);
                if (OZ.IsFunction(pCallback)) { // unnecessary
                    pCallback(retValue);
                }
            }
        }
    };

    OZDevTest.Document_TriggerExternalEventByDocIndex = function (docIndex, param1, param2, param3, param4, pCallback) {
        var ozviewer = OZ.GetOZViewer();
        var refArgs = Array.prototype.slice.call(arguments);
        if (OZ.ViewerType == OZ.VIEWER_EXE) {
            refArgs.splice(0, 0, "Document_TriggerExternalEventByDocIndex");
            ozviewer.CallbackHelper.apply(null, refArgs);
        } else {
            var retObj = OZ.GetOptionalArgsObj(5, arguments);
            var refArgs = retObj.Args;
            var pCallback = retObj.Callback;
            if (OZ.IsTotoFramework()) {
                refArgs.push(pCallback);
                ozviewer.document.triggerExternalEventByDocIndex.apply(ozviewer.document, refArgs);
            } else {
                var retValue = ozviewer.Document_TriggerExternalEventByDocIndex(refArgs[0], refArgs[1], refArgs[2], refArgs[3], refArgs[4]);
                //var retValue = ozviewer.Document_TriggerExternalEventByDocIndex.apply(ozviewer, refArgs);
                if (OZ.IsFunction(pCallback)) { // unnecessary
                    pCallback(retValue);
                }
            }
        }
    };

    OZDevTest.Document_TriggerLocationUpdated = function (location, address, pCallback) {
        var ozviewer = OZ.GetOZViewer();
        if (OZ.IsTotoFramework()) {
            ozviewer.document.triggerLocationUpdated(location, address, pCallback);
        } else if (OZ.ViewerType == OZ.VIEWER_EXE) {
            ozviewer.CallbackHelper("Document_TriggerLocationUpdated", location, address, pCallback);
        } else {
            var retValue = ozviewer.Document_TriggerLocationUpdated(location, address);
            if (OZ.IsFunction(pCallback)) {
                pCallback(retValue);
            }
        }
    };
    OZDevTest.Document_TriggerLocationUpdatedByDocIndex = function (docIndex, location, address, pCallback) {
        var ozviewer = OZ.GetOZViewer();
        if (OZ.IsTotoFramework()) {
            ozviewer.document.triggerLocationUpdatedByDocIndex(docIndex, location, address, pCallback);
        } else if (OZ.ViewerType == OZ.VIEWER_EXE) {
            ozviewer.CallbackHelper("Document_TriggerLocationUpdatedByDocIndex", docIndex, location, address, pCallback);
        } else {
            var retValue = ozviewer.Document_TriggerLocationUpdatedByDocIndex(docIndex, location, address);
            if (OZ.IsFunction(pCallback)) {
                pCallback(retValue);
            }
        }
    };

    OZDevTest.SetOptions = function (arrObj) {
        var ozviewer = OZ.GetOZViewer();
        if (arrObj != null && arrObj !== undefined) {
            ozviewer.SetOptions(arrObj);
        }
    };


    OZDevTest.ExtendsViewerCommand = function (extEventObjList) {
        if (OZ.ViewerType == OZ.VIEWER_EXE) {
            var viewerFrame = document.getElementById("ozviewer_frame");
            var viewerFrameWnd = viewerFrame.contentWindow;
            for (var strArg in extEventObjList) {
                var pCallback = extEventObjList[strArg];
                if (strArg == "OZUserEvent") {
                    strArg = "UserEvent";
                }
                viewerFrameWnd.OZUtil.addEventListener(strArg, pCallback, "ozviewer");
            }

        } else if (OZ.IsTotoFramework()) {    // TotoFramework
            for (var strArg in extEventObjList) {
                var resolveFunc = null;
                var pCallback = extEventObjList[strArg];
                switch (strArg) {
                    case "OZBankBookPrintCommand": {
                        resolveFunc = OZ.Bind(null, function (event, _pCallback) {
                            _pCallback(event.datas);
                        }, pCallback);
                    } break;
                    case "OZCommand": {
                        resolveFunc = OZ.Bind(null, function (event, _pCallback) {
                            _pCallback(event.code, event.args);
                        }, pCallback);
                    } break;
                    case "OZEFormInputEventCommand": {
                        resolveFunc = OZ.Bind(null, function (event, _pCallback) {
                            _pCallback(event.docindex, event.formid, event.eventname, event.mainscreen);
                        }, pCallback);
                    } break;
                    case "OZErrorCommand": {
                        resolveFunc = OZ.Bind(null, function (event, _pCallback) {
                            _pCallback(event.code, event.message, event.detailmessage, event.reportname);
                        }, pCallback);
                    } break;
                    case "OZExitCommand": {
                        resolveFunc = OZ.Bind(null, function (event, _pCallback) {
                            _pCallback();
                        }, pCallback);
                    } break;
                    case "OZExportCommand": {
                        resolveFunc = OZ.Bind(null, function (event, _pCallback) {
                            _pCallback(event.code, event.path, event.filename, event.pagecount, event.filepaths);
                        }, pCallback);
                    } break;
                    case "OZExportMemoryStreamCallBack": {
                        resolveFunc = OZ.Bind(null, function (event, _pCallback) {
                            _pCallback(event.outputdata);
                        }, pCallback);
                    } break;
                    case "OZLinkCommand": {
                        resolveFunc = OZ.Bind(null, function (event, _pCallback) {
                            _pCallback(event.docindex, event.componentname, event.usertag, event.uservalue, event.mousebutton);
                        }, pCallback);
                    } break;
                    case "OZMailCommand": {
                        resolveFunc = OZ.Bind(null, function (event, _pCallback) {
                            _pCallback(event.code);
                        }, pCallback);
                    } break;
                    case "OZPageBindCommand": {
                        resolveFunc = OZ.Bind(null, function (event, _pCallback) {
                            _pCallback(event.docindex, event.pagecount);
                        }, pCallback);
                    } break;
                    case "OZPageChangeCommand": {
                        resolveFunc = OZ.Bind(null, function (event, _pCallback) {
                            _pCallback(event.docindex);
                        }, pCallback);
                    } break;
                    case "OZPostCommand": {
                        resolveFunc = OZ.Bind(null, function (event, _pCallback) {
                            _pCallback(event.cmd, event.msg);
                        }, pCallback);
                    } break;
                    case "OZPrintCommand": {
                        resolveFunc = OZ.Bind(null, function (event, _pCallback) {
                            _pCallback(event.msg, event.code, event.reportname, event.printername, event.printcopy, event.printedpage, event.printrange, event.username, event.drivername, event.printpagesrange);
                        }, pCallback);
                    } break;
                    case "OZProgressCommand": {
                        resolveFunc = OZ.Bind(null, function (event, _pCallback) {
                            _pCallback(event.step, event.state, event.reportname);
                        }, pCallback);
                    } break;
                    case "OZReportChangeCommand": {
                        resolveFunc = OZ.Bind(null, function (event, _pCallback) {
                            _pCallback(event.docindex);
                        }, pCallback);
                    } break;

                    case "OZUserActionCommand": {
                        resolveFunc = OZ.Bind(null, function (event, _pCallback) {
                            _pCallback(event.actiontype, event.attr);
                        }, pCallback);
                    } break;
                    case "OZUserEvent": {
                        resolveFunc = OZ.Bind(null, function (event, _pCallback) {
                            _pCallback(event.param1, event.param2, event.param3, event.docindex);
                        }, pCallback);
                    } break;

                    // # only Toto
                    case "OZTotoFramework.ozviewer.close": {
                        resolveFunc = OZ.Bind(null, function (event, _pCallback) {
                            _pCallback(event.docindex);
                        }, pCallback);
                    } break;
                    case "OZWillChangeIndex_Paging": {
                        resolveFunc = OZ.Bind(null, function (event, _pCallback) {
                            _pCallback(event.newindex, event.oldindex);
                        }, pCallback);
                    } break;
                    case "OZEFormCustomEvent": {
                        resolveFunc = OZ.Bind(null, function (event, _pCallback) {
                            // _pCallback(event.action, event.componenttype, ...);
                            _pCallback(event);
                        }, pCallback);
                    } break;
                    case "OZCloseCommand": {
                        resolveFunc = OZ.Bind(null, function (event, _pCallback) {
                            _pCallback(event);
                        }, pCallback);
                    } break;

                }
                parent.ozviewer.addEventListener(strArg, resolveFunc);
            }
        }
    };

    OZDevTest.OptInstance = {};
    //OZDevTest.GetOptInstance = function () {
    //    var optObj = new Object();
    //    console.log(optObj instanceof Object + " / " + optObj instanceof Array);
    //    return optObj;
    //};

    OZDevTest.SetCustomParameters = function (strValue) {
        var externalFrame = OZ.GetExternalFrame();
        if (externalFrame) {
            externalFrame.SetCustomParameters(strValue);
        }
    };
    OZDevTest.GetTestPageVersion = function () {
        var externalFrame = OZ.GetExternalFrame();
        if (externalFrame) {
            return externalFrame.GetTestPageVersion();
        }
        return "";
    };
    OZDevTest.GetServerPath = function () {
        var externalFrame = OZ.GetExternalFrame();
        if (externalFrame) {
            return externalFrame.GetServerPath();
        }
        return "";
    };
    OZDevTest.GetOZServerPath = function () {
        var externalFrame = OZ.GetExternalFrame();
        if (externalFrame) {
            return externalFrame.GetOZServerPath() + "/oz/server";
        }
        return "";
    };

    return OZDevTest;
})();

//SetExternalObjArray("Test Btn 01 !", Test_Btn_01);
//SetExternalObjArray = function(String strText, Function func, (optional) String strID, (optional) String strType) { ... };
window.SetExternalObjArray = function (strText, pOnClickFunc, strID, strType) {
    OZDevTest.SetExternalObjArray.apply(this, arguments);
};
//SetExternalViewerEvent = function(String strText, Function func) { ... };
window.SetExternalViewerEvent = function (strEventName, pFunc) {
    OZDevTest.SetExternalViewerEvent.apply(this, arguments);
};





