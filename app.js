////////////////////////////////////////////////
// Keystroker (model)
////////////////////////////////////////////////

var DEFAULT_MODE = 'keypress';

var Keystroker = function(mode){
  this.mode = mode || DEFAULT_MODE;
  this.buffer = [];
  this.observers = [];
}

Keystroker.prototype.startListening = function(trgt) {
  var target = trgt || document;

  if(typeof target != "object") throw RangeError("target must be an object!");

  switch(this.mode){
    case 'keypress':
      if ('onkeypress' in target) {
        var self = this;
        target.onkeypress = function(e){
          self.buffer.push({code: e.keyCode, char: String.fromCharCode(e.keyCode)})
        };

      } else {
        throw new RangeError("target: [" + target + "] does not raise event: [" + this.mode + "]");
      }
      break;

    case 'keyup':
    case 'keydown':
      throw new SyntaxError("not implemented!");
      break;

    default:
      throw new RangeError("unsupported mode")
  }
};

Keystroker.prototype.allKeys = function() {
  return this.buffer.map (function(s){
    return s['char'];
  });
};

Keystroker.prototype.nextKey = function(){
  var key = this.buffer.shift();
  if (null != key) return key['char']; // always return a single character
  return null;                         // OR null
}

////////////////////////////////////////////////
// usage ...
// var k = new Keystroker();
// k.startListening();
// window.setInterval(function(){
//   console.log(k.allKeys());
// },1000);
////////////////////////////////////////////////

////////////////////////////////////////////////
// Displayer (view-model)
////////////////////////////////////////////////

var Displayer = function(){
  this.index = 0;
  this.content = $('#content').text();
};

Displayer.prototype.highlight = function() {
    var pre = '<span style="font-weight:bold;color:red;">'
    var post = '</span>'
    var symbol = '<span style="color:red;">*</span>';

    if (this.nextChar() === ' ') {
      this.insert(this.index, symbol)
    } else {
      this.surround(this.index, pre, post );
    }

};

Displayer.prototype.getGametext = function() {
  return this.content;
};

Displayer.prototype.verify = function(bool) {
  if(bool) { 
    this.index++;
    this.highlight();
  }
  return this.nextChar();
};

Displayer.prototype.done = function() {
  if(this.index >= this.content.length){
    $('#content').animate({ height:'toggle'},'slow');
    return true;
  }
  return false;
};

Displayer.prototype.nextChar = function() {
  return this.content.charAt(this.index);
};

// use this to insert something like an asterisk or whatever to follow the typist
Displayer.prototype.insert = function(position, symbol) {
  var updated_content = this.content.substr(0, position) + symbol +
                        this.content.substr(position);
  $('#content').html(updated_content);
};

// use this to surround the current letter as a hint for the typist
Displayer.prototype.surround = function(position, before, after) {
  var updated_content = this.content.substr(0, position) + before +
                        this.nextChar() + after + 
                        this.content.substr(position +1);
  $('#content').html(updated_content);
};

////////////////////////////////////////////////
// usage ---
// d = Displayer;               // the displayer
// console.log(d.index)         // keeps an index
// console.log(d.nextChar())    // and returns next char
// d.verify(true);              // verify(true)
// console.log(d.index)         // updates the index
// console.log(d.nextChar())    // and continues
// d.verify(false);             // while verify(false)
// console.log(d.index)         // doesn't affect the index
// console.log(d.nextChar())    // and returns the same char


////////////////////////////////////////////////
// Comparer (controller)
////////////////////////////////////////////////

var KEY_SAMPLE_INTERVAL = 200 ;
var PATIENCE = 20 // the number of cycle we wait for you to type something til we stop the game
var Comparer = function(){
  this.user = new Keystroker();
  this.disp = new Displayer();
  this.errors = [];
  this.silence = 0;
}

Comparer.prototype.run = function(){
  this.user.startListening();
  var k = this.user.nextKey();
  var d = this.disp.nextChar();

  var self = this;

  var handle = window.setInterval(function(){
    console.log(self.user.allKeys());

    if(self.disp.done() || self.silence > PATIENCE) { 
      clearInterval(handle);
      console.log('game over!');
      return;
    }

    if(null === k) {
      console.log('type something!');
      k = self.user.nextKey();
      self.silence++;

    } else if(!self.keyMatchedChar(k, d)){
      console.log('keep trying...['+k+'] doesn\'t match ['+d+']' + ' error count: '+ self.errors.length);
      self.errors.push(k);
      k = self.user.nextKey();
      self.silence = 0;
    } else {
      console.log('match! nicely done. ['+k+','+d+']');
      k = self.user.nextKey();
      d = self.disp.verify(true);
      self.silence = 0;
    }
  }, KEY_SAMPLE_INTERVAL);
}

Comparer.prototype.keyMatchedChar = function(userChar, gameChar){
  console.log(userChar, gameChar);
  return userChar === gameChar;
}

////////////////////////////////////////////////

$('document').ready(function(){
  game = new Comparer();
  game.run();

});
