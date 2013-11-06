console.log('hi mom');

window.onkeypress = function(e) {
  console.log(e);
  console.log('pressed');
};


/*
// this thing comes out when i console.log(e)

KeyboardEvent {altGraphKey: false, metaKey: false, altKey: false, shiftKey: false, ctrlKey: false…}
altGraphKey: false
altKey: false
bubbles: true
cancelBubble: false
cancelable: true
charCode: 97
clipboardData: undefined
ctrlKey: false
currentTarget: null
defaultPrevented: false
detail: 0
eventPhase: 0
keyCode: 97
keyIdentifier: "U+0041"
keyLocation: 0
layerX: 0
layerY: 0
location: 0
metaKey: false
pageX: 0
pageY: 0
returnValue: true
shiftKey: false
srcElement: body
target: body
timeStamp: 1383705268171
type: "keypress"
view: Window
which: 97
__proto__: KeyboardEvent
DOM_KEY_LOCATION_LEFT: 1
DOM_KEY_LOCATION_NUMPAD: 3
DOM_KEY_LOCATION_RIGHT: 2
DOM_KEY_LOCATION_STANDARD: 0
constructor: function KeyboardEvent() { [native code] }
getModifierState: function getModifierState() { [native code] }
initKeyboardEvent: function initKeyboardEvent() { [native code] }
__proto__: UIEvent
constructor: function UIEvent() { [native code] }
initUIEvent: function initUIEvent() { [native code] }
__proto__: Event
AT_TARGET: 2
BLUR: 8192
BUBBLING_PHASE: 3
CAPTURING_PHASE: 1
CHANGE: 32768
CLICK: 64
DBLCLICK: 128
DRAGDROP: 2048
FOCUS: 4096
KEYDOWN: 256
KEYPRESS: 1024
KEYUP: 512
MOUSEDOWN: 1
MOUSEDRAG: 32
MOUSEMOVE: 16
MOUSEOUT: 8
MOUSEOVER: 4
MOUSEUP: 2
NONE: 0
SELECT: 16384
constructor: function Event() { [native code] }
initEvent: function initEvent() { [native code] }
preventDefault: function preventDefault() { [native code] }
stopImmediatePropagation: function stopImmediatePropagation() { [native code] }
stopPropagation: function stopPropagation() { [native code] }
__proto__: Object
 keys.js:4
pressed 
*/
