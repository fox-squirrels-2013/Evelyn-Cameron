////////////////////////////////////////////////
// Keystroker (model)
////////////////////////////////////////////////

var DEFAULT_MODE = 'keypress';

var Keystroker = function(mode){
  this.mode = mode || DEFAULT_MODE;
  this.buffer = [];
  // this.listeners = [];
  this.observers = [];
}

Keystroker.prototype.startListening = function(trgt) {
  var target = trgt || document;

  if(typeof target != "object") throw RangeError("target must be an object!");

  switch(this.mode){
    case 'keypress':
      if ('onkeypress' in target) {
        // this.listeners[target + '.' + 'onkeypress'] = {target: target, type: 'onkeypress'};
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

// Keystroker.prototype.removeListeners = function() {
//   for (var i = this.listeners.length - 1; i >= 0; i--) {
//     this.listeners[i].removeEventListener
//   };
// };
//
// Keystroker.prototype.showListeners = function() {
//   console.log(this.listeners);
// };

Keystroker.prototype.allKeys = function() {
  return this.buffer.map (function(s){
    return s['char'];
  });
};

Keystroker.prototype.nextKey = function(){
  var key = this.buffer.shift();
  if (null != key) return key['char']; // always return a single character
  return null;                       // OR null
}

// // allow clients to register to be notified of incoming keystrokes
// Keystroker.prototype.registerObserver = function(func) {
//   console.log(func);
//   this.observers.push(func);
// };

// // run around telling everyone about what happened
// Keystroker.prototype.notifyObservers = function() {
//   this.observers.forEach(function(idx, el){ console.log(el); });
// };


// Keystroker.prototype.verify = function(bool) {

// };

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

var Displayer = function(){}

Displayer.prototype.nextChar = function(){
  // replace the body of this function
  return 'a'; // but always return a single character
}

Displayer.prototype.verify = function(bool){
  // replace the body of this function
  return bool; // but keep this line
}

Displayer.prototype.done = function(){
  // replace the body of this function
  return false; // but always return a boolean
}


////////////////////////////////////////////////
// Comparer (controller)
////////////////////////////////////////////////

var Comparer = function(){}

Comparer.prototype.run = function(){
  // replace the body of this function
  return true; // but always return a boolean
}


////////////////////////////////////////////////

game = new Comparer();
game.run();
