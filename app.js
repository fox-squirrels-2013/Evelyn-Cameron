////////////////////////////////////////////////
// Keystroker (model)
////////////////////////////////////////////////

var DEFAULT_MODE = 'keypress';

var Keystroker = function(mode){
  this.mode       = mode || DEFAULT_MODE;
  this.strokes    = [];
  this.listeners  = [];
}

Keystroker.prototype.start_listening = function(trgt) {
  var target = trgt || document;

  var strokes = this.strokes;
  var listeners = this.listeners;

  switch(this.mode){
    case 'keydown':
      throw new SyntaxError("not implemented!");
      break;
    case 'keypress':
      console.log(target);
      if ('onkeypress' in target) {
        target.onkeypress = function(e){
          strokes.push({code: e.keyCode, char: String.fromCharCode(e.keyCode)})
          listeners[e.target + '.' + e.type] = {target: e.target, type: e.type};
        };
      }
      //  else {
      //   throw new RangeError("target: [" + target + "] does not raise event: [" + this.mode + "]");
      // }
      break;
    case 'keyup':
      throw new SyntaxError("not implemented!");
      break;
    default:
      throw new RangeError("unsupported mode")
  }
};

// Keystroker.prototype.stop_all_listening = function() {
//   for (var i = this.listeners.length - 1; i >= 0; i--) {
//     this.listeners[i].removeEventListener
//   };
// };

Keystroker.prototype.show_listeners = function() {
  console.log(this.listeners);
};

Keystroker.prototype.nextKey = function(){
  var nk = this.strokes.pop();
  if (null != nk) return nk['char']; // always return a single character OR nil
  return null;
}

// Keystroker.prototype.verify = function(bool) {

// };

////////////////////////////////////////////////
// usage ...
var k = new Keystroker();
k.start_listening();
k.show_listeners();
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
