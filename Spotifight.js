Cards = new Meteor.Collection('cards');

var clientID = "6da341adbed94c3ea669dfa249804410";
var clientSecret = "449b5590a223410dbf402fe7e174199b";
var redirectURI = 'http://localhost:3000'; // Your redirect uri

var authWindow = null;


if (Meteor.isClient) {
  Template.cards.helpers({
    cards: function() {
      return Cards.find();
    }
  });

  Template.generation.events({
    'click #login': function(event) {
      login();
    }
  });


  function receiveMessage(event){
      if (event.origin !== "http://localhost:3000") {
          return;
      }
      if (authWindow) {
          authWindow.close();
      }
      generateCards(event.data);
  }

  function login() {
      console.log("I login()");
      var width = 400,
          height = 500;
      var left = (screen.width / 2) - (width / 2);
      var top = (screen.height / 2) - (height / 2);
      
      var params = {
          client_id: '5fe01282e94241328a84e7c5cc169164',
          redirect_uri: 'http://jsfiddle.net/3744J/2/show/',
          scope: 'user-read-private playlist-read-private',
          response_type: 'token'
      };
      authwindow = window.open(
          "https://accounts.spotify.com/authorize?" + toQueryString(params),
          "Spotify",
          'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
          );
  }

  function generateCards(accessToken) {
    console.log("nein");
    $.ajax({
          url: 'https://api.spotify.com/v1/me',
          headers: {
              'Authorization': 'Bearer ' + accessToken
          },
          success: function(response) {
              var data = response;
              
              $('div#login').hide();
              $('div#loggedin').show();
          }
      });

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
