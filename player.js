$('document').ready(function(){

  var me  = 'player1';
  var you = 'player2';
  var timer = 5000;

  var FIREBASE_APP_URL = 'https://enfys.firebaseio.com/';

  // grab current document url
  // console.log()document.URL.split('/').pop().split('.')[0];
  var docUrl    = 'http://www.enfys.com/game1/player1'.split('/');// document.URL
  var playerId  = document.URL.split('/').pop().split('.')[0];
  var gameId    = 'game1';
  var gameUrl   = FIREBASE_APP_URL + gameId + '/';
  var game      = new Firebase(gameUrl);
  players       = [];

  // https://www.firebase.com/docs/creating-references.html
  // Creating a Firebase reference is an extremely light-weight operation,
  // so you can create as many as you like without worrying about wasting
  // bandwidth or memory.

  console.log(me);


  var presence = new Firebase(FIREBASE_APP_URL + '.info/connected');
  presence.on('value', function(snap){
    console.log(snap.name(), snap.val());
    console.log(new Date().getTime());
  });

  // firebase setup
  game.on('child_added', function(snapshot){
    var data  = snapshot;
    var name  = snapshot.name()
    var value = snapshot.val();

    switch(true) {
      // if we find a player
      case /player/.test(name):
        // if (playerId === name) {
          var player = new Player(name);
          player.start();
          players.push(player);
        // };
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

    //Game Timer
  // var KEY_SAMPLE_INTERVAL = 3000;
  // var handle = window.setInterval(function(){
  //   try {
  //     console.log('times passin');
  //     players[0].cycleTime();
  //   } catch(err) {
  //     console.log(err);
  //     console.log('all done');
  //     clearInterval(handle);
  //   }

  // }, KEY_SAMPLE_INTERVAL);

  var Player = function(name){

    // console.log(name + ' created! check this out.');
    // console.log(this);
    this.name      = name;
    // add firebase references for player and their visible, pending and incoming queues
    this.ref       = game.child(name);
    this.lines     = game.child(name + '/lines');
    this.visible   = game.child(name + '/lines/visible');
    this.invisible = game.child(name + '/lines/invisible');
    this.opponent  = game.child(name + '/lines/opponent');
    this.other     = game.child(('player1' ? 'player2' : 'player1') + '/lines/opponent');

    // local arrays to hold all the IDs
    this.vis_      = [];
    this.inv_      = [];
    this.opp_      = [];
  }

  // tracks the passage of time
  Player.prototype.cycleTime = function() {
    // pull next item from invisible Q
    try {
      this.invisible.child(this.inv_.shift()).remove();
    } catch(err) {
      // console.log(err.message);
      console.log('no more invisible lines!');
    }

    // pull all items from incoming opponent Q
    var self = this;
    this.opp_.forEach(function(item){
      console.log('item: ' + item);
      try {
        self.opponent.child(item).remove();
      } catch(err) {
        // console.log(err.message);
        console.log('opponent has not finished a line recently');
      }
    });
  };

  Player.prototype.completeLine = function() {
    this.visible.child(this.vis_.shift()).remove();
    //~ and grab ALL text from oppoenent Q into visible
    $('#lines').children(':first').remove()
  };

  Player.prototype.start = function() {
    // console.log(this.name + ' listening...');
    var self = this;

    //---------------------------------------------
    // register event handlers on visible Q
    //---------------------------------------------
    this.visible.on('child_added', function(line){
      var key = line.name();
      self.vis_.push(key);

      var color = '';
      if(self.opp_.indexOf(key) !== -1) color = 'other';
      else if(self.vis_.indexOf(key) !== -1) color = 'me';
      else { console.log('something funny happened'); }
      $('#lines').append(formatted.line(color, line.val()));
    });

    this.visible.on('child_removed', function(line){
      self.other.push(line.val());
    })

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
      self.vis_.push(line.name());
    })

    //---------------------------------------------
    // register event handlers on opponet Q
    //---------------------------------------------
    this.opponent.on('child_added', function(line){
      self.opp_.push(line.name());
      // decided not to show opponent lines when they're added
      // and instead show them when the clock ticks
      // $('#lines').append(formatted.line('other', line.val()));
    });

    this.opponent.on('child_removed', function(line){
      self.visible.push(line.val());
      self.vis_.push(line.name());
    });

  };

  ////////////////////////////////////////////////////////////
  // helper functions
  ////////////////////////////////////////////////////////////
  var formatted = {
    line : function(player, text){
      return '<div class="typeracer_line '+ player +'">'+ text + '</div>';
    }
  }



  ////////////////////////////////////////////////////////////
  // seed data
  ////////////////////////////////////////////////////////////

  $('#seeder').on('click', function(){
      var lineDeletion = game.child('player1/lines/visible');
      lineDeletion.remove();

      var invisible = game.child('player1/lines/invisible');
      var seedlines = $("#seed-data-1").text().split('\n');
      seedlines.forEach(function(e){
        invisible.push(e);
      });

      var lineDeletion = game.child('player2/lines/visible');
      lineDeletion.remove();

      var invisible = game.child('player2/lines/invisible');
      var seedlines = $("#seed-data-2").text().split('\n');
      seedlines.forEach(function(e){
        invisible.push(e);
      });
      // refresh the window to get started
      location.reload();
  });

  $('#cycle-time').on('click', function(){
    players[0].cycleTime();
    console.log('time has passed');
  });

  $('#complete-line').on('click', function(){
    players[0].completeLine();

    console.log('line completed!');
  });

});

