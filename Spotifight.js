Cards = new Meteor.Collection('cards');
Players = new Meteor.Collection('players'); // waiting player

var nrOfCardsPlayerOne = 0,
    nrOfCardsPlayerTwo = 0;
var clientID = "6da341adbed94c3ea669dfa249804410";
var clientSecret = "449b5590a223410dbf402fe7e174199b";
var redirectURI = 'http://localhost:3000'; // Your redirect uri
var isDoneAlready = false;

if (Meteor.isClient) {

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

  function swapPlayer() {
    middleGround();
    if( confirm("Time to swap Player!") ) {
      if(Session.get('activePlayer') === Session.get('user1'))
        Session.set('activePlayer',Session.get('user2'));
      else
        Session.set('activePlayer',Session.get('user1'));
    } else {
      swapPlayer();
    }
  }

  function bothChoicesDone() {
    return Session.get('firstPlayerChoice') && Session.get('secondPlayerChoice');
  }

  function bothPlayersDone() {
    return (nrOfCardsPlayerOne >= 5 && nrOfCardsPlayerTwo >= 5);
  }

  Template.players.events({
    "click #startButton": function(event){

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
        if (nrOfCardsPlayerOne >= 4) {
          Session.set("notEnoughCardsPlayerOne",false);
          checkIfDone();
        } else {
          var c=true;
          while (c){
            c = addCard ($("#songname").val());
          }
          nrOfCardsPlayerOne++;
        }
      } else {
        if (nrOfCardsPlayerTwo >= 4) {
          Session.set("notEnoughCardsPlayerTwo",false);
          checkIfDone();
        } else {
          var c=true;
          while (c) {
            c = addCard ($("#songname").val());
          }
          nrOfCardsPlayerTwo++;
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

/*
      var tempCard = $('#tempCard');
      tempCard.css('top', cCard.position().top );
      tempCard.css('left', cCard.position().left );
      tempCard.show();
      tempCard.html( cCard.html() );

      tempCard.animate({
        left: activeCard.position().left,
        top: activeCard.position().top
      }, 300);

      tempCard.animate({
        left: "+=172px"
      }, 300);
*/
      setTimeout(function() {
        placeActiveCard.html( cCard.html() );
      }, 0);

      if(Session.get('activePlayer') === Session.get('user1')) 
        Session.set('firstPlayerChoice', $(cCard) );
      else 
        Session.set('secondPlayerChoice', $(cCard) );

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

    var dmgOnFirst = Math.floor(cardOne.attack / cardTwo.defense);
    var dmgOnSecond = Math.floor(cardTwo.attack / cardOne.defense);

    if(dmgOnFirst === dmgOnSecond) {
      alert("Both fainted.");
    } else {
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
    alert("Player one won.");    
    $('#playerOneActive').empty();
    Session.get('secondPlayerChoice').remove();
    nrOfCardsPlayerOne--;
  }

  function clearUserTwo() {
    alert("Player two won.");
    $('#playerTwoActive').empty();
    Session.get('firstPlayerChoice').remove();
    nrOfCardsPlayerOne--;
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
