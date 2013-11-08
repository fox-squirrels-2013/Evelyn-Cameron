$('document').ready(function(){

  var FIREBASE_APP_URL = 'https://enfys.firebaseio.com/';

  // grab current document url
  // console.log(document.URL);
  var docUrl    = 'http://www.enfys.com/game1/player1'.split('/');// document.URL
  var playerId  = docUrl.pop();
  var gameId    = docUrl.pop();
  var gameUrl   = FIREBASE_APP_URL + gameId + '/';
  var game      = new Firebase(gameUrl);

  // https://www.firebase.com/docs/creating-references.html
  // Creating a Firebase reference is an extremely light-weight operation,
  // so you can create as many as you like without worrying about wasting
  // bandwidth or memory.

  // setup game
  console.log(playerId);

  game.on('child_added', function(snapshot){
    // console.log(snapshot.child('lines').exportVal());
    data  = snapshot;
    name  = snapshot.name()
    value = snapshot.val();

    switch(true) {
      // if we find a player
      case /player/.test(name):
        if (playerId === name) {
          var player = new Player(name);
          player.start();
        };
        // console.log(players);
        break;

      // if we find game metadata
      case /meta/.test(name):
        console.log('found metadata: ' + name);
        console.log(value);
        break;
      default:
        throw new RangeError('unrecognized node [' + node + ']');
    }

    // players.map(start); // how do i do map in JS?
  });


  var Player = function(name){
    console.log(name + ' created!');
    this.name      = name;
    // add firebase references for player and their visible, pending and incoming queues
    this.ref       = game.child(name);
    this.visible   = game.child(name + '/lines/visible');
    this.pending   = game.child(name + '/lines/pending');
    this.incoming  = game.child(name + '/lines/incoming');
    // this.formatter = Formatter;
  }

  Player.prototype.start = function() {
    // console.log(this.name + ' listening...');
    var self = this;
    this.visible.on('child_added', function(line){
      $('#lines').append(formatted.line('me', line.val().text));
    });

    // this.pending.on('child_added', function(snapshot){
    //   console.log(self.name + ' pending lines:');
    //   console.log(snapshot.name());
    // });

    // console.log(this.incoming.toString());
    this.incoming.on('child_added', function(line){
      $('#lines').append(formatted.line('other', line.val().text));
    });
  };

  ////////////////////////////////////////////////////////////
  // helper functions
  ////////////////////////////////////////////////////////////
  var formatted = {
      line : function(player, text){
        return '<div class="'+ player +'">'+ text + '</div>';
      }
  }
});

