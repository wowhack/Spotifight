Cards = new Meteor.Collection('cards');


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

function getListInfo(user_id,playlist_id,accessToken) {
 $.ajax({
                url: 'https://api.spotify.com/v1/users/' + user_id + '/playlist/' + playlist_id + '/tracks',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                success: function(response) {
                    console.log(response);
                    tracks = response.items
                    var c = []
                    for (var track in tracks) {
                      Cards.insert ({cardname: track.name, attack: track.popularity, defense: (100 - track.popularity), url: "lulz.com"})
                    }
                }
            });
}

playlistsListPlaceholder.addEventListener('click', function(e) {
    var target = e.target;
    if (target !== null && target.classList.contains('load')) {
        e.preventDefault();
        var link = target.getAttribute('data-link');
               
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function(response) {
                console.log(response);
                playlistDetailPlaceholder.innerHTML = playlistDetailTemplate(response);
            }
        });
    }
});
