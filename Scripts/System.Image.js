// System.Image.js
/////////////////////////////////////////////////////////////////////////////////

var _images = [];
function _LoadImage(name) {
	var img = _images[name];
	if(img==null || img==undefined) {
	    img = new Image();
	    img.loaded = false;
    	_images[name] = img;
	    img.onload = function()
	    {
	    	img.loaded = true;
	    };
	    img.src = name;
	    return false;
    }
    return img.loaded;
}

function _DrawImageCentered(name, xoffset, yoffset) {
    if (xoffset == undefined) xoffset = 0;
    if (yoffset == undefined) yoffset = 0;
    _LoadImage(name);
    var img = _images[name];
    if (img == null || img == undefined) return;
    if (img.loaded) {
        var x = (canvas.width / 2) - (img.width / 2) + xoffset;
        var y = (canvas.height / 2) - (img.height / 2) + yoffset;
        _DrawImage(name, x, y, img.width, img.height);
    }
}

function _DrawImageAlpha(alpha, name, x, y, w, h) {
    _LoadImage(name);
    var img = _images[name];
    if (img == null || img == undefined) return;
    if (img.loaded) {
        if (w == undefined) w = img.width;
        if (h == undefined) h = img.height;
        var old_alpha = _GetAlpha();
        _SetAlpha(alpha);
        draw.drawImage(img, x, y, w, h);
        _SetAlpha(old_alpha);
        return true;
    };
    return false;
}

function _DrawImage(name, x, y, w, h) {
    _LoadImage(name);
    var img = _images[name];
    if (img == null || img == undefined) return;
    if (img.loaded) {
        if (w == undefined) w = img.width;
        if (h == undefined) h = img.height;
        draw.drawImage(img, x, y, w, h);
        return true;
    };
    return false;
}

function _DrawImageRotatedAlpha(a, r, name, x, y, w, h) {
    // Load image and retrieve dimensions
    _LoadImage(name);
    var img = _images[name];
    if (img == null || img == undefined) return;
    if (img.loaded) {
        if (w == undefined) w = img.width;
        if (h == undefined) h = img.height;
    }
    // Convert degrees to radians
    r = r * 2 * 3.14159265358 / 360;
    // Draw image rotated
    draw.save();
    draw.translate(x + w/2, y + h/2);
    draw.rotate(r);
    _DrawImageAlpha(a, name, -w/2, -h/2, w, h);
    draw.restore();
}

function _DrawImageRotated(r, name, x, y, w, h) {
    _DrawImageRotatedAlpha(1.0, r, name, x, y, w, h);
}

function _CalculateAngleFromPoint(x2, y2, name1, x1, y1, flipVertical) {
    if (flipVertical == undefined) flipVertical = false;
    return _CalculateAngle(name1, x1, y1, name1, x2, y2, flipVertical, 1, 1);
}

//////////////////////////////////////////////////////////////////////
// _CalculateAngle : Give it two images and locations, it will
// return the angle that can be used to draw the first image so
// that the character faces the direction of the second character.
// (ASSUMES THAT THE IMAGE OF THE FIRST CHARACTER IS FACING NORTH).
function _CalculateAngle(name1, x1, y1, name2, x2, y2, flipVertical, w2, h2) {
    // Load image and retrieve dimensions
    _LoadImage(name1);
    var img1 = _images[name1];
    var w1, h1;
    if (img1 == null || img1 == undefined) return;
    if (img1.loaded) {
        w1 = img1.width;
        h1 = img1.height;
    }
    if (w2 == undefined || h2 == undefined) {
        _LoadImage(name2);
        var img2 = _images[name2];
        if (img2 == null || img2 == undefined) return;
        var w2, h2;
        if (img2.loaded) {
            w2 = img2.width;
            h2 = img2.height;
        }
    }
    // Figure out center positions
    var x1c = x1 + w1 / 2;
    var y1c = y1 + h1 / 2;
    var x2c = x2 + w2 / 2;
    var y2c = y2 + h2 / 2;
    // Figure out vector from source to target
    var xv = x2c - x1c;
    var yv = y2c - y1c;
    // Normalize vector
    var len = Math.sqrt(xv * xv + yv * yv);
    xv = xv / len;
    yv = yv / len;
    // Find dot product of vector with non-rotated normal
    var wxv = 0;
    var wyv = -1;
    if (flipVertical == true) wyv = 1;
    var dot = xv * wxv + yv * wyv;
    // Take inverse cosine to determine angle
    var angle = Math.acos(dot);
    // Convert angle to degrees
    angle = angle * 360 / (2 * 3.14159265358);
    // Flip angle depending on x location
    if (flipVertical && (x1 < x2)) {
        angle = 360 - angle;
    }
    if (!flipVertical && !(x1 < x2)) {
        angle = 360 - angle;
    }
    return angle;
}

//////////////////////////////////////////////////////////////////
// _CalculatePoint : Give it a rotation, an image location, and
// an offset location (e.g. the location of the tip of a spaceship
// turret within an image) and it will perform the rotation and
// tell you the point on the screen where the rotated position
// will appear.
function Point2D(x, y, xv, yv) { this.x = x; this.y = y; this.xv = xv; this.yv = yv; }
function _CalculatePoint(r, name, x, y, name2, xoffset, yoffset) {
    if (xoffset == undefined) xoffset = 0;
    if (yoffset == undefined) yoffset = 0;
    // Load image and retrieve dimensions
    _LoadImage(name);
    var img = _images[name];
    var w, h;
    if (img == null || img == undefined) return;
    if (img.loaded) {
        w = img.width;
        h = img.height;
    }
    // A second image can be specified such that we want to position
    // this image at a rotated point relative to the first image
    var w2, h2;
    if (name2 == undefined) {
        w2 = 0;
        h2 = 0;
    } else {
        _LoadImage(name2);
        var img2 = _images[name2];
        if (img2 == null || img2 == undefined) return;
        if (img2.loaded) {
            w2 = img2.width;
            h2 = img2.height;
        }
    }
    // Identify the position of the point in space
    var xp = x + xoffset;
    var yp = y + yoffset;
    // Identify center position of image
    var xc = x + w / 2;
    var yc = y + h / 2;
    // Transform point to origin
    xp = xp - xc;
    yp = yp - yc;
    // Convert angle to radians
    r = r * 2 * 3.14159265358 / 360;
    // Rotate point by angle
    var rx = xp * Math.cos(r) - yp * Math.sin(r);
    var ry = yp * Math.cos(r) + xp * Math.sin(r);
    // Transform point back to image space
    rx = rx + xc;
    ry = ry + yc;
    // Adjust for size of secondary image
    rx = rx - w2 / 2;
    ry = ry - h2 / 2;
    // Calculate orientation vectors
    var fx = rx - xc;
    var fy = ry - yc;
    var len = Math.sqrt(fx * fx + fy * fy);
    fx = fx / len;
    fy = fy / len;
    // Return point & vector
    return new Point2D(rx, ry, fx, fy);
}


function _DrawCanvas(canvas, x, y) {
    if (x == undefined || y == undefined) return;
    if (x == null || y == null) return;
    draw.drawImage(canvas, x, y);
}

function _PutImageData(imgData, x, y) {
    if (x == undefined || y == undefined) return;
    if (x == null || y == null) return;
    draw.putImageData(imgData, x, y);
}

function _PutImageDataToCanvas(canvas, imgData, x, y) {
    if (x == undefined || y == undefined) return;
    if (x == null || y == null) return;
    canvas.getContext("2d").putImageData(imgData, x, y);
}

var _spriteSheet = [];
function _LoadSpriteSheet(name, rColorKey, gColorKey, bColorKey, w, h, cell_width, cell_height) {
	var spriteSheet = _spriteSheet[name];
	if(spriteSheet==null || spriteSheet==undefined) {
		if (_LoadImage(name)) {
		    // Fill the background to the color key
		    _SetColor(_CreateColor(rColorKey, gColorKey, bColorKey));
		    _FillScreen();
		    // Load all the cells out of the sprite sheet
			// [1] Draw the sprite sheet to the canvas
			if(_DrawImage(name, 0, 0, w, h)) {
			    // [2] Create image cells
				var imgCells = [];
				for(var column = 0; column < (w/cell_width); column++) {
					imgCells[column] = [];
					for(var row = 0; row < (h/cell_height); row++) {
						var x = column * cell_width;
						var y = row * (cell_height+1);
						var imgDest = draw.createImageData(cell_width, cell_height);
						var imgCell = draw.getImageData(x, y, cell_width, cell_height);
						_BlendImageData(imgDest, imgCell, cell_width, cell_height);
						var pixels = imgDest.data;
						//var pixels = imgCell.data;
                        // Apply the color key (full transparency)
						for (var n = 0; n < cell_width * cell_height; n++) {
						    if (pixels[(n * 4)] == rColorKey) {
						        if (pixels[(n * 4) + 1] == gColorKey) {
						            if (pixels[(n * 4) + 2] == bColorKey) {
						                pixels[(n * 4) + 3] = 0;
						            }
						        }
						    }
						}
						// Save the image cell into the sprite sheet
						var buffer = document.createElement('canvas');
						buffer.width = cell_width;
						buffer.height = cell_height;
						_PutImageDataToCanvas(buffer, imgDest, 0, 0);
						imgCells[column][row] = buffer;
						//imgCells[column][row] = imgDest;
						//imgCells[column][row] = imgCell;
					}
				}
				// [3] Put the image cells into the sprite sheet array
                _spriteSheet[name] = imgCells;
			}
            // [4] Clear the canvas removing the sprite sheet from display
            _ClearScreen();
        }
	}
	return _spriteSheet[name];
}

var OPTION_NONE = 0;
var OPTION_FLIPX = 1;

function _BlendImageData(dest, src, w, h, option) {
	if(option == undefined) option = OPTION_NONE;
    var pDest = dest.data;
    var pSrc = src.data;
    var num_items = 4 * w * h;
    for (var x = 0; x < w; x++) {
    	for(var y = 0; y < h; y++) {
    		var nSrc = y * w * 4 + x * 4;
    		var nDest = nSrc;
    		
    		if(option == OPTION_FLIPX) {
    			nDest = y * w * 4 + (w - x) * 4;
    		}
    		
            var src_red = pSrc[nSrc + 0];
            var src_green = pSrc[nSrc + 1];
            var src_blue = pSrc[nSrc + 2];
            var src_alpha = pSrc[nSrc + 3];
            var pct = src_alpha / 255.0;
            var dest_red = pDest[nDest + 0];
            var dest_green = pDest[nDest + 1];
            var dest_blue = pDest[nDest + 2];
            var dest_alpha = pDest[nDest + 3];

            pDest[nDest + 0] = dest_red + pct * (src_red - dest_red);
            pDest[nDest + 1] = dest_green + pct * (src_green - dest_green);
            pDest[nDest + 2] = dest_blue + pct * (src_blue - dest_blue);
            pDest[nDest + 3] = 255;
    	}
    }
}

function _DrawImageCell(name, x, y, row, col, image_width, image_height, cell_width, cell_height, option) {
    if (option == undefined) option = OPTION_NONE;
	x = Math.floor(x);
	y = Math.floor(y);
	var spriteSheet = _LoadSpriteSheet(name, 0, 0, 0, image_width, image_height, cell_width, cell_height);
	if (spriteSheet != null && spriteSheet != undefined) {

	    //var dest = draw.getImageData(x, y, cell_width, cell_height);
	    var src = spriteSheet[col][row];

	    //_BlendImageData(dest, src, cell_width, cell_height, option);
	    //_PutImageData(dest, x, y);
	    _DrawCanvas(src, x, y);
	    return true;
	}
	return false;
}
