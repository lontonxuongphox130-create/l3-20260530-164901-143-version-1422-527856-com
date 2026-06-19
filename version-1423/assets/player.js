(function() {
  function setupPlayer(root) {
    var video = root.querySelector('video');
    var button = root.querySelector('[data-play-button]');
    var message = root.querySelector('[data-player-message]');
    var playlist = video ? video.getAttribute('data-play') : '';
    var ready = false;
    var hls = null;

    function say(text) {
      if (message) {
        message.textContent = text || '';
      }
    }

    function attach() {
      if (!video || !playlist || ready) {
        return;
      }
      ready = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = playlist;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(playlist);
        hls.attachMedia(video);
      } else {
        video.src = playlist;
      }
      video.controls = true;
    }

    function play() {
      attach();
      if (!video) {
        return;
      }
      if (button) {
        button.hidden = true;
      }
      say('正在载入');
      var started = video.play();
      if (started && typeof started.then === 'function') {
        started.then(function() {
          say('');
        }).catch(function() {
          say('点击视频继续播放');
          if (button) {
            button.hidden = false;
          }
        });
      } else {
        say('');
      }
    }

    if (button) {
      button.addEventListener('click', play);
    }

    if (video) {
      video.addEventListener('click', function() {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener('playing', function() {
        say('');
      });
      video.addEventListener('error', function() {
        say('播放暂不可用');
      });
    }

    window.addEventListener('pagehide', function() {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
})();
