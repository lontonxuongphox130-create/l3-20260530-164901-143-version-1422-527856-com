import { H as Hls } from './hls-vendor-dru42stk.js';

function setupPlayer(shell) {
  var video = shell.querySelector('video');
  var button = shell.querySelector('.play-overlay');
  var message = shell.querySelector('.player-message');
  var primarySource = shell.getAttribute('data-video-src');
  var fallbackSource = shell.getAttribute('data-fallback-src');
  var hlsInstance = null;
  var triedFallback = false;

  function setMessage(text) {
    if (message) {
      message.textContent = text || '';
    }
  }

  function destroyHls() {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  }

  function loadSource(source) {
    destroyHls();
    setMessage('正在加载播放源...');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      setMessage('播放源已加载');
      return;
    }

    if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
        setMessage('播放源已加载');
      });
      hlsInstance.on(Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal && fallbackSource && !triedFallback && source !== fallbackSource) {
          triedFallback = true;
          loadSource(fallbackSource);
          video.play().catch(function () {});
        } else if (data && data.fatal) {
          setMessage('当前浏览器无法继续播放该视频源');
        }
      });
      return;
    }

    video.src = fallbackSource || source;
    setMessage('已使用浏览器默认播放模式');
  }

  if (!video || !button || !primarySource) {
    return;
  }

  button.addEventListener('click', function () {
    shell.classList.add('is-playing');
    video.setAttribute('controls', 'controls');
    loadSource(primarySource);
    video.play().catch(function () {
      setMessage('播放已准备好，请再次点击视频开始播放');
    });
  });

  video.addEventListener('error', function () {
    if (fallbackSource && !triedFallback) {
      triedFallback = true;
      loadSource(fallbackSource);
      video.play().catch(function () {});
    }
  });
}

document.querySelectorAll('[data-video-player]').forEach(setupPlayer);
