(function () {
  function showMessage(messageNode, text) {
    if (!messageNode) {
      return;
    }
    messageNode.textContent = text;
    messageNode.hidden = false;
  }

  function hideMessage(messageNode) {
    if (messageNode) {
      messageNode.hidden = true;
      messageNode.textContent = '';
    }
  }

  function initPlayer(shell) {
    var video = shell.querySelector('.js-player');
    var button = shell.querySelector('.js-play-button');
    var message = shell.querySelector('.js-player-message');
    var streamUrl = shell.getAttribute('data-stream');
    var hlsInstance = null;
    var started = false;

    if (!video || !button) {
      return;
    }

    function playVideo() {
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          showMessage(message, '浏览器阻止了自动播放，请再次点击播放器开始播放。');
        });
      }
    }

    function start() {
      if (started) {
        playVideo();
        return;
      }
      started = true;
      hideMessage(message);
      button.hidden = true;

      if (!streamUrl) {
        showMessage(message, '当前影片未绑定播放源。');
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', playVideo, { once: true });
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
        hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            showMessage(message, '网络加载异常，正在尝试恢复播放源。');
            hlsInstance.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            showMessage(message, '媒体解码异常，正在尝试恢复播放。');
            hlsInstance.recoverMediaError();
          } else {
            showMessage(message, '视频加载失败，请稍后重试或更换浏览器。');
            hlsInstance.destroy();
          }
        });
        return;
      }

      showMessage(message, '当前浏览器不支持 HLS 播放，请使用 Chrome、Edge、Safari 或移动端浏览器访问。');
    }

    button.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (!started) {
        start();
      }
    });
    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var shells = Array.prototype.slice.call(document.querySelectorAll('.js-player-shell'));
    shells.forEach(initPlayer);
  });
})();
