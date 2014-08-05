Cards = new Meteor.Collection('cards');
var nrOfCards = 0;
var clientID = "6da341adbed94c3ea669dfa249804410";
var clientSecret = "449b5590a223410dbf402fe7e174199b";
var redirectURI = 'http://localhost:3000'; // Your redirect uri


if (Meteor.isClient) {
  Template.cards.helpers({
    cards: function() {
      return Cards.find();
    }
  });
Session.set("notEnoughCards",true);

  Template.generation.events({
    'click #initButton': function(event) {
      addCard ($("#songname").val());
      nrOfCards++;
      if (nrOfCards >= 10) {
        $("#addCard").fadeOut();
        Session.set("notEnoughCards",false);
      }
    }
  });
  
  Template.generation.notEnoughCards = function(){
    return Session.get("notEnoughCards");
  }
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
    Cards.remove( {});
  })
}