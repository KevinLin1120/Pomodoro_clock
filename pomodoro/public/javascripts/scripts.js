window.onSpotifyWebPlaybackSDKReady = () => {
    const token = 'BQAjOztlLSp5l47k2f9SwDPMwmlBdtcWPE1mphKe9NM4m_8b6jZDN348zO37PCcpa1awe3yyIqfa_X_urTgOkGP6S6s3Vl8BvBX6lSXO04YEgw61uzXZW9A2-mDdPIltjzTl2fUq9E5xW7gRtcKPlbjIAFc6F_1DEuk2zem2Qa4aU9BQhI_6MTkNjxX_-EDGUWiC0HaPhMzD51FQK3SbAdBGajU';
    const player = new Spotify.Player({
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: cb => { cb(token); },
      volume: 0.5
    });

    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    player.addListener('initialization_error', ({ message }) => { 
        console.error(message);
    });
  
    player.addListener('authentication_error', ({ message }) => {
        console.error(message);
    });
  
    player.addListener('account_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('autoplay_failed', () => {
        console.log('Autoplay is not allowed by the browser autoplay rules');
    });

    // Play toggle
    document.getElementById('togglePlay').onclick = function() {
        player.togglePlay().then(() => {
            console.log('Toggled playback!');
            document.getElementById('play').src = document.getElementById('play').src == 'http://127.0.0.1:3000/images/icons/icons8-play-button-circled.svg' ?
            '/images/icons/pause.svg' : '/images/icons/icons8-play-button-circled.svg';
        });
    };

    // Play next song
    player.nextTrack().then(() => {
        console.log('Skipped to next track!');
    });

    // document.getElementById('auth').onclick = function() {
    //     player.activateElement();
    //     console.log("auth");
    // };
    // myActivateElementButton.addEventListener('click', () => {
    //     // The player is activated. The player will keep the playing state once the state is transferred from other applications.
    //     player.activateElement();
    //   });
    player.connect();
}
