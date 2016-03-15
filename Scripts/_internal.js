// _internal.js
///////////////////////////////////////////////////////

var draw;
var canvas;

function _DisableDragging(element) {
    element = document.getElementById(element);
    element.draggable = false;
    element.onmousedown = function (event) {
        event.preventDefault();
        return false;
    }
}

function _OnStartup(eventArgs) {
    _DisableDragging("_ImageFrame");
    _DisableDragging("_CanvasDiv");
    _DisableDragging("_ImageDiv");

    canvas = document.getElementById("_CanvasScreen");
    draw = canvas.getContext("2d");
    //_svgTag = eventArgs.target;
    //_svgDocument = _svgTag.ownerDocument;

    _UpdateAnimationTime();

    // Configure user interaction events
    //_svgTag.setAttribute("onmousedown","_OnMouseDown(evt);")

    OnInitialize();

    // Begin the frame handler
    _OnSystemFrame();

}

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          function (callback) {
              window.setTimeout(callback, 1000 / 20);
          };
})();

function _OnSystemFrame() {

    _UpdateAnimationTime();

    requestAnimFrame(_OnSystemFrame);

    OnFrame();
    _RunAnimations(g_CurrentTime);

    //setTimeout("_OnSystemFrame();", 1000 / 30);

}
