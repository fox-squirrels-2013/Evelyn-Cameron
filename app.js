
var CONTENT_DIV           = '.typeracer_line';
var CONTENT_PARENT        = '#lines';
var KEY_SAMPLE_INTERVAL   = 5000;
var DEFAULT_EVENT         = 'keypress';

////////////////////////////////////////////////
// Keystroker (model)
////////////////////////////////////////////////

var DEFAULT_EVENT = 'keypress';
var KEY_SAMPLE_INTERVAL = 1000;
var MAX_SILENT_CYCLES = 50;

var Keystroker = function(mode){
  this.mode = mode || DEFAULT_EVENT;
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
  this.content = $(CONTENT_PARENT + ' div:first-child').text();
  this.alldone = false;
  this.listeners = [];
};

Displayer.prototype.getGametext = function() {
  return this.content;
};

Displayer.prototype.verify = function(bool) {
  if(bool){ this.index++ }
  return this.nextChar();
};

Displayer.prototype.done = function() {
  // console.log(this.index);
  // console.log(this.content.length);
  if(this.index >= this.content.length){
    // $(CONTENT_DIV).animate({ height:'toggle'},'slow');
    // console.log('done');
    this.alldone = true;
    console.log(this.content.length);
    if (this.content.length !== 0) { // only notify listeners if there was actually any content
      this.notify();
    };
    this.index = 0; 
    this.content = $(CONTENT_PARENT + ' div:first-child').text();
    // console.log(this.content);
    return true;
  }
  return false;
};

Displayer.prototype.nextChar = function() {
  // console.log(this.content.charAt(this.index));
  return this.content.charAt(this.index);
};

// register listeners
Displayer.prototype.register = function(func) {
  this.listeners.push(func);
};

// notify listeners
Displayer.prototype.notify = function() {
  this.listeners.forEach(function(f){
    f();
  });
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


var Comparer = function(){
  this.user = new Keystroker();
  this.disp = new Displayer();
  this.errorRate = 0;
  this.patience = 0;
}

Comparer.prototype.run = function(){
  this.user.startListening();
  var k = this.user.nextKey();
  var d = this.disp.nextChar();

  var self = this;

  var handle = window.setInterval(function(){
    // console.log(self.user.allKeys());

    if(self.disp.done() || self.patience >= MAX_SILENT_CYCLES) {
      // clearInterval(handle);
      // console.log('--> line completed!');
      // as soon as one line is done, get the first char of the next line
      d = self.disp.verify(); 
    }

    // console.log(k)
    // console.log(self.disp.content);

    if(null === k) {
      // you're  not typing
      self.patience++;
      k = self.user.nextKey();
      console.log('TYPE!  fast fast, go go go.');

    } else if(!self.keyMatchedChar(k, d)){
      console.log('keep trying...['+k+'] doesn\'t match ['+d+']' + ' error rate ['+self.errorRate+']');
      k = self.user.nextKey();
      self.errorRate++;
      self.patience = 0;

    } else {
      console.log('match! nicely done. ['+k+','+d+']');
      k = self.user.nextKey();
      d = self.disp.verify(true);
      self.patience = 0;
    }
  }, KEY_SAMPLE_INTERVAL);
}

Comparer.prototype.keyMatchedChar = function(userChar, gameChar){
  // console.log(userChar, gameChar);
  return userChar === gameChar;
}

////////////////////////////////////////////////
// $(document).ready(function(){
function startTypeRacer(){

  console.log(window.player);
  game = new Comparer();
  var self = this;
  game.disp.register(function(){
    // console.log('registered function fired!');
    // console.log(window.player);
    // console.log('completing line in firebase...');
    window.player.completeLine();
  });
  game.run();
};

// wait a couple seconds before starting typeracer
// so firebase can respond with player data
setTimeout(startTypeRacer, 1000);