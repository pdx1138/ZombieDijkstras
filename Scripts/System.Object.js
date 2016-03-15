// System.Object.js
////////////////////////////////////////////////////////////////////////////

function _DeleteObject(object) {
    object.DELETE = true;
}

function _DeleteObjects(collection) {
    var len = collection.length;
    for (var n = 0; n < len; n++) {
        var item = collection[n];
        if (item == undefined) continue;
        _DeleteObject(item);
    }
}

function _ClearDeletedObjects(collection) {
    var len = collection.length;
    for (var n = 0; n < len; n++) {
        var item = collection[n];
        if (item == undefined) continue;
        if (item.DELETE == true) {
            collection.splice(n, 1);
        }
    }
}

function _DrawObjects(collection) {
    var len = collection.length;
    for (var n = 0; n < len; n++) {
        var obj = collection[n];
        if (obj != undefined) {
            obj.Draw();
        }
    }
    _ClearDeletedObjects(collection);
}

function _IsObjectHitting(collection, x1, y1, x2, y2, type) {
    var len = collection.length;
    for (var n = 0; n < len; n++) {
        var item = collection[n];
        if (item != undefined) {
            if (type != undefined) {
                if (item.type != type) continue;
            }
            if (_IsPointInRectangle(item.x, item.y, x1, y1, x2, y2)) {
                //_DeleteObject(item);
                return item;
            }
        }
    }
    return null;
}