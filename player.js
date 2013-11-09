$('document').ready(function(){

  var FIREBASE_APP_URL = 'https://enfys.firebaseio.com/';

  // grab current document url
  // console.log(document.URL);
  var docUrl    = 'http://www.enfys.com/game1/player1'.split('/');// document.URL
  var playerId  = docUrl.pop();
  var gameId    = docUrl.pop();
  var gameUrl   = FIREBASE_APP_URL + gameId + '/';
  var game      = new Firebase(gameUrl);
  players       = [];

  // https://www.firebase.com/docs/creating-references.html
  // Creating a Firebase reference is an extremely light-weight operation,
  // so you can create as many as you like without worrying about wasting
  // bandwidth or memory.

  // setup game
  console.log(playerId);

  game.on('child_added', function(snapshot){
    var data  = snapshot;
    var name  = snapshot.name()
    var value = snapshot.val();

    switch(true) {
      // if we find a player
      case /player/.test(name):
        if (playerId === name) {
          var player = new Player(name);
          player.start();
          players.push(player);
        };
        break;

      // if we find game metadata
      case /meta/.test(name):
        console.log('found metadata: ' + name);
        console.log(value);
        break;
      default:
        throw new RangeError('unrecognized node [' + node + ']');
    }
  });

  var Player = function(name){
    // console.log(name + ' created!');
    this.name      = name;
    // add firebase references for player and their visible, pending and incoming queues
    this.ref       = game.child(name);
    this.lines     = game.child(name + '/lines');
    this.visible   = game.child(name + '/lines/visible');
    this.invisible = game.child(name + '/lines/invisible');
    this.opponent  = game.child(name + '/lines/opponent');

    // local arrays to hold all the IDs
    this.vis_      = [];
    this.inv_      = [];
    this.opp_      = [];
  }

  Player.prototype.start = function() {
    // console.log(this.name + ' listening...');
    var self = this;

    //---------------------------------------------
    // register event handlers on visible Q
    //---------------------------------------------
    this.visible.on('child_added', function(line){
      self.vis_.push(line.name());
      $('#lines').append(formatted.line('me', line.val()));
    });

    //---------------------------------------------
    // register event handlers on invisible Q
    //---------------------------------------------
    this.invisible.on('child_added', function(line){
      self.inv_.push(line.name());
      // console.log(self.name + ' pending lines:');
      // console.log(snapshot.name());
    });

    this.invisible.on('child_removed', function(line){
      self.visible.push(line.val());
      self.vis_
    })

    //---------------------------------------------
    // register event handlers on opponet Q
    //---------------------------------------------
    this.opponent.on('child_added', function(line){
      self.opp_.push(line.name());
      $('#lines').append(formatted.line('other', line.val()));
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

  ////////////////////////////////////////////////////////////
  // seed data
  ////////////////////////////////////////////////////////////

  $('#seeder').on('click', function(){
    var names = ['player1', 'player2'];

    names.forEach(function(player){
      var invisible = game.child(player + '/lines/invisible');
      // var opponent  = game.child(player + '/lines/opponent');

      var seedlines = $("#seed-data").text().split('\n');

      seedlines.forEach(function(e){
        invisible.push(e);
      });

    });
  });

  $('#cycle-time').on('click', function(){
    // var visible    = game.child(players[0].name + '/lines/visible');
    // var invisible  = game.child(players[0].name + '/lines/invisible');

    var handle = players[0].invisible.on('child_removed', function(snapshot){
      line = snapshot.val();
      console.log(line);

      players[0].visible.push(line);
      players[0].vis_.push(line);
    });

    players[0].invisible.child(players[0].inv_.shift()).remove();
    players[0].invisible.off('child_removed', handle)

    console.log('line completed!');
  });
});

