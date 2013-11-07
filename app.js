////////////////////////////////////////////////
// Keystroker (model)
////////////////////////////////////////////////

function randomLetter(){
  var letters = ['a', 'b', 'c', 'd'];
  var ltr = letters[Math.floor(Math.random()*letters.length)];
  return ltr;
}

var Keystroker = function(){}

Keystroker.prototype.nextKey = function(){
  // replace the body of this function

  return randomLetter(); // but always return a single character OR nil
}

////////////////////////////////////////////////
// Displayer (view-model)
////////////////////////////////////////////////

var Displayer = function(){}

Displayer.prototype.nextChar = function(){
  // replace the body of this function
  return randomLetter(); // but always return a single character
}

Displayer.prototype.verify = function(bool){
  // replace the body of this function
  return bool; // but keep this line
}

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
