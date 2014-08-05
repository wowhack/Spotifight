Cards = new Meteor.Collection('cards');
Players = new Meteor.Collection('players'); // waiting player

var clientID = "6da341adbed94c3ea669dfa249804410";
var clientSecret = "449b5590a223410dbf402fe7e174199b";
var redirectURI = 'http://localhost:3000'; // Your redirect uri

if (Meteor.isClient) {
  var buttonEnabled = false;
  var allowRemoval = false;
  var waitingForPlayer = false;
  var user=null;
  
  Template.players.events({
    "keydown #username": function(event){
      if(event.which == 13){

        user = $('#username').val();

        console.log("Username is " + user);

        // waiting players
        Players.insert( {username: user} );

        $('#loginInfo').hide();
        waitingForPlayer = true;
      } 
    },

    'click .playerLabel': function(event){
      if (waitingForPlayer) {
        var cPlayer = $(event.target);
        cPlayer.parent().children().each(function(idx, x) { $(x).removeClass('chosenPlayer'); });
        cPlayer.addClass('chosenPlayer');
      }
    }
  });

  Template.players.helpers({
    players: function() {
      console.log("user is:"+user);
      return Players.find({ username: {$ne: user} });
    },
    isUser: function() {
      return this.username !== user;
    }
  });

  Template.cards.helpers({
    cards: function() {
      return Cards.find();
    }
  });

  Template.generation.events({
    'click #initButton': function(event) {
      console.log("ttjo");
      initiate();
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
        setPlayerChoiceDone();
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

  var playerOneChoice = $.Deferred();
  var PlayerTwoChoice = $.Deferred();

  function waitForShowdown() {
    $.when(playerOneChoice,PlayerTwoChoice)
    .then(function() {
      
    });
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

if (Meteor.isServer) {
  Meteor.startup(function () {
    Cards.remove( {} );
    Players.remove( {} );
  });

}

function initiate() {
  console.log("tjenis");
 var user_id = $('#userID').val();
 var playlist_id = $('#playlistID').val(); 
 console.log("din mamma");
 
 $.ajax({
  url: 'https://accounts.spotify.com/authorize',
  headers : {'Access-Control-Allow-Origin': redirectURI},
  data: {
    client_id : clientID,
    response_type : 'code',
    redirect_uri: redirectURI
  },
  success: function(response){ 
    $.ajax({
      url: 'https://accounts.spotify.com/api/token',
      crossDomain: true,
      data: {
        grant_type : 'authorization_code',
        code : response.code,
        redirect_uri : redirectURI,
        client_id : clientID,
        client_secret : clientSecret
      },
      success: function(response) {
        console.log(response)
        var accessToken = response.access_token;
        generateCards(user_id,playlist_id,accessToken);
      }
    })
  }
 })
}

function generateCards(user_id,playlist_id,accessToken) {
  console.log("nein");
  $.ajax({
                url: 'https://api.spotify.com/v1/users/' + user_id + '/playlist/' + playlist_id + '/tracks',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                success: function(response) {
                    console.log(response);
                    tracks = response.items
                    for (var track in tracks) {
                      Cards.insert ({cardname: track.name, attack: track.popularity, defense: (100 - track.popularity), url: "lulz.com"})
                    }
                }
            });
}
