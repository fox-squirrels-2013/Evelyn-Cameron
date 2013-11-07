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

var Comparer = function(){
  userChar: ""
  gameChar: ""
}

Comparer.prototype.run = function(){
  window.onload = function() {
  do{
    userChar = Keystroker.nextkey;
    gameChar = Displayer.nextChar;
    while (Comparer.compare(userChar, gameChar) == false && gameChar != nil){
      userChar = Keystroker.nextkey;
    }      
    Displayer.verify(Comparer.compare(userChar, gameChar));
  }
  while(gameChar != nil);
  Displayer.done(true);
  }
}

Comparer.prototype.compare = function(userChar, gameChar){
  if (userChar == gameChar){
    return true
  }
  else{
    return false
  }
}

////////////////////////////////////////////////

game = new Comparer();
game.run();
