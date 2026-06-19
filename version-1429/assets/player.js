(function () {
  "use strict";

  window.initializeMoviePlayer = function (source) {
    var video = document.querySelector("[data-player-video]");
    var button = document.querySelector("[data-player-button]");
    var attached = false;
    var hls = null;

    if (!video || !button || !source) {
      return;
    }

    function attachStream() {
      if (attached) {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }

      attached = true;
    }

    function startPlayback() {
      attachStream();
      button.classList.add("is-hidden");
      var attempt = video.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function () {
          button.classList.remove("is-hidden");
        });
      }
    }

    button.addEventListener("click", startPlayback);

    video.addEventListener("click", function () {
      if (video.paused) {
        startPlayback();
      }
    });

    video.addEventListener("play", function () {
      button.classList.add("is-hidden");
    });

    video.addEventListener("ended", function () {
      button.classList.remove("is-hidden");
    });

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  };
})();
