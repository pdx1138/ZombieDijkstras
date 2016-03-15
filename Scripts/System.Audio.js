
var _Music = null;
var _soundEffects = [];
var NUM_CHANNELS = 8;
function _SoundEffect(file) {
	this.channels = [];
	this.currChannel = 0;
	this.volume = 1.0;
	this.loop = false;
	for(var n = 0; n < NUM_CHANNELS; n++) {
		this.channels.push(new Audio(file));
	}
}
_SoundEffect.prototype.play = function() {
	this.channels[this.currChannel].volume = this.volume;
	this.channels[this.currChannel].play();
	this.currChannel = (this.currChannel + 1) % NUM_CHANNELS;
}

function _LoadMusic(file) {
    if(file != null) {
        _Music = new Audio(file);
        _Music.loop = false;
        _Music.volume = 0.0;
        _Music.play();
    }
    return true;
}

function _PlayMusic(file, volume, loop) {
	if(volume == undefined) volume = 1.0;
	if(loop == undefined) loop = false;
    if(file != null) {
        _Music = new Audio(file);
        _Music.loop = loop;
        _Music.volume = volume;
        _Music.play();
    }
    return true;
}

function _StopMusic() {
	if(_Music == null) {
		return;
	}
	_Music.pause();
	_Music = null;
}

function _SetMusicVolume(volume) {
    if(_Music == null) return;
	if(volume < 0.0) volume = 0.0;
	if(volume > 1.0) volume = 1.0;
    _Music.volume = volume;
}

function _LoadSoundEffect(file) {
	var snd = null;
    if(file != null) {
        snd = _soundEffects[file];
        if(snd==null || snd==undefined) {
        	snd = new _SoundEffect(file);
            _soundEffects[file] = snd;
        }
    }
    return true;
}

function _PlaySoundEffect(file, volume, loop) {
	if(volume == undefined) volume = 1.0;
	if(loop == undefined) loop = false;
	var snd = null;
    if(file != null) {
        snd = _soundEffects[file];
        if(snd==null || snd==undefined) {
        	snd = new _SoundEffect(file);
            _soundEffects[file] = snd;
        }
        snd.loop = loop;
        snd.volume = volume;
        snd.play();
    }
    return true;
}

function _SoundEffectMulti(file, volume, loop) {
	if(volume == undefined) volume = 1.0;
	if(loop == undefined) loop = false;
	var snd = null;
    if(file != null) {
        snd = new Audio(file);
        snd.loop = loop;
        snd.volume = volume;
        snd.play();
    }
    return snd;
}

function _SoundEffectSetVolume(file, volume) {
	var snd = null;
    if(file != null) {
        snd = _sounds[file];
        if(snd!=null && snd!=undefined) {
            snd.volume = volume;
        }
    }
    return snd;
}