Cards = new Meteor.Collection('cards');
Players = new Meteor.Collection('players'); // waiting player

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
<<<<<<< HEAD
    Players.remove( {} );
    Cards.insert( {cardname: "Michael Jacksson",    attack: 10, defense: 2,   url: "http://i2.cdnds.net/13/12/618x867/michael-jackson-mugshot.jpg" } );
    Cards.insert( {cardname: "Ozzy Osbourne",       attack: 3,  defense: 7,   url: "http://cps-static.rovicorp.com/3/JPG_400/MI0003/538/MI0003538195.jpg?partner=allrovi.com" } );
    Cards.insert( {cardname: "Mick Jagger",         attack: 5,  defense: 5,   url: "http://4.bp.blogspot.com/-dtv-4JoDabU/T-_onzjcwHI/AAAAAAAAAbU/TuG902lIGME/s320/mick-jagger-old_pic4_us1.jpg" } );
    Cards.insert( {cardname: "Def Leppard Drummer", attack: 14, defense: 1,   url: "http://s3.amazonaws.com/rapgenius/public-transport-guide.jpg" } );    
    Cards.insert( {cardname: "Hammerfall",          attack: 1,  defense: 14,  url: "http://upload.wikimedia.org/wikipedia/hr/c/c8/Hammerfall_logo.jpg" });
=======
    Cards.insert( {cardname: "Michael Jacksson",    attack: 10, defense: 2,   health: 2,  url: "http://i2.cdnds.net/13/12/618x867/michael-jackson-mugshot.jpg" } );
    Cards.insert( {cardname: "Ozzy Osbourne",       attack: 3,  defense: 7,   health: 7,  url: "http://cps-static.rovicorp.com/3/JPG_400/MI0003/538/MI0003538195.jpg?partner=allrovi.com" } );
    Cards.insert( {cardname: "Mick Jagger",         attack: 5,  defense: 5,   health: 5,  url: "http://4.bp.blogspot.com/-dtv-4JoDabU/T-_onzjcwHI/AAAAAAAAAbU/TuG902lIGME/s320/mick-jagger-old_pic4_us1.jpg" } );
    Cards.insert( {cardname: "Def Leppard Drummer", attack: 14, defense: 1,   health: 14, url: "http://s3.amazonaws.com/rapgenius/public-transport-guide.jpg" } );    
    Cards.insert( {cardname: "Hammerfall",          attack: 1,  defense: 14,  health: 14, url: "http://upload.wikimedia.org/wikipedia/hr/c/c8/Hammerfall_logo.jpg" });
>>>>>>> battleLogic
    //Cards.insert( {cardname: "Jonas Brothers",      attack: 0,  defense: 1,   url: "http://www.wallyc.com/wp-content/uploads/2014/05/jonas-brothers-wallpaper-5.jpg"} );
  });

}
