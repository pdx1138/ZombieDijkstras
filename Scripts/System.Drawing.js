////////////////////////////////////////////////////////
// System.Drawing.js

var _pixel_width = 1;
var _pixel_height = 1;

function _SetColor(color) {

    draw.fillStyle = color;

}

function _SetAlpha(alpha) {
	if(alpha > 1.0) alpha = 1.0;
	if(alpha < 0.0) alpha = 0.0;
    draw.globalAlpha = alpha;
}

function _GetAlpha() {

    return draw.globalAlpha;

}

function _CreateColor(r, g, b) {

    if (r < 0) r = 0;
    if (r > 255) r = 255;
    if (g < 0) g = 0;
    if (g > 255) g = 255;
    if (b < 0) b = 0;
    if (b > 255) b = 255;

    return "rgb(" + r + "," + g + "," + b + ")";

}

function _SetPixelSize(w, h) {
    
    _pixel_width = w;
    _pixel_height = h;

}

function _PutPixel(x, y) {

    draw.fillRect(_pixel_width*x, _pixel_height*y, _pixel_width, _pixel_height);

}

function PixelRGBA() {
    this.r = 0.0;
    this.g = 0.0;
    this.b = 0.0;
    this.a = 0.0;
}

function _GetPixel(x, y) {
    var color = new PixelRGBA();
    var imgd = draw.getImageData(x, y, 1, 1);
    var pix = imgd.data;
    color.r = pix[0];
    color.g = pix[1];
    color.b = pix[2];
    color.a = pix[3];
    return color;
}

function _DrawRectangle(x1, y1, w, h) {
	
	draw.fillRect(x1, y1, w, h);

}

function _FillScreen() {

    draw.fillRect(0, 0, canvas.width, canvas.height);

}

function _EraseRectangle(x1, y1, w, h) {
    draw.clearRect(x1, y1, w, h);
}

function _ClearScreen() {

    draw.clearRect(0, 0, canvas.width, canvas.height);

}

function _DrawText(text, x, y) {

    draw.fillText(text, x, y);

}

function _DrawHollowBox(x1, y1, x2, y2) {
    for (var x = x1; x <= x2; x++) {
        _PutPixel(x, y1);
        _PutPixel(x, y2);
    }
    for (var y = y1; y <= y2; y++) {
        _PutPixel(x1, y);
        _PutPixel(x2, y);
    }
}

function _DrawSolidBox(x1, y1, x2, y2) {
    draw.fillRect(x1, y1, x2 - x1, y2 - y1);
    //for (var x = x1; x <= x2; x++) {
    //    for (var y = y1; y <= y2; y++) {
    //        _PutPixel(x, y);
    //    }
    //}
}