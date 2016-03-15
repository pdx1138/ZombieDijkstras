// System.World.js
/////////////////////////////////////////////////////////////////////////////////

var _BLOCK_WIDTH = 64;
var _BLOCK_HEIGHT = 64;
var _WORLD_HEIGHT = 32*_BLOCK_HEIGHT;
var _WORLD_WIDTH = 250*_BLOCK_WIDTH;
var _WORLD_BLOCK_HEIGHT = (_WORLD_HEIGHT/_BLOCK_HEIGHT);
var _WORLD_BLOCK_WIDTH = (_WORLD_WIDTH/_BLOCK_WIDTH);
var _VIEW_HEIGHT = 532;
var _VIEW_WIDTH = 728;
var _VIEW_X = 10;
var _VIEW_Y = _WORLD_HEIGHT - _VIEW_HEIGHT;

function _GetScreenX(wx) {
	return wx - _VIEW_X;
}

function _GetScreenY(wy) {
	return wy - _VIEW_Y;
}

function _IsItMax(x, min, max) {
	var z = (x - min) / (max - min);
	if(z < 0.0) return 0.0;
	if(z > 1.0) return 1.0;
	return z;
}

function _IsItMin(x, min, max) {
	return 1.0 - _IsItMax(x, min, max);
}

function _DrawWorldImage(name, x, y, w, h, paralax_factor) {
	if(paralax_factor == undefined) paralax_factor = 1.0;
	x = _GetScreenX(x);
	y = _GetScreenY(y);
	x *= paralax_factor;
	y *= paralax_factor;
	// If it's off the screen, don't draw it ////////////////
	if(x+w < 0) return;
	if(y+h < 0) return;
	if(x > _VIEW_WIDTH) return;
	if(y > _VIEW_HEIGHT) return;
	/////////////////////////////////////////////////////////
	_DrawImage(name, x, y, w, h);	
}

function _DrawWorldBlock(userData, name, x, y, row, col, image_width, image_height, cell_width, cell_height, option) {
	_DrawWorldCell(userData, name, x*cell_width, y*cell_height, row, col, image_width, image_height, cell_width, cell_height, option);
}

function _DrawWorldCell(brick, name, x, y, row, col, image_width, image_height, cell_width, cell_height, option) {

	if(_bBuildColliders) {
		var bCollideLeft = (option & OPTION_COLLIDE_ALL) | (option & OPTION_COLLIDE_LEFT);
		var bCollideTop = (option & OPTION_COLLIDE_ALL) | (option & OPTION_COLLIDE_TOP);
		var bCollideRight = (option & OPTION_COLLIDE_ALL) | (option & OPTION_COLLIDE_RIGHT);
		var bCollideBottom = (option & OPTION_COLLIDE_ALL) | (option & OPTION_COLLIDE_BOTTOM);
		if(bCollideLeft || bCollideTop || bCollideRight || bCollideBottom) {
			var c = new Collider(brick, x, y, cell_width, cell_height, bCollideLeft, bCollideTop, bCollideRight, bCollideBottom);
			_Colliders.push(c);			
		}
	}
	
	x = _GetScreenX(x);
	y = _GetScreenY(y);
	// If it's off the screen, don't draw it ////////////////
	if(x+cell_width < 0) return;
	if(x > _VIEW_WIDTH) return;
	if(y+cell_height < 0) return;
	if(y > _VIEW_HEIGHT) return;
	/////////////////////////////////////////////////////////
	if(option == undefined) option = OPTION_NONE;
	_DrawImageCell(name, x, y, row, col, image_width, image_height, cell_width, cell_height, option);
}

function _UpdateViewPosition(x, y) {
	x = _GetScreenX(x);
	y = _GetScreenY(y);
	
    // HORIZONTAL /////////////////////////////////
    var min = _VIEW_WIDTH - (_VIEW_WIDTH/2);
    var max = _VIEW_WIDTH;
    if(x > min) {
    	var z = _IsItMax(x, min, max);
    	_VIEW_X = _VIEW_X + (z/5) * (max - min);
    }
    
    var min = 0;
    var max = _VIEW_WIDTH/2;
    if(x < max) {
    	var z = _IsItMin(x, min, max);
    	_VIEW_X = _VIEW_X - (z/5) * (max - min);
    }
    // VERTICAL /////////////////////////////////
    min = _VIEW_HEIGHT - (_VIEW_HEIGHT/1.5);
    max = _VIEW_HEIGHT;
    if(y > min) {
    	var z = _IsItMax(y, min, max);
    	_VIEW_Y = _VIEW_Y + (z) * (max - min);
    }
    
    var min = 0;
    var max = _VIEW_HEIGHT/5;
    if(y < max) {
    	var z = _IsItMin(y, min, max);
    	_VIEW_Y = _VIEW_Y - (z) * (max - min);
    }
    
    // ENFORCEMENT //////////////////////////////
    // Don't scroll past minimum or maximum
    if(_VIEW_X < 0) _VIEW_X = 0;
    if(_VIEW_X > _WORLD_WIDTH-_VIEW_WIDTH) _VIEW_X = _WORLD_WIDTH-_VIEW_WIDTH;
    if(_VIEW_Y < 0) _VIEW_Y = 0;
    if(_VIEW_Y > _WORLD_HEIGHT-_VIEW_HEIGHT) _VIEW_Y = _WORLD_HEIGHT-_VIEW_HEIGHT;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var _bBuildColliders = false;

function Collider(brick, x, y, w, h, bl, bt, br, bb) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.canCollideLeft = bl;
	this.canCollideTop = bt;
	this.canCollideRight = br;
	this.canCollideBottom = bb;
	this.brick = brick;
}

var _Colliders = [];

var OPTION_COLLIDE_ALL = 8;
var OPTION_COLLIDE_TOP = 16;
var OPTION_COLLIDE_BOTTOM = 32;
var OPTION_COLLIDE_LEFT = 64;
var OPTION_COLLIDE_RIGHT = 128;

function _BeginDrawColliderCells() {
    if (_Colliders == null) {
        _Colliders = [];
        _bBuildColliders = true;
    }
}

function _EndDrawColliderCells() {
	_bBuildColliders = false;
}

function _ClearAllColliders() {
	_bBuildColliders = false;
	_Colliders = null;
}

function _ClearCollider(collider) {
	for(var n = 0; n < _Colliders.length; n++) {
		if(collider == _Colliders[n]) {
			_Colliders.splice(n, 1);
		}
	}
}

var _bCollisionOccurredX = false;
function _CollisionOccurredX() {
	return _bCollisionOccurredX;
}

var _bCollisionOccurredY = false;
function _CollisionOccurredY() {
	return _bCollisionOccurredY;
}

var _TruncatedMotionVectorX = 0.0;
function _GetTruncatedMotionVectorX() {
	return _TruncatedMotionVectorX;
}

var _TruncatedMotionVectorY = 0.0;
function _GetTruncatedMotionVectorY() {
	return _TruncatedMotionVectorY;
}

var COLLIDE_LEFT = 1;
var COLLIDE_TOP = 2;
var COLLIDE_RIGHT = 3;
var COLLIDE_BOTTOM = 4;

function _OnCollideNone(brick, collideInfo) {
	// Does nothing
}

function _IsPtInRect(x, y, left, top, width, height) {
	return x >= left && y >= top && x <= (left+width) && y <= (top+height);
}

function _IsRectCollide(x1, y1, w1, h1, x2, y2, w2, h2) {
	// Is any point of rect 1 inside rect 2 ?
	if(_IsPtInRect(x1,    y1,    x2, y2, w2, h2)) return true;
	if(_IsPtInRect(x1+w1, y1,    x2, y2, w2, h2)) return true;
	if(_IsPtInRect(x1+w1, y1+h1, x2, y2, w2, h2)) return true;
	if(_IsPtInRect(x1,    y1+h1, x2, y2, w2, h2)) return true;

	// Is any point of rect 2 inside rect 1 ?
	if(_IsPtInRect(x2,    y2,    x1, y1, w1, h1)) return true;
	if(_IsPtInRect(x2+w2, y2,    x1, y1, w1, h1)) return true;
	if(_IsPtInRect(x2+w2, y2+h2, x1, y1, w1, h1)) return true;
	if(_IsPtInRect(x2,    y2+h2, x1, y1, w1, h1)) return true;
	return false;
}

// _CollideMotionVector : Takes the vector to consider for this frame (e.g. not in units of
// pixels per second, but in units of pixels per frame... and returns whether collision occurs)
function _CollideMotionVector(x, y, w, h, vx, vy, callback) {
	if(callback == undefined) callback = _OnCollideNone;
	_bCollisionOccurredX = false;
	_bCollisionOccurredY = false;
	for(var n = 0; n < _Colliders.length; n++) {
		var c = _Colliders[n];
		
		var left = c.x - w;
		var top = c.y - h;
		var right = c.x + c.w;
		var bottom = c.y + c.h;

		// Test the Y collision first...

		var xd = x + vx;
		var yd = y + vy;
		
		// if they are not collided already but will be... vertically
		if(y <= top || y >= bottom) {
			if(yd > top && yd < bottom) {
				// Strictly colliding vertically...
				if(x > left && x < right) {
					// from the top?
					if(c.canCollideTop && vy > 0) {
						vy = top - y;
						_bCollisionOccurredY = true;
						_TruncatedMotionVectorY = vy;
						callback(c, COLLIDE_TOP);
					}
					// from the bottom?
					if(c.canCollideBottom && vy < 0) {
						vy = bottom - y;
						_bCollisionOccurredY = true;
						_TruncatedMotionVectorY = vy;					
						callback(c, COLLIDE_BOTTOM);
					}
				}
			}
		}

		// if they are not collided already but will be... horizontally
		if(x <= left || x >= right) {
			// Strictly colliding horizontally...
			if(y > top && y < bottom) {
				if(xd > left && xd < right) {
					// from the left?
					if(c.canCollideLeft && vx > 0) {
						vx = left - x;
						_bCollisionOccurredX = true;
						_TruncatedMotionVectorX = vx;					
						callback(c, COLLIDE_LEFT);
					}
					// from the right?
					if(c.canCollideRight && vx < 0) {
						vx = right - x;
						_bCollisionOccurredX = true;
						_TruncatedMotionVectorX = vx;
						callback(c, COLLIDE_RIGHT);
					}
				}
			}
		}

	}
}

function Brick(x, y, c1, c2, c3) {
	this.x = x;
	this.y = y;
	this.c1 = c1;
	this.c2 = c2;
	this.c3 = c3;
	// Marked for garbage collection
	this.garbage = false;
}

var _Bricks = [];

function _DrawWorld(callback) {
	for(var n = 0; n < _Bricks.length; n++) {
		callback(_Bricks[n]);
	}
	_CollectGarbageBricks();
}

function _ClearWorld() {
	_Bricks = [];
	_ClearAllColliders();
	_IsWorldLoaded = false;
	_VIEW_X = 10;
	_VIEW_Y = _WORLD_HEIGHT - _VIEW_HEIGHT;
}

function _ClearBlock(brick) {
	brick.garbage = true;
}

function _CollectGarbageBricks() {
	// Bricks need to be garbage collected, because
	// deleting them while some code is going through
	// the array can cause it to skip indices (e.g.
	// not draw or process the wrong brick)...
	for(var n = 0; n < _Bricks.length; n++) {
		var brick = _Bricks[n];
		if(brick.garbage == true) {
			_Bricks.splice(n, 1);
		}
	}	
}

function _CreateBlock(x, y, c1, c2, c3) {
	var brick = new Brick(x, y, c1, c2, c3);
	_Bricks.push(brick);
}

var _IsWorldLoaded = 0;
function _LoadWorld(name, w, h) {
	if(_IsWorldLoaded > 0) return true;
	_LoadImage(name);
	if(_images[name].loaded) {
		_IsWorldLoaded++;
		// NOTE: The world could double load...
		_SetColor(0, 0, 0);
		_DrawRectangle(0, 0, w, h);
		_DrawImage(name, 0, 0, w, h);

		var imgCell = draw.getImageData(0, 0, w, h);
		var pixels = imgCell.data;
                
		for (var x = 0; x < w; x++) {
			for (var y = 0; y < h; y++) {
				var index = y * w * 4 + x * 4;
				var code1 = pixels[index + 0]; // Red channel
				var code2 = pixels[index + 1]; // Green channel
				var code3 = pixels[index + 2]; // Blue channel
				if(code1 != 0 || code2 != 0 || code3 != 0) {
					_CreateBlock(x, y, code1, code2, code3);							
				}
			}
		}
		
		_ClearScreen();
		return true;
	}
	return false;
}