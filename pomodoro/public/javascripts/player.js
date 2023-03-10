// Wait for player to be ready
window.onSpotifyWebPlaybackSDKReady = () => {
    let token = getCookie("spotify_token");
    const player = new Spotify.Player({
      name: "PomoClock Web Player",
      getOAuthToken: (cb) => {
        cb(token);
      },
      volume: 0.5,
    });
    // console.log(player);
  
    // Player Ready
    player.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id);
  
      // After player is ready, change current device to this player
      const connect_to_device = () => {
        console.log("Changing to device");
        let change_device = fetch("https://api.spotify.com/v1/me/player", {
          method: "PUT",
          body: JSON.stringify({
            device_ids: [device_id],
            play: false,
          }),
          headers: new Headers({
            Authorization: "Bearer " + token,
          }),
        }).then((response) => console.log(response));
      };
      connect_to_device();
    });
  
    // Not Ready
    player.addListener("not_ready", ({ device_id }) => {
      console.log("Device ID has gone offline", device_id);
    });
  
    // Error Handling
    player.addListener("initialization_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("authentication_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("account_error", ({ message }) => {
      console.error(message);
    });
  
    // Start device connection
    player.connect().then((success) => {
      if (success) {
        console.log("The Web Playback SDK successfully connected to Spotify!");
      }
    });

    // Play toggle
    document.getElementById('togglePlay').onclick = function() {
        player.togglePlay().then(() => {
            console.log('Toggled playback!');
            document.getElementById('play').src = document.getElementById('play').src ==
             'http://127.0.0.1:3000/images/icons/icons8-play-button-circled.svg' ?
            '/images/icons/pause.svg' : '/images/icons/icons8-play-button-circled.svg';
        }).then(() => {
             // Update playing content info
            getCurrentState(player, 1);
        });
        // Update playing content info
        getCurrentState(player, 1);
       
    };
    
    // Play previous song
    document.getElementById('previous').onclick = function(){
        player.previousTrack().then(() => {
            console.log('Set to previous track!');
        }).then(() => {
            // Update playing content info
            getCurrentState(player, 0);
        });
        // Update playing content info
        getCurrentState(player, 0);
    }

    // Play next song
    document.getElementById('next').onclick = function(){
        player.nextTrack().then(() => {
            console.log('Skipped to next track!');
        }).then(() => {
            // Update playing content info
            getCurrentState(player, 2);
        });
        // Update playing content info
        getCurrentState(player, 2);
    }
  };
  
  // Play selected song
  const play_song = async (uri) => {
      console.log("Changing song");
      let request_answer = await fetch(
        "https://api.spotify.com/v1/me/player/play",
        {
          method: "PUT",
          body: JSON.stringify({
            uris: [uri],
          }),
          headers: new Headers({
            Authorization: "Bearer " + token,
          }),
        }
      ).then((data) => console.log(data));
    };

  // Get playing status
function getCurrentState(player, which){
    player.getCurrentState().then(state => {
        if (!state) {
          console.error('User is not playing music through the Web Playback SDK');
          return;
        }
    
        var current_track = state.track_window.current_track;
        var next_track = state.track_window.next_tracks[0];
        var previous_track = state.track_window.previous_tracks[1];
        
        // Update playing song name
        document.getElementById('playing-name').innerText = current_track.name;
        // Update playing album img
        switch(which){
            // Previous
            case 0:
                document.getElementById('playing-name').innerText
                 = previous_track.name;
                document.getElementById('album').src
                 = previous_track.album.images[1].url;
                break;
            // Current
            case 1:
                document.getElementById('playing-name').innerText
                 = current_track.name;
                document.getElementById('album').src
                 = current_track.album.images[1].url;
                break;
            // Next
            case 2:
                document.getElementById('playing-name').innerText
                 = next_track.name;
                document.getElementById('album').src
                 = next_track.album.images[1].url;
                break;
        }
        
        // console.log(state.track_window);
        // console.log('Currently Playing', current_track);
        // console.log('Playing Next', next_track);
    });
}