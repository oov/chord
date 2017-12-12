function ChordPlayer(ctx){
  this.ctx = ctx;
  this.gain = ctx.createGain();
  this.gain.gain.setValueAtTime(0.08, ctx.currentTime);
  this.gain.connect(ctx.destination);
  this.oc = [];
}

ChordPlayer.prototype.setVolume = function(vol){
  this.gain.gain.setValueAtTime(vol, ctx.currentTime);
}

ChordPlayer.prototype.getVolume = function(){
  return this.gain.gain.value;
}

ChordPlayer.prototype.play = function(notes){
  this.stop();
  for (var i = 0; i < notes.length; ++i) {
    var o = this.ctx.createOscillator();
    o.type = 'square';
    o.frequency.value = 440 * Math.pow(2, (-24 + notes[i])/12);
    o.connect(this.gain);
    o.start();
    this.oc.push(o);
  }
}

ChordPlayer.prototype.stop = function(){
  var oc = this.oc;
  for (var i = 0; i < oc.length; ++i) {
    oc[i].stop();
    oc[i].disconnect();
    oc[i] = null;
  }
  this.oc = [];
}