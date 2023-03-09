// App client id
const client_id = '2e351bd6e1264b15a8feef4f9f944a3c';
// App client secret
const client_secret = '7775c7a39d1740ddaac0551832c5462e';
// After auth or access denied, redirect to index page
const redirect_uri = 'http://127.0.0.1:3000/spotify/callback';
const scope = 'user-read-private user-read-email streaming';

$().ready(function(){
    // If the user not logging
    // let token = localStorage.getItem('spotify_token');
    let token = getCookie("spotify_token");
    
    // If not login
    if(token == null || token == ""){
        console.log("Doesn't get spotify token");
        $('#spotifyContent').append(
            // #spotify-login-btn(href="/spotify/login") | Spotify Login 
            '<button type="button"' + 
            'class="btn btn-success d-block w-50  mx-auto"' + 
            'id="#spotify-login-btn"' + 
            'onclick="userLogInRequest();">'+
            'Spotify Login '+'</button>' +
            '<br>'+
            '<p class="text-dark">Only available for Spotify Premiere account!</p>'
        );
    }
    // Show the spotify controller 
    else{
        $('#spotifyContent').append(
            '<h1>Login success!</h1>'+
            // '<button id="togglePlay">Toggle Play</button>'+
            '<button id="spotifyLogout">Logout</button>'
        );
        // Add play SDK
        var script = document.createElement('script');
        script.src= "https://sdk.scdn.co/spotify-player.js";
        document.head.appendChild(script);
        
        // Add player script
        script = document.createElement('script');
        script.src= "/javascripts/player.js";
        document.head.appendChild(script);
    }
});

// Random character generator
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function generateRandomString(length){
    const charactersLength = characters.length;
    let result = '';
    for(let i = 0; i< length; i++){
        result += characters[Math.floor(Math.random()*charactersLength)];
    }
    return result;
}

// User log in request on button click
const userLogInRequest = () => {
    var state = generateRandomString(16);
    const params = new URLSearchParams(location.search);
    params.set('response_type', 'code');
    params.set('client_id', client_id);
    params.set('scope', scope);
    params.set('redirect_uri', redirect_uri);
    params.set('state', state);
    console.log(params.toString());

    let logInUri = 'https://accounts.spotify.com/authorize' +
        `?client_id=${client_id}` +
        '&response_type=code' +
        `&redirect_uri=${redirect_uri}` +
        `&scope=${scope}` +
        '&show_dialog=true';

    // Debug
    // console.log(logInUri);
    
    // Open URL to request user log in from Spotify
    window.location = logInUri;
}

// Get cookie 
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      // Find cookie name
      if (c.indexOf(name) == 0) {
        // Return cookie value
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

//=================

// Check whether have logged in spotify account
// function spotifyLogin(){
//   // Haven't logged in
//   access_token = getCookie('spotify-access-token');
//   console.log("token: "+ access_token);
//   if(access_token == ''){
//     document.getElementById('spotify-login-btn').style.display = "block";
//   }
//   else{
//     document.getElementById('spotify-login-btn').style.display = "none";
//   }
// }

// // Get playing status
// function getCurrentState(player, which){
//     player.getCurrentState().then(state => {
//         if (!state) {
//           console.error('User is not playing music through the Web Playback SDK');
//           return;
//         }
    
//         var current_track = state.track_window.current_track;
//         var next_track = state.track_window.next_tracks[0];
//         var previous_track = state.track_window.previous_tracks[1];
        
//         // Update playing song name
//         document.getElementById('playing-name').innerText = current_track.name;
//         // Update playing album img
//         switch(which){
//             // Previous
//             case 0:
//                 document.getElementById('playing-name').innerText
//                  = previous_track.name;
//                 document.getElementById('album').src
//                  = previous_track.album.images[1].url;
//                 break;
//             // Current
//             case 1:
//                 document.getElementById('playing-name').innerText
//                  = current_track.name;
//                 document.getElementById('album').src
//                  = current_track.album.images[1].url;
//                 break;
//             // Next
//             case 2:
//                 document.getElementById('playing-name').innerText
//                  = next_track.name;
//                 document.getElementById('album').src
//                  = next_track.album.images[1].url;
//                 break;
//         }
        
//         // console.log(state.track_window);
//         // console.log('Currently Playing', current_track);
//         // console.log('Playing Next', next_track);
//     });
// }



// window.onSpotifyWebPlaybackSDKReady = () => {
//     const token = access_token;
//     const player = new Spotify.Player({
//       name: 'Kevin',
//         getOAuthToken:cb =>{cb:token}
//       volume: 0.5
//     });

//     // Ready
//     player.addListener('ready', ({ device_id }) => {
//         console.log('Ready with Device ID', device_id);
//     });

//     // Not Ready
//     player.addListener('not_ready', ({ device_id }) => {
//         console.log('Device ID has gone offline', device_id);
//     });

//     player.addListener('initialization_error', ({ message }) => { 
//         console.error(message);
//     });
  
//     player.addListener('authentication_error', ({ message }) => {
//         console.error(message);
//     });
  
//     player.addListener('account_error', ({ message }) => {
//         console.error(message);
//     });

//     player.addListener('autoplay_failed', () => {
//         console.log('Autoplay is not allowed by the browser autoplay rules');
//     });

//     // Play toggle
//     document.getElementById('togglePlay').onclick = function() {
//         player.togglePlay().then(() => {
//             console.log('Toggled playback!');
//             document.getElementById('play').src = document.getElementById('play').src ==
//              'http://127.0.0.1:3000/images/icons/icons8-play-button-circled.svg' ?
//             '/images/icons/pause.svg' : '/images/icons/icons8-play-button-circled.svg';
//         }).then(() => {
//              // Update playing content info
//             getCurrentState(player, 1);
//         });
//         // Update playing content info
//         getCurrentState(player, 1);
       
//     };
    
//     // Play previous song
//     document.getElementById('previous').onclick = function(){
//         player.previousTrack().then(() => {
//             console.log('Set to previous track!');
//         }).then(() => {
//             // Update playing content info
//             getCurrentState(player, 0);
//         });
//         // Update playing content info
//         getCurrentState(player, 0);
//     }

//     // Play next song
//     document.getElementById('next').onclick = function(){
//         player.nextTrack().then(() => {
//             console.log('Skipped to next track!');
//         }).then(() => {
//             // Update playing content info
//             getCurrentState(player, 2);
//         });
//         // Update playing content info
//         getCurrentState(player, 2);
//     }
//     player.connect();
// }

