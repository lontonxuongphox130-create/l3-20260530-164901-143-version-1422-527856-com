(function () {
  window.initPlayer = function (videoUrl) {
    var video = document.getElementById('player');
    var cover = document.querySelector('.player-cover');
    var buttons = Array.prototype.slice.call(document.querySelectorAll('.play-action'));
    var prepared = false;
    var hls = null;

    if (!video || !videoUrl) {
      return;
    }

    function prepare() {
      if (prepared) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
      } else {
        video.src = videoUrl;
      }
      prepared = true;
    }

    function start() {
      prepare();
      if (cover) {
        cover.classList.add('is-hidden');
      }
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', start);
    });
    if (cover) {
      cover.addEventListener('click', start);
    }
    video.addEventListener('click', function () {
      if (!prepared) {
        start();
      }
    });
    window.addEventListener('pagehide', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  };
})();
