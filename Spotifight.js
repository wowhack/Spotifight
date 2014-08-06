Cards = new Meteor.Collection('cards');
Players = new Meteor.Collection('players'); // waiting player

var nrOfCardsPlayerOne = 0,
    nrOfCardsPlayerTwo = 0;
var clientID = "6da341adbed94c3ea669dfa249804410";
var clientSecret = "449b5590a223410dbf402fe7e174199b";
var redirectURI = 'http://localhost:3000'; // Your redirect uri
var isDoneAlready = false;

if (Meteor.isClient) {

  $('#explosion').hide();

  var buttonEnabled = false;
  var allowRemoval = false;
  var waitingForPlayer = false;
  var user;

  function prepareGame() {
    
  }

  function middleGround() {
    $('#cardList').each(function(idx, x) {
      $(x).hide();
    });

    $('#cardList2').each(function(idx, x) {
      $(x).hide();
    });
  }

  function newRound() {
    console.log("nrOfCardsPlayerOne:"+nrOfCardsPlayerOne);
    console.log("nrOfCardsPlayerTwo:"+nrOfCardsPlayerTwo);

    $('#playerOneActive').empty();
    $('#playerTwoActive').empty();

    if(nrOfCardsPlayerOne <= 0) {
      alert(Session.get('user2') + " has won! Congratulations.");
      completionScreen();
      return;
    } 

    if(nrOfCardsPlayerTwo <= 0) {
      alert(Session.get('user1') + " has won! Congratulations.");
      completionScreen();
      return;
    } 

    Session.set('firstPlayerChoice', undefined);
    Session.set('secondPlayerChoice', undefined);

    swapPlayer();
  }

  function swapPlayer() {
    var nextPlayer = (Session.get('activePlayer') === Session.get('user1') ) ? Session.get('user2') : Session.get('user1'); 
    middleGround();
    if( confirm("Is the next player ready? It's " + nextPlayer + "'s turn") ) {
      Session.set('activePlayer',nextPlayer);
    } else {
      swapPlayer();
    }
  }

  function completionScreen() {
    var firework1 = '<img border="0" src="http://www.picgifs.com/graphics/f/fireworks/graphics-fireworks-654863.gif" style="display: block; position: absolute; left: 15%; top: 15%;"/>',
        firework2 = '<img border="0" src="http://www.picgifs.com/graphics/f/fireworks/graphics-fireworks-654863.gif" style="display: block; position: absolute; left: 65%; top: 25%;"/>',
        firework3 = '<img border="0" src="http://www.picgifs.com/graphics/f/fireworks/graphics-fireworks-654863.gif" style="display: block; position: absolute; left: 25%; top: 55%;"/>',
        firework4 = '<img border="0" src="http://www.picgifs.com/graphics/f/fireworks/graphics-fireworks-654863.gif" style="display: block; position: absolute; left: 55%; top: 65%;"/>';

    $('body').append(firework1);
    $('body').append(firework2);
    $('body').append(firework3);
    $('body').append(firework4);
  }

  function bothChoicesDone() {
    return Session.get('firstPlayerChoice') && Session.get('secondPlayerChoice');
  }

  function bothPlayersDone() {
    return (nrOfCardsPlayerOne >= 5 && nrOfCardsPlayerTwo >= 5);
  }

  Template.players.events({
    "click #startButton": function(event){
            console.log("nrOfCardsPlayerOne:"+nrOfCardsPlayerOne);
            console.log("nrOfCardsPlayerTwo:"+nrOfCardsPlayerTwo);
        Session.set('firstPlayerChoice', undefined);
        Session.set('secondPlayerChoice', undefined);

        var user1 = $.trim($('#username').val());
        var user2 = $.trim($('#username2').val());
        if ( user1 != '' && user2 != ''){

          Players.insert({ username: user1 });
          Players.insert({ username: user2 });

          $('#loginBox').hide();
          $('#greyBG').hide();

          $('#userSide').text( user1 );
          $('#enemySide').text( user2 );

          $('#addCard').show();
          $('#greyBG2').show();

          Session.set('user1', user1);
          Session.set('user2', user2);

          // first players turn
          Session.set('activePlayer', user1);

        } else {
          alert("Please enter usernames for both players!");
        }
    }
  });

  Template.players.helpers({
    players: function() {
      return Players.find();
    },
    isPlayer1: function() {
      return this.player === Session.get('user1'); 
    },
    isPlayer2: function() {
      return this.player === Session.get('user2'); 
    }
  });

  Template.cards.helpers({
    cards1: function() {
      return Cards.find({player: Session.get('user1')});
    },
    cards2: function() {
      return Cards.find({player: Session.get('user2')});
    }
  });

  Session.set("notEnoughCardsPlayerOne",true);
  Session.set("notEnoughCardsPlayerTwo",true);

  function checkIfDone() {    
    if(!Session.get("notEnoughCardsPlayerOne") && !Session.get("notEnoughCardsPlayerTwo")) {
      $("#addCard").fadeOut();
      prepareGame();
    } else {
      swapPlayer();
    }

  }

  Template.generation.events({
    'click #initButton': function(event) {
      if(Session.get('activePlayer') === Session.get('user1')) {
        if (nrOfCardsPlayerOne >= 5) {
          Session.set("notEnoughCardsPlayerOne",false);
          checkIfDone();
        } else {
          addCard($("#songname").val());
        }
      } else {
        if (nrOfCardsPlayerTwo >= 5) {
          Session.set("notEnoughCardsPlayerTwo",false);
          checkIfDone();
        } else {
          addCard($("#songname").val());
        }
      }
      
    }
  });

  Template.generation.helpers({
    getActivePlayer: function() {
      return Session.get('activePlayer');
    }
  });

  Template.outer.helpers({
    activity: function() {
      if(Session.get('user1') !== Session.get('activePlayer')) {
        $('#cardList').each(function(idx, x) {
          $(x).hide();
        });

        $('#playerOneActive').hide();
        $('#playerTwoActive').show();

        $('#cardList2').each(function(idx, x) {
          $(x).show();
        });

      } else {
        
        $('#cardList2').each(function(idx, x) {
          $(x).hide();
        });

        $('#playerOneActive').show();
        $('#playerTwoActive').hide();
        
        $('#cardList').each(function(idx, x) {
          $(x).show();
        });

      }
      return;
    }
  });

  Template.cards.events({
    'click .card': function(event) {
      var sharedArea = $('#sharedArea');
      var cCard = $(event.target).parent();

      var placeActiveCard;
      if(Session.get('activePlayer') === Session.get('user1') )
        placeActiveCard = $('#playerOneActive');
      else
        placeActiveCard = $('#playerTwoActive');

      setTimeout(function() {
        placeActiveCard.html( cCard.html() );
      }, 0);


      if(Session.get('activePlayer') === Session.get('user1')) {
        Session.set('firstPlayerChoice', $(cCard).html() );
        $(cCard).attr('id','firstPlayerChoice');
      }
      else {
        Session.set('secondPlayerChoice', $(cCard).html() );
        $(cCard).attr('id','secondPlayerChoice');
      }

      toggleButton(true);
      allowRemoval=true;
    },

    'click #battleButton': function(event) {
      //var activeCard = $('.activeCard');
      if(buttonEnabled) {
        toggleButton(false);
        if(bothChoicesDone())
          prepareShowdown();
        else
          swapPlayer();
      }
    }
  });
  // activating the battleButton
  function toggleButton(bool) {
    buttonEnabled=bool;
    if(bool) 
      $('#battleButton').removeClass('inactiveButton');
    else
      $('#battleButton').addClass('inactiveButton');
  }

  /* BATTLE LOGIC -------------- */
  function prepareShowdown() {
    middleGround();

    var card1 = $('#playerOneActive');
    var card2 = $('#playerTwoActive');

    card1.show();
    card2.show();

    var cardOne = {},
        cardTwo = {};

    cardOne["attack"] = $(card1).find('.attack').text();
    cardTwo["attack"] = $(card2).find('.attack').text();

    cardOne["defense"] = $(card1).find('.defense').text();
    cardTwo["defense"] = $(card2).find('.defense').text();
    
    showDown(cardOne, cardTwo);

  }

  function showDown(cardOne, cardTwo) {

    // deal dmg
    fightAnimation(function() {
      calcWinner(cardOne, cardTwo);
    });
    
  }

  function calcWinner(cardOne, cardTwo) {
    console.log(cardOne);
    console.log(cardTwo);

    var dmgOnSecond = Math.floor(cardOne.attack+1 / cardTwo.defense+1);
    var dmgOnFirst = Math.floor(cardTwo.attack+1 / cardOne.defense+1);

    if(dmgOnFirst === dmgOnSecond) {
      alert("Both fainted.");
    } else {
      console.log("dmgOnFirst:"+dmgOnFirst);
      console.log("dmgOnSecond:"+dmgOnSecond);
      if(dmgOnFirst > dmgOnSecond)
        clearUserOne();
      else
        clearUserTwo();
    }
  }

  function fightAnimation(callback) {
    var card1 = $('#playerOneActive');
    var card2 = $('#playerTwoActive');
    var battleButton = $('#battleButton');

    battleButton.fadeOut();

    card1.animate({
      top: "25%"
    },1000);

    card2.animate({
      top: "45%"
    },1000);

    $('body').append(explo);
    setTimeout(function() {
      $('#explosion').hide();
    },100);

    setTimeout(function() {
      card1.animate({
        top: "20%"
      },1000);

      card2.animate({
        top: "48%"
      },1000);

      callback();
      battleButton.fadeIn(1000);

    },1000);
  }

  function clearUserOne() {
    alert(Session.get('user1') + " won this round.");    
    $('#playerOneActive').empty();
    $('#secondPlayerChoice').remove();
    nrOfCardsPlayerOne--;
    newRound();
  }

  function clearUserTwo() {
    alert(Session.get('user2') + " won this round.");
    $('#playerTwoActive').empty();
    $('#firstPlayerChoice').remove();
    nrOfCardsPlayerOne--;
    newRound();
  }


  /* --------------------------- */

  Template.generation.notEnoughCards = function(){
    return (Session.get("notEnoughCardsPlayerOne") || Session.get("notEnoughCardsPlayerTwo"));
  }

  function addCard(artist) {
    // fetch my public playlists
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
          q: artist,
          type: 'track'
        },
        success: function(response) {
          var tracks = response.tracks;
          track = tracks.items[0];
          if(track === undefined) {
            alert("Couldnt find any song, too bad for you!");
            return false; 
          }
          else {

            if(Session.get('activePlayer') == Session.get('user1')) 
              nrOfCardsPlayerOne++;
            else 
              nrOfCardsPlayerTwo++;

            Cards.insert({
              player: Session.get('activePlayer'), 
              cardname: track.name, 
              attack: track.popularity, 
              defense: 100 - track.popularity, 
              url: track.album.images[0].url
            });  
            return true;
          }
        }
    });
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Cards.remove( {} );
    Players.remove( {} );
  });
}
