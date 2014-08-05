Cards = new Meteor.Collection('cards');

var clientID = "6da341adbed94c3ea669dfa249804410";
var clientSecret = "449b5590a223410dbf402fe7e174199b";
var redirectURI = 'http://localhost:3000'; // Your redirect uri

if (Meteor.isClient) {
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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Cards.remove( {} );
    Cards.insert( {cardname: "Michael Jacksson", attack: 10, defense: 2, url: "http://i2.cdnds.net/13/12/618x867/michael-jackson-mugshot.jpg" } );
    Cards.insert( {cardname: "Ozzy Osbourne", attack: 3, defense: 7, url: "http://cps-static.rovicorp.com/3/JPG_400/MI0003/538/MI0003538195.jpg?partner=allrovi.com" } );
    Cards.insert( {cardname: "Mick Jagger", attack: 5, defense: 5, url: "http://4.bp.blogspot.com/-dtv-4JoDabU/T-_onzjcwHI/AAAAAAAAAbU/TuG902lIGME/s320/mick-jagger-old_pic4_us1.jpg" } );
    Cards.insert( {cardname: "Def Leppard Drummer", attack: 14, defense: 1, url: "http://s3.amazonaws.com/rapgenius/public-transport-guide.jpg" } );    
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