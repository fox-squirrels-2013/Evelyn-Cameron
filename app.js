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
Displayer = {
  index :0, displayText: document.getElementById('displayText').innerHTML,
  getGametext: function(){
    return this.displayText
  },

  verify:function(bool){
    if(bool){ this.index++ }
    return this.nextChar()
  },


  done: function(){
    if(this.index >= this.displayText.length){
      $("div").animate({
        height:'toggle',
      },'slow')
    }
  },

Displayer.prototype.nextChar = function(){
  // replace the body of this function
  return randomLetter(); // but always return a single character
}


  nextChar: function(){
    return this.displayText.charAt(this.index)
  },
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

Displayer.prototype.done = function(){
  // replace the body of this function
  return true; // but always return a boolean
}



////////////////////////////////////////////////
// Comparer (controller)
////////////////////////////////////////////////

var Comparer = function(){
  // var userChar = ""
  // var gameChar = ""
  this.user = new Keystroker()
  this.disp = new Displayer()
}

Comparer.prototype.run = function(){

  do {
    var k = this.user.nextKey();
    var d = this.disp.nextChar();

    while (!this.compare(k, d)){
      console.log('keep trying...['+k+'] doesn\'t match ['+d+']');
      k = this.user.nextKey();
    }

    console.log('match! nicely done. ['+k+','+d+']');

    this.disp.verify(true);

  } while(!this.disp.done());
}

Comparer.prototype.compare = function(userChar, gameChar){
  return userChar === gameChar;
}

////////////////////////////////////////////////

game = new Comparer();
game.run();
