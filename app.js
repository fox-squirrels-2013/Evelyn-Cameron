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
