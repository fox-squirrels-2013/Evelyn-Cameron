////////////////////////////////////////////////
// Keystroker (model)
////////////////////////////////////////////////

var Keystroker = function(){}

Keystroker.prototype.nextKey = function(){
  // replace the body of this function
  return 'a'; // but always return a single character OR nil
}


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
