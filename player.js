$('document').ready(function(){

  // var me  = 'player1';
  // var you = 'player2';
  // var timer = 5000;

  var FIREBASE_APP_URL = 'https://enfys.firebaseio.com/';

  // grab current document url
  // console.log()document.URL.split('/').pop().split('.')[0];
  // var docUrl    = 'http://www.enfys.com/game1/player1'.split('/');// document.URL
  var playerId  = document.URL.split('/').pop().split('.')[0];
  var gameId    = 'game1';
  var gameUrl   = FIREBASE_APP_URL + gameId + '/';
  var game      = new Firebase(gameUrl);

  // setup a global player to be shared across scripts for now
  window.player = undefined;

  // https://www.firebase.com/docs/creating-references.html
  // Creating a Firebase reference is an extremely light-weight operation,
  // so you can create as many as you like without worrying about wasting
  // bandwidth or memory.

  // console.log(playerId);


  var presence = new Firebase(FIREBASE_APP_URL + '.info/connected');
  // presence.on('value', function(snap){
  //   console.log(snap.name(), snap.val());
  //   console.log(new Date().getTime());
  // });

  // firebase setup
  game.on('child_added', function(snapshot){
    var data  = snapshot;
    var name  = snapshot.name()
    var value = snapshot.val();

    switch(true) {
      // if we find a player
      case /player/.test(name):
        if (playerId === name) {
          player = new Player(name);
          player.start();
          console.log('creating ... ' + player.name);
        };
        break;

      // if we find game metadata
      case /meta/.test(name):
        // console.log('found metadata: ' + name);
        // console.log(value);
        break;
      default:
        throw new RangeError('unrecognized node [' + node + ']');
    }
  });


    //Game Timer
  // var handle = window.setInterval(function(){
  //   try {
  //     console.log('times passin');
  //     players[0].cycleTime();
  //   } catch(err) {
  //     console.log(err);
  //     console.log('all done');
  //     clearInterval(handle);
  //   }

  // }, timer);

  var Player = function(name){
    //---------------------------------------------
    // player setup including
    // - basic player properties
    // - all firebase hooks for game play
    // - all internal reference stores to sync w firebase
    //---------------------------------------------
    this.name      = name;
    // add firebase references for player and their visible, pending and incoming queues
    this.ref       = game.child(name);
    this.lines     = game.child(name + '/lines');
    this.visible   = game.child(name + '/lines/visible');
    this.invisible = game.child(name + '/lines/invisible');
    this.opponent  = game.child(name + '/lines/opponent');
    this.other     = game.child((this.name === 'player1' ? 'player2' : 'player1') + '/lines/opponent');

    // local arrays to hold all the IDs
    this.vis_      = [];
    this.inv_      = [];
    this.opp_      = [];

    //---------------------------------------------
    // refactored functions to simplify code below
    //---------------------------------------------
    this.nextInvisibleLine = function(){
      this.invisible.child(this.inv_.shift()).remove();
      return true;
    }

    this.hasIncomingLines = function(self){
      return this.opp_ && this.opp_.length
    }
  }

  // tracks the passage of time
  Player.prototype.cycleTime = function() {
    var current_player = this;

    console.log('times passin for ' + current_player.name);
    
    // pull next item from invisible Q
    try {
      current_player.nextInvisibleLine();
    } catch(err) {
      console.log('invisible lines completed for + ' + current_player.name);
    }

    // pull all items from incoming opponent Q
    if (current_player.hasIncomingLines()) {
    console.log('found ' + current_player.opp_.length + 'items from opponent!');
      current_player.opp_.forEach(function(item){
        try {
          current_player.opponent.child(item).remove();
        } catch(err) {
          // console.log(err.message);
          console.log('opponent has not finished a line recently');
        }
      });

    };
  };

  Player.prototype.completeLine = function() {
    console.log('line completed!');
    var current_player = this;

    try{
      $('#lines').children(':first').remove()
      current_player.visible.child(current_player.vis_.shift()).remove();
      //~ and grab ALL text from oppoenent Q into visible
    } catch(err){
      // console.log('nothing found for current player!\n' + err);
    }
  };

  Player.prototype.start = function() {
    var current_player = this;

    //---------------------------------------------
    // register event handlers on visible Q
    //---------------------------------------------
    current_player.visible.on('child_added', function(line){
      var key = line.name();
      current_player.vis_.push(key);

      // uncomment these lines to enable source detection
      // if we pull everything from opponent on clock cycle
      // instead of instantly
      //

      // var keyReport = function(k){
      //   ret = '';
      //   ret += (current_player.opp_.indexOf(k) !== -1) ? 'found key in opp_' : 'key NOT in opp_';
      //   ret += (current_player.vis_.indexOf(k) !== -1) ? 'found key in vis_' : 'key NOT in vis_';
      //   return ret;
      // }

      console.log(key);
      console.log(keyReport(key));
      var color = '';
      
      if(current_player.opp_.indexOf(key) !== -1) {
        console.log('opponent key recognized');
        color = 'other';
      
      } else if(current_player.vis_.indexOf(key) !== -1) { 
        console.log('player key recognized');
        color = 'me';
      
      } else { 
        console.log('something funny happened'); 
      }

      $('#lines').append(formatted.line(color, line.val()));
    });

    current_player.visible.on('child_removed', function(line){
      current_player.other.push(line.val());
    })

    //---------------------------------------------
    // register event handlers on invisible Q
    //---------------------------------------------
    current_player.invisible.on('child_added', function(line){
      current_player.inv_.push(line.name());
    });

    current_player.invisible.on('child_removed', function(line){
      current_player.visible.push(line.val());
      current_player.vis_.push(line.name());
    })

    //---------------------------------------------
    // register event handlers on opponet Q
    //---------------------------------------------
    current_player.opponent.on('child_added', function(line){
      current_player.opp_.push(line.name());
      // decided not to show opponent lines when they're added
      // and instead show them when the clock ticks
      // $('#lines').append(formatted.line('other', line.val()));
    });

    current_player.opponent.on('child_removed', function(line){
      current_player.visible.push(line.val());
      current_player.vis_.push(line.name());
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
      // var lineDeletion = game.child('player1/lines/visible');
      // lineDeletion.remove();

      var invisible = game.child('player1/lines/invisible');
      var seedlines = $(".seed-data-1.test").text().split('\n');
      seedlines.forEach(function(e){
        invisible.push(e);
      });

      // var lineDeletion = game.child('player2/lines/visible');
      // lineDeletion.remove();

      var invisible = game.child('player2/lines/invisible');
      var seedlines = $(".seed-data-2.test").text().split('\n');
      seedlines.forEach(function(e){
        invisible.push(e);
      });
      // refresh the window to get started
      location.reload();
  });

  $('#cycle-time').on('click', function(){
    console.log('clicked [cycle-time] for ' + player.name);
    player.cycleTime();
    // console.log('time has passed');
  });

  $('#complete-line').on('click', function(){
    // pID = (playerId === 'player1' ? 0 : 1);
    // players[pID].completeLine();
    player.completeLine();
    console.log('line completed!');
  });

  $('#disconnect').on('click', function(){
    alert('not implemented!');
    // console.log('disconnecting everything from firebase');
    // // game.off('child_removed');
    // // game.child(playerId + '/lines').off('child_added');
    // game.child(playerId + '/lines/visible').off('child_removed');
    // // game.child(playerId + '/lines/invisible');
    // // game.child(playerId + '/lines/opponent');
  });

});

