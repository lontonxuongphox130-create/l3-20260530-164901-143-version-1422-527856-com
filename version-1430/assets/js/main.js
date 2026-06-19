(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function initMobileNav() {
    var button = document.querySelector(".mobile-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function initHero() {
    var slider = document.querySelector("[data-hero-slider]");
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
    if (slides.length <= 1) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5600);
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-index")) || 0);
        restart();
      });
    });

    start();
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll(".js-player"));
    players.forEach(function (box) {
      var video = box.querySelector("video");
      var overlay = box.querySelector(".player-overlay");
      var src = box.getAttribute("data-stream");
      var hls = null;
      var loaded = false;

      function attach() {
        if (!video || !src || loaded) {
          return;
        }
        loaded = true;
        video.setAttribute("controls", "controls");
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = src;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(src);
          hls.attachMedia(video);
        } else {
          video.src = src;
        }
      }

      function play() {
        attach();
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {});
        }
      }

      if (overlay) {
        overlay.addEventListener("click", play);
      }

      if (video) {
        video.addEventListener("play", function () {
          if (overlay) {
            overlay.classList.add("is-hidden");
          }
        });
        video.addEventListener("click", function () {
          if (!loaded) {
            play();
          }
        });
      }

      window.addEventListener("beforeunload", function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  }

  function initCardTools() {
    var grid = document.querySelector(".js-card-grid");
    if (!grid) {
      return;
    }
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
    var input = document.querySelector(".js-card-filter");
    var buttons = Array.prototype.slice.call(document.querySelectorAll(".js-sort"));

    function filterCards() {
      var q = input ? input.value.trim().toLowerCase() : "";
      cards.forEach(function (card) {
        var title = (card.getAttribute("data-title") || "").toLowerCase();
        card.classList.toggle("is-hidden-card", q && title.indexOf(q) === -1);
      });
    }

    function sortCards(type) {
      var sorted = cards.slice().sort(function (a, b) {
        if (type === "year") {
          return Number(b.getAttribute("data-year") || 0) - Number(a.getAttribute("data-year") || 0);
        }
        if (type === "title") {
          return (a.getAttribute("data-title") || "").localeCompare(b.getAttribute("data-title") || "", "zh-Hans-CN");
        }
        return Number(b.getAttribute("data-views") || 0) - Number(a.getAttribute("data-views") || 0);
      });
      sorted.forEach(function (card) {
        grid.appendChild(card);
      });
    }

    if (input) {
      input.addEventListener("input", filterCards);
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        buttons.forEach(function (item) {
          item.classList.remove("is-active");
        });
        button.classList.add("is-active");
        sortCards(button.getAttribute("data-sort") || "views");
      });
    });
  }

  function initSearchPage() {
    var results = document.getElementById("search-results");
    if (!results || !window.SEARCH_MOVIES) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var input = document.getElementById("search-input");
    var category = document.getElementById("search-category");
    var sort = document.getElementById("search-sort");
    var status = document.getElementById("search-status");
    var q = params.get("q") || "";
    if (input) {
      input.value = q;
    }

    function render() {
      var query = input ? input.value.trim().toLowerCase() : "";
      var selectedCategory = category ? category.value : "";
      var sortBy = sort ? sort.value : "views";
      var data = window.SEARCH_MOVIES.filter(function (movie) {
        var text = [movie.title, movie.oneLine, movie.category, movie.genre, movie.region, movie.type, (movie.tags || []).join(" ")].join(" ").toLowerCase();
        var okQuery = !query || text.indexOf(query) !== -1;
        var okCategory = !selectedCategory || movie.category === selectedCategory;
        return okQuery && okCategory;
      });

      data.sort(function (a, b) {
        if (sortBy === "year") {
          return Number(b.year || 0) - Number(a.year || 0);
        }
        if (sortBy === "title") {
          return a.title.localeCompare(b.title, "zh-Hans-CN");
        }
        return Number(b.views || 0) - Number(a.views || 0);
      });

      var shown = data.slice(0, 96);
      if (status) {
        status.textContent = data.length ? "找到 " + data.length + " 个相关内容" : "未找到相关内容";
      }
      results.innerHTML = shown.map(function (movie) {
        return [
          '<a class="movie-card" href="' + movie.url + '" data-title="' + escapeHtml(movie.title) + '" data-year="' + escapeHtml(movie.year) + '" data-views="' + movie.views + '">',
          '  <figure>',
          '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" />',
          '    <span class="badge">' + escapeHtml(movie.category) + '</span>',
          '    <span class="duration">' + escapeHtml(movie.duration) + '</span>',
          '  </figure>',
          '  <div class="movie-card-body">',
          '    <strong>' + escapeHtml(movie.title) + '</strong>',
          '    <p>' + escapeHtml(movie.oneLine) + '</p>',
          '    <div class="card-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + Number(movie.views).toLocaleString() + '次观看</span></div>',
          '  </div>',
          '</a>'
        ].join("");
      }).join("");
    }

    function escapeHtml(value) {
      return String(value || "").replace(/[&<>"']/g, function (char) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "\"": "&quot;",
          "'": "&#039;"
        }[char];
      });
    }

    if (input) {
      input.addEventListener("input", render);
    }
    if (category) {
      category.addEventListener("change", render);
    }
    if (sort) {
      sort.addEventListener("change", render);
    }
    render();
  }

  ready(function () {
    initMobileNav();
    initHero();
    initPlayers();
    initCardTools();
    initSearchPage();
  });
})();
