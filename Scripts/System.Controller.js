// System.Controller.js
///////////////////////////////////////////////////////////////////////////////////

var _ANY_KEYPRESSED = false;
var _MOUSE_LEFTBUTTONDOWN = false;
var _MOUSE_LEFTBUTTON_HELDDOWN = false;
var _MOUSE_X = 0;
var _MOUSE_Y = 0;

function _IsMouseInRectangle(x1, y1, x2, y2) {
    return _IsPointInRectangle(_MOUSE_X, _MOUSE_Y, x1, y1, x2, y2);
}

function _IsPointInRectangle(x, y, x1, y1, x2, y2) {
    if (x > x1 && y > y1) {
        if (x < x2 && y < y2) {
            return true;
        }
    }
    return false;
}

function _IsAnyKeyPressed() {
	if(_ANY_KEYPRESSED) {
		_ANY_KEYPRESSED = false;
		return true;
	}
	return false;
}

function _IsKeyboardSpaceClickedDown() {
	if(_KEYBOARD_SPACE && _KEYBOARD_SPACE_HELDDOWN == false) {
		_KEYBOARD_SPACE_HELDDOWN = true;
		return true;
	}
	return false;
}

function _IsMouseLeftClickedDown() {
	if(_MOUSE_LEFTBUTTONDOWN && _MOUSE_LEFTBUTTON_HELDDOWN == false) {
		_MOUSE_LEFTBUTTON_HELDDOWN = true;
		return true;
	}
}

var _KEYBOARD_LEFTARROW = false;
var _KEYBOARD_UPARROW = false;
var _KEYBOARD_RIGHTARROW = false;
var _KEYBOARD_DOWNARROW = false;

var _KEYBOARD_SPACE = false;
var _KEYBOARD_SPACE_HELDDOWN = false;

var _VK_SPACE = 32;
var _VK_LEFTARROW = 37;
var _VK_UPARROW = 38;
var _VK_RIGHTARROW = 39;
var _VK_DOWNARROW = 40;

function _GetMousePosInObject(obj, e) {
    var top = 0;
    var left = 0;
    while (obj && obj.tagName != 'BODY') {
        top += obj.offsetTop;
        left += obj.offsetLeft;
        obj = obj.offsetParent;
    }

    var mouseX = e.clientX - left + window.pageXOffset;
    var mouseY = e.clientY - top + window.pageYOffset;
    return {
        x: mouseX,
        y: mouseY
    };
}

function _UpdateMousePos(e) {
    var pos = _GetMousePosInObject(canvas, e);
    _MOUSE_X = Math.floor(pos.x / _pixel_width);
    _MOUSE_Y = Math.floor(pos.y / _pixel_height);
}

var _mouse_cursor = null;
var _set_cursor = false;
var _target = null;
function _SetMouseCursor(fullName) {
    // Example: "Images/SwordCursor.cur";
    if (_set_cursor == false && _mouse_cursor == fullName) return;
    _mouse_cursor = fullName;
    _set_cursor = true;
    if (fullName != "default") {
        fullName = "url(" + fullName + "),auto";
    }
	if (_target != null) {
		_target.style.cursor = fullName;
	}
}

function _OnMouseMove(e) {
	_target = e.target;
	if(_set_cursor == true) {
	    _SetMouseCursor(_mouse_cursor);
	    _set_cursor = false;
	}
    _UpdateMousePos(e);
}

function _OnMouseDown(e) {
    _UpdateMousePos(e);
    _MOUSE_LEFTBUTTONDOWN = true;
    _ANY_KEYPRESSED = true;
}

function _OnMouseUp(e) {
    _UpdateMousePos(e);
    _MOUSE_LEFTBUTTONDOWN = false;
    _MOUSE_LEFTBUTTON_HELDDOWN = false;
}

function _OnKeyDown(e) {
    _ANY_KEYPRESSED = true;
    switch (e.keyCode) {
	    case _VK_SPACE:
	    	_KEYBOARD_SPACE = true;
	    	break;
	    case _VK_LEFTARROW:
	        _KEYBOARD_LEFTARROW = true;
	        break;
        case _VK_UPARROW:
            _KEYBOARD_UPARROW = true;
            break;
        case _VK_RIGHTARROW:
            _KEYBOARD_RIGHTARROW = true;
            break;
        case _VK_DOWNARROW:
            _KEYBOARD_DOWNARROW = true;
            break;
    }
}

function _OnKeyUp(e) {
    switch (e.keyCode) {
	    case _VK_SPACE:
	    	_KEYBOARD_SPACE = false;
	    	_KEYBOARD_SPACE_HELDDOWN = false;
	    	break;
        case _VK_LEFTARROW:
            _KEYBOARD_LEFTARROW = false;
            break;
        case _VK_UPARROW:
            _KEYBOARD_UPARROW = false;
            break;
        case _VK_RIGHTARROW:
            _KEYBOARD_RIGHTARROW = false;
            break;
        case _VK_DOWNARROW:
            _KEYBOARD_DOWNARROW = false;
            break;
    }
}
