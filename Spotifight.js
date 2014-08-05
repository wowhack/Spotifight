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
    'click #login': function(event) {
      login();
    }
  });

  function login() {
      console.log("I login()");
      var width = 400,
          height = 500;
      var left = (screen.width / 2) - (width / 2);
      var top = (screen.height / 2) - (height / 2);
      
      var params = {
          client_id: '6da341adbed94c3ea669dfa249804410',
          redirect_uri: 'http://localhost:3000/callback',
          scope: 'user-read-private playlist-read-private',
          response_type: 'token'
      };
      authwindow = window.open(
          "https://accounts.spotify.com/authorize?" + toQueryString(params),
          "Spotify",
          'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
          );
  }

  window.addEventListener("message", receiveMessage, false);

  function receiveMessage(event){
      console.log("I receivemessage");
      if (event.origin !== "http://localhost:3000") {
          return;
      }
      if (authWindow) {
          console.log("Stänger")
          authWindow.close();
      }
      generateCards(event.data);
  }

  function toQueryString(obj) {
    var parts = [];
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
        }
    }
    return parts.join("&");
  }

  var authWindow = null;

  var token = null;

  function generateCards(accessToken) {
    token = accessToken;
    // fetch my public playlists
    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function(response) {         
            var user_id = response.id.toLowerCase();         
            $.ajax({
                url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                success: function(response) {
                    console.log(response);
                    playlistsListPlaceholder.innerHTML = playlistsListTemplate(response.items);
                }
            });
         
            $('div#login').hide();
            $('div#loggedin').show();
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
