// System.Animation.js
/////////////////////////////////////////////////////////////////////////////////

var _Animations = [];
var _NumAnimations = 0;
var g_CurrentTime = 0.0;
var g_ElapsedTime = 0.0;

/////////////////////////////////////////////////////////////////////////////////

var OPTION_LOOP = 1;
var OPTION_DELTA = 2;
var OPTION_OSCILLATE = 4; 

// _AnimDelta : Given a value in units per second... This function
// will compensate for elapsed time between frames.
function _AnimDelta(v) {
	// (When elapsed time is 1.0 second, there is no adjustment,
	// so in essence, elapsed time is its own percentage of seconds).
	return g_ElapsedTime * v;
}

function _CreateAnimationEx(
		animGroup, 		// Animation group
		animObject, 	// Thing to animate
		groupStartTime,	// Group start time (0==now)
		groupEndTime,	// Group end time
		itemStartTime, 	// Item start time (0==now)
		itemEndTime, 	// Item end time
		startValue, 	// Start value
		endValue, 		// End value
		param1, 		// Additional value 1 (depends on update function)
		param2, 		// Additional value 2 (depends on update function)
		UpdateFunction, // Animation update function
		options			// Whether to loop the animation, etc.
) {
	var anim = new _Animation();
	anim.groupName = animGroup;
	anim.groupStartTime = g_CurrentTime + groupStartTime;
	anim.groupEndTime = g_CurrentTime + groupEndTime;
	anim.startTime = g_CurrentTime + itemStartTime;
	anim.endTime = g_CurrentTime + itemEndTime;
	anim.originalValue = startValue;
	anim.currentValue = startValue;
	anim.startValue = startValue;
	anim.endValue = endValue;
	anim.updateFunction = UpdateFunction;
	anim.options = options;

	// User data
	anim.obj = animObject;
	anim.xPos = param1;
	anim.yPos = param2;

	_Animations.push(anim);

	// Run the update function for the starting value
	if (anim.startTime == g_CurrentTime) {
	    anim.updateFunction(anim, anim.startValue, false);
	}
}

function _ClearAnimations() {
    _Animations = [];
}

/////////////////////////////////////////////////////////////////////////////////
function _Animation() {
  this.groupName = "";
  this.originalValue = 0;
  this.currentValue = 0;
  this.startValue = 0;
  this.endValue = 360;
  this.groupStartTime = 0;
  this.groupEndTime = 1;
  this.startTime = 0;
  this.endTime = 1;
  this.updateFunction = _NullUpdate;
  this.options = 0;
  
  // User data
  this.obj = null;
  this.xPos = 0;
  this.yPos = 0;
};

function _NullUpdate(anim, currentValue, isCompleted) {
  // Does not update
}

function _UpdateRotation(anim, currentValue, isCompleted) {
	currentValue = Math.floor( currentValue );
	var T = "rotate(" + currentValue + " " + anim.xPos + " " + anim.yPos + ")";
	anim.obj.setAttribute("transform", T);
	anim.currentValue = currentValue;
}

function _UpdateAlpha(anim, currentValue, isCompleted) {
    _SetAlpha(currentValue);
}


function _ClearAnimation(anim) {
    for (var n = 0; n < _Animations.length; n++) {
        if (_Animations[n] == anim) {
            _Animations.splice(n, 1);
        }
    }
}

function _RunAnimations(currentTime) {
  for(var n = 0; n < _Animations.length; n++) {
    var anim = _Animations[n];
    if (!anim.UpdateValue(currentTime)) {
        // Animation has completed
        _ClearAnimation(anim);
    }
  }
}

_Animation.prototype.UpdateValue = function (currentTime) {
    var bCompleted = false;
    if (currentTime > this.groupEndTime) {
        if (this.options & OPTION_LOOP) {
            var itemStartDelay = this.startTime - this.groupStartTime;
            var groupDuration = (this.groupEndTime - this.groupStartTime);
            var itemDuration = (this.endTime - this.startTime);
            this.groupStartTime = currentTime;
            this.groupEndTime = currentTime + groupDuration;
            this.startTime = this.groupStartTime + itemStartDelay;
            this.endTime = this.startTime + itemDuration;
            this.originalValue = this.currentValue;
        } else {
            bCompleted = true;
        }
    }
    if (currentTime < this.startTime) return true;
    if (currentTime <= this.endTime || bCompleted) {
        var percent = (currentTime - this.startTime) / (this.endTime - this.startTime);
        var currentValue = this.startValue + percent * (this.endValue - this.startValue);
        if (this.options & OPTION_DELTA) {
            currentValue = this.originalValue + currentValue;
        }
        this.updateFunction(this, currentValue, bCompleted);
    }
    return !bCompleted;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function _UpdateAnimationTime() {
    // NOTE: JavaScript requires creating a new object
    // in order to retrieve the current time. They
    // hopefully do not do a dynamic memory allocate.
    var oldTime = g_CurrentTime;
	g_CurrentTime = (new Date()).getTime() / 1000.0;
	g_ElapsedTime = g_CurrentTime - oldTime;
}

