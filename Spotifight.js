Cards = new Meteor.Collection('cards');

if (Meteor.isClient) {
  var buttonEnabled = false;
  var allowRemoval = false;
  
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

  Template.cards.helpers(
  {
    cards: function() {
      return Cards.find();
    }
  }
  );

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
        $(activeCard);
      }
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Cards.remove( {} );
    Cards.insert( {cardname: "Michael Jacksson",    attack: 10, defense: 2,   url: "http://i2.cdnds.net/13/12/618x867/michael-jackson-mugshot.jpg" } );
    Cards.insert( {cardname: "Ozzy Osbourne",       attack: 3,  defense: 7,   url: "http://cps-static.rovicorp.com/3/JPG_400/MI0003/538/MI0003538195.jpg?partner=allrovi.com" } );
    Cards.insert( {cardname: "Mick Jagger",         attack: 5,  defense: 5,   url: "http://4.bp.blogspot.com/-dtv-4JoDabU/T-_onzjcwHI/AAAAAAAAAbU/TuG902lIGME/s320/mick-jagger-old_pic4_us1.jpg" } );
    Cards.insert( {cardname: "Def Leppard Drummer", attack: 14, defense: 1,   url: "http://s3.amazonaws.com/rapgenius/public-transport-guide.jpg" } );    
    Cards.insert( {cardname: "Hammerfall",          attack: 1,  defense: 14,  url: "http://upload.wikimedia.org/wikipedia/hr/c/c8/Hammerfall_logo.jpg" });
    //Cards.insert( {cardname: "Jonas Brothers",      attack: 0,  defense: 1,   url: "http://www.wallyc.com/wp-content/uploads/2014/05/jonas-brothers-wallpaper-5.jpg"} );
  });
}
