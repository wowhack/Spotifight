Cards = new Meteor.Collection('cards');
Players = new Meteor.Collection('players'); // waiting player

var clientID = "6da341adbed94c3ea669dfa249804410";
var clientSecret = "449b5590a223410dbf402fe7e174199b";
var redirectURI = 'http://localhost:3000'; // Your redirect uri


if (Meteor.isClient) {

  var buttonEnabled = false;
  var allowRemoval = false;
  var waitingForPlayer = false;
  var user;

  var playerOneChoice;
  var playerTwoChoice;

  function prepareGame() {
  }

  Template.players.events({
    "click #startButton": function(event){
      if(event.which == 13)
        var user1 = $.trim($('#username').val());
        var user2 = $.trim($('#username2').val());
        if ( user1 != '' && user2 != ''){

          Players.insert({ username: user1, player: 0 });
          Players.insert({ username: user2, player: 1 });

          $('#loginBox').hide();
          $('#greyBG').hide();

          $('#userSide').text( user1 );
          $('#enemySide').text( user2 );

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
      return this.player === '0'; 
    },
    isPlayer2: function() {
      return this.player === '1'; 
    }
  });

  Template.cards.helpers({
    cards: function() {
      return Cards.find();
    }
  });

  Template.generation.events({
    'click #initButton': function(event) {
      addCard ($("#songname").val());
    }
  });

  Template.cards.events({
    'click .activeCard': function(event) {
      var yourHand = $('#yourHand');
      var cCard = $(event.target).parent();
    },

    'click .card': function(event) {
      var sharedArea = $('#sharedArea');
      var cCard = $(event.target).parent();

      var activeCard = $('.activeCard');

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

      setTimeout(function() {
        activeCard.html( cCard.html() );
      }, 600);

      toggleButton(true);
      allowRemoval=true;
    },

    'click #battleButton': function(event) {
      var activeCard = $('.activeCard');
      if(buttonEnabled) {
        buttonEnabled=false;
        waitForShowdown();
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

  function clearActiveCard(card) {
    if(allowRemoval) {
      card.empty();
      allowRemoval=false;
    }
  }

  /* BATTLE LOGIC -------------- */

  function waitForShowdown() {
    
  }

  function showDown(cardOne, cardTwo) {

    // deal dmg
    cardOne.health -= cardTwo.attack;
    cardTwo.health -= cardOne.attack;

    if(cardOne.health <= 0) {
      clearUserOne();
    }

    if(cardTwo.health <= 0) {
      clearUserTwo();
    }
  }

  function clearUserOne() {
    $('#playerOneActive').name('0');
    $('#playerOneActive').empty();
  }

  function clearUserTwo() {
    $('#playerTwoActive').name('0');
    $('#playerTwoActive').empty();
  }


  /* --------------------------- */

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
          console.log(response);
          var tracks = response.tracks;
          track = tracks.items[0]
          Cards.insert({cardname: track.name, attack: track.popularity, defense: 100 - track.popularity, url: track.album.images[0].url});  
        }
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Cards.remove( {} );
    Players.remove( {} );
  });
}
