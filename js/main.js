var player;

window.onload = function() {
  setupPlayer();
  setupControllerEvents();
}

function setupPlayer() {

  // add all necessary (and loaded) modules to the player core
  bitmovin.player.core.Player.addModule(window.bitmovin.player.polyfill.default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player['engine-bitmovin'].default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player['container-mp4'].default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player['container-ts'].default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player.mserenderer.default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player.abr.default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player.drm.default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player.xml.default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player.dash.default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player.hls.default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player.crypto.default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player.style.default);
  bitmovin.player.core.Player.addModule(window.bitmovin.player.tizen.default);

  var bufferConfig = {};
  var bufferLevels = {};
  bufferLevels[bitmovin.player.core.BufferType.ForwardDuration] = 30;
  bufferLevels[bitmovin.player.core.BufferType.BackwardDuration] = 10,
  bufferConfig[bitmovin.player.core.MediaType.Video] = bufferLevels;
  bufferConfig[bitmovin.player.core.MediaType.Audio] = bufferLevels;

  var conf = {
    key : "1a69b597-a4b2-4bf7-99ba-bd417397c111",
    playback : {
      autoplay : true,
    },
    tweaks : {
      file_protocol : true,
      app_id : "com.bitmovin.demo.webapp",
      BACKWARD_BUFFER_PURGE_INTERVAL: 10,
    },
    analytics : {
      videoId: 'YOUR VIDEO ID',
      title: 'A descriptive video title'
    },
    buffer: bufferConfig,
    ui: false,
  };

  var source = {
    // Non DRM AVC Stream
    //dash : "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd",
    // HEVC Stream
    //dash : "https://bitmovin-a.akamaihd.net/content/multi-codec/hevc/stream.mpd"
      
    //DRM AVC Stream
    dash: 'https://bitmovin-a.akamaihd.net/content/art-of-motion_drm/mpds/11331.mpd',
    drm: {
    //  widevine support is only acceptable from Tizen2017 onward, use playready instead
    //  widevine: { LA_URL: 'https://widevine-proxy.appspot.com/proxy' }
      playready: { utf8message: true, plaintextChallenge: true, headers: { 'Content-Type': 'text/xml' } },
    },
    title: 'Art of Motion',
  };

  var container = document.getElementById('player');

  player = new bitmovin.player.core.Player(container, conf);

  var uiManager = new bitmovin.playerui.UIFactory.buildDefaultTvUI(player);

  player.load(source);

  player.on(bitmovin.player.core.PlayerEvent.Warning, function(data) {
    console.log("Warning Event: " + JSON.stringify(data));
  });

  player.on(bitmovin.player.core.PlayerEvent.Error, function(data) {
    console.log("Error Event: " + JSON.stringify(data));
  });
}

function setupControllerEvents() {
  tizen.tvinputdevice.registerKey('MediaPlayPause');
  tizen.tvinputdevice.registerKey('ColorF0Red');

  // add eventListener for keydown
  document.addEventListener('keydown', function(e) {
    switch (e.keyCode) {
      case tizen.tvinputdevice.getKey('MediaPlayPause').code:
        if (player.isPlaying()) {
          player.pause();
        } else {
          player.play();
        }
        break;
      case 37: // LEFT arrow
        break;
      case 38: // UP arrow
        break;
      case 39: // RIGHT arrow
        break;
      case 40: // DOWN arrow
        break;
      case 13: // OK button
        break;
      case 10009: // RETURN button
        tizen.application.getCurrentApplication().exit();
        break;
      default:
        console.log('Key code : ' + e.keyCode);
        break;
    }
  });
}
