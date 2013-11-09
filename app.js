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

// Keystroker.prototype.on = function(func, context) {
//   func.apply(context);
// };

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
  this.displayText = document.getElementById('displayText').innerHTML;
};

Displayer.prototype.getGametext = function() {
  return this.displayText;
};

Displayer.prototype.verify = function(bool) {
  if(bool){ this.index++ }
  return this.nextChar();
};

Displayer.prototype.done = function() {
  if(this.index >= this.displayText.length){
    $("div").animate({ height:'toggle'},'slow');
    return true;
  }
  return false;
};

Displayer.prototype.nextChar = function() {
  return this.displayText.charAt(this.index);
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

var KEY_SAMPLE_INTERVAL = 200;

var Comparer = function(){
  this.user = new Keystroker();
  this.disp = new Displayer();
  this.errorRate = 0;
}

Comparer.prototype.run = function(){
  this.user.startListening();
  var k = this.user.nextKey();
  var d = this.disp.nextChar();

  var self = this;

  var handle = window.setInterval(function(){
    console.log(self.user.allKeys());

    if(self.disp.done()) { clearInterval(handle); }

    console.log(k)
    if(null === k) {
      // you're  not typing
      k = self.user.nextKey();
      console.log('TYPE!  fast fast, go go go.');
    } else if(!self.keyMatchedChar(k, d)){
      console.log('keep trying...['+k+'] doesn\'t match ['+d+']' + ' error rate ['+self.errorRate+']');
      k = self.user.nextKey();
      self.errorRate++;
    } else {
      console.log('match! nicely done. ['+k+','+d+']');
      k = self.user.nextKey();
      d = self.disp.verify(true);
    }
  }, KEY_SAMPLE_INTERVAL);
}

Comparer.prototype.keyMatchedChar = function(userChar, gameChar){
  console.log(userChar, gameChar);
  return userChar === gameChar;
}

////////////////////////////////////////////////

game = new Comparer();
game.run();
