if (window !== top) {
    window.OZ = top.OZ;
    window.OZDevTest = top.OZDevTest;
    top.OZDevTest.OptInstance = {};
    window.OZViewerID = OZ.__ViewerID__;
    window.opt = [];
    window.onload = function (e) {
        setTimeout(function () {
            top.OZDevTest.OnLoadedViewerFrame();
        }, 0);
    };
    window.SetExternalObjArray = top.SetExternalObjArray;
    window.SetExternalViewerEvent = top.SetExternalViewerEvent;
}
