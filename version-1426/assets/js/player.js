(function () {
    function playVideo(video, overlay) {
        var streamUrl = video.getAttribute('data-stream');

        if (!streamUrl) {
            return;
        }

        if (overlay) {
            overlay.classList.add('is-hidden');
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            if (!video.getAttribute('src')) {
                video.setAttribute('src', streamUrl);
            }
            video.play().catch(function () {});
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            if (!video.hlsReady) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
                video.hlsReady = hls;
            } else {
                video.play().catch(function () {});
            }
        }
    }

    var overlays = Array.prototype.slice.call(document.querySelectorAll('[data-play-video]'));

    overlays.forEach(function (overlay) {
        var videoId = overlay.getAttribute('data-play-video');
        var video = document.getElementById(videoId);

        if (!video) {
            return;
        }

        overlay.addEventListener('click', function () {
            playVideo(video, overlay);
        });

        video.addEventListener('click', function () {
            if (video.paused) {
                playVideo(video, overlay);
            }
        });

        video.addEventListener('play', function () {
            overlay.classList.add('is-hidden');
        });
    });
})();
