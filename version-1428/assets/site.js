(function () {
  function queryAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initMobileMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initHero() {
    var slides = queryAll('[data-hero-slide]');
    var dots = queryAll('[data-hero-dot]');
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    show(0);
    start();
  }

  function initFilters() {
    queryAll('[data-filter-panel]').forEach(function (panel) {
      var container = panel.parentNode;
      var list = container ? container.querySelector('[data-card-list]') : null;
      var search = panel.querySelector('[data-card-search]');
      var buttons = queryAll('[data-filter-type]', panel);
      var activeType = 'all';
      var cards = list ? queryAll('[data-movie-id]', list) : [];

      if (search && search.hasAttribute('data-read-query')) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q) {
          search.value = q;
        }
      }

      function normalize(value) {
        return String(value || '').toLowerCase().trim();
      }

      function apply() {
        var keyword = normalize(search ? search.value : '');
        cards.forEach(function (card) {
          var haystack = normalize(card.innerText + ' ' + card.getAttribute('data-title') + ' ' + card.getAttribute('data-year') + ' ' + card.getAttribute('data-region') + ' ' + card.getAttribute('data-type') + ' ' + card.getAttribute('data-category'));
          var type = card.getAttribute('data-type') || '';
          var typeMatched = activeType === 'all' || type.indexOf(activeType) !== -1 || haystack.indexOf(normalize(activeType)) !== -1;
          var keywordMatched = !keyword || haystack.indexOf(keyword) !== -1;
          card.classList.toggle('is-hidden-by-filter', !(typeMatched && keywordMatched));
        });
      }

      if (search) {
        search.addEventListener('input', apply);
      }

      buttons.forEach(function (button) {
        button.addEventListener('click', function () {
          activeType = button.getAttribute('data-filter-type') || 'all';
          buttons.forEach(function (item) {
            item.classList.toggle('active', item === button);
          });
          apply();
        });
      });

      apply();
    });
  }

  function initPlayers() {
    queryAll('[data-player]').forEach(function (shell) {
      var video = shell.querySelector('video');
      var button = shell.querySelector('[data-play-button]');
      var src = shell.getAttribute('data-src');

      if (!video || !button || !src) {
        return;
      }

      function loadAndPlay() {
        shell.classList.add('is-playing');

        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
          video.addEventListener('loadedmetadata', function () {
            video.play().catch(function () {});
          }, { once: true });
        } else {
          video.src = src;
          video.play().catch(function () {});
        }
      }

      button.addEventListener('click', loadAndPlay);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initHero();
    initFilters();
    initPlayers();
  });
})();
