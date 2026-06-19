(function () {
    function startPlayer(box) {
        var video = box.querySelector("video");
        var url = box.getAttribute("data-video");
        if (!video || !url) return;
        if (box.getAttribute("data-ready") !== "1") {
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(url);
                hls.attachMedia(video);
                box._hls = hls;
            } else {
                video.src = url;
            }
            box.setAttribute("data-ready", "1");
        }
        box.classList.add("is-playing");
        video.play().catch(function () {
            box.classList.remove("is-playing");
        });
    }

    function init() {
        document.querySelectorAll("[data-player]").forEach(function (box) {
            var button = box.querySelector("[data-play-button]");
            if (button) {
                button.addEventListener("click", function (event) {
                    event.preventDefault();
                    startPlayer(box);
                });
            }
            box.addEventListener("click", function (event) {
                if (event.target.tagName && event.target.tagName.toLowerCase() === "video") return;
                if (!box.classList.contains("is-playing")) {
                    startPlayer(box);
                }
            });
        });
    }

    if (document.readyState !== "loading") {
        init();
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }
})();
