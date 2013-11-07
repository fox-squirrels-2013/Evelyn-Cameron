window.onload = function() {
   document.getElementsByTagName('body')[0].onkeyup = function(e) { 
      var ev = e || event;
        // console.log(String.fromCharCode(ev.keyCode))
        console.log(e)
   }
};

//.onload make this function occure as the page loads
//document.getElementsByTagName -get the element by tag name the body in this instance
// .onkeypress .onkeyup .onkeydown
// ORDER OR PRESIDENCE:
// onkeydown -on key press -works on all keys
// onkeypress - on key press
// onkeyup -on key release
// String.fromCharCode converts keycode into string character