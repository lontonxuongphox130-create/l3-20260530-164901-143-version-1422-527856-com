(function () {
  function initMobileMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.mobile-nav');
    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  function initHeroSlider() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    if (slides.length <= 1) {
      return;
    }

    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5600);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = Number(dot.getAttribute('data-hero-dot') || '0');
        show(index);
        start();
      });
    });

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      hero.addEventListener('mouseenter', stop);
      hero.addEventListener('mouseleave', start);
    }

    start();
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function initFilters() {
    var grid = document.querySelector('.js-movie-grid');
    if (!grid) {
      return;
    }

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.js-movie-card'));
    var searchInput = document.querySelector('.js-search-input');
    var regionFilter = document.querySelector('.js-region-filter');
    var typeFilter = document.querySelector('.js-type-filter');
    var yearFilter = document.querySelector('.js-year-filter');
    var sortSelect = document.querySelector('.js-sort-select');
    var visibleCount = document.querySelector('.js-visible-count');
    var emptyState = document.querySelector('.js-empty-state');

    function matches(card) {
      var query = normalize(searchInput && searchInput.value);
      var region = regionFilter ? regionFilter.value : '';
      var type = typeFilter ? typeFilter.value : '';
      var decade = yearFilter ? yearFilter.value : '';
      var haystack = normalize(card.getAttribute('data-search'));
      var cardRegion = card.getAttribute('data-region') || '';
      var cardType = card.getAttribute('data-type') || '';
      var year = Number(card.getAttribute('data-year') || '0');

      if (query && haystack.indexOf(query) === -1) {
        return false;
      }
      if (region && cardRegion !== region) {
        return false;
      }
      if (type && cardType !== type) {
        return false;
      }
      if (decade) {
        var start = Number(decade);
        if (!year || year < start || year > start + 9) {
          return false;
        }
      }
      return true;
    }

    function sortCards() {
      var mode = sortSelect ? sortSelect.value : 'score';
      cards.sort(function (a, b) {
        if (mode === 'year') {
          return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
        }
        if (mode === 'title') {
          return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-CN');
        }
        if (mode === 'latest') {
          return 0;
        }
        return Number(b.getAttribute('data-score')) - Number(a.getAttribute('data-score'));
      });
      cards.forEach(function (card) {
        grid.appendChild(card);
      });
    }

    function apply() {
      var count = 0;
      cards.forEach(function (card) {
        var ok = matches(card);
        card.hidden = !ok;
        if (ok) {
          count += 1;
        }
      });
      if (visibleCount) {
        visibleCount.textContent = String(count);
      }
      if (emptyState) {
        emptyState.hidden = count !== 0;
      }
    }

    [searchInput, regionFilter, typeFilter, yearFilter].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });

    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        sortCards();
        apply();
      });
      sortCards();
    }

    apply();
  }

  function initImageFallbacks() {
    var images = Array.prototype.slice.call(document.querySelectorAll('img'));
    images.forEach(function (image) {
      image.addEventListener('error', function () {
        var frame = image.closest('.poster-frame, .hero-poster, .hero-bg, .ranking-thumb, .related-cover');
        if (frame) {
          frame.classList.add('is-missing-image');
        }
        image.style.visibility = 'hidden';
      }, { once: true });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initHeroSlider();
    initFilters();
    initImageFallbacks();
  });
})();
