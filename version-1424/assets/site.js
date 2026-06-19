(function () {
  function activateMenu() {
    var button = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.site-nav');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function activateHero() {
    var hero = document.querySelector('.hero');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dots button'));
    if (slides.length < 2) {
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
    function play() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(current + 1);
      }, 5200);
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        play();
      });
    });
    hero.addEventListener('mouseenter', function () {
      clearInterval(timer);
    });
    hero.addEventListener('mouseleave', play);
    show(0);
    play();
  }

  function activateFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll('.filter-panel'));
    panels.forEach(function (panel) {
      var section = panel.closest('.section') || document;
      var input = panel.querySelector('.movie-search');
      var year = panel.querySelector('.year-filter');
      var type = panel.querySelector('.type-filter');
      var cards = Array.prototype.slice.call(section.querySelectorAll('.movie-card, .rank-row'));
      var empty = section.querySelector('.no-results');
      function run() {
        var q = input ? input.value.trim().toLowerCase() : '';
        var y = year ? year.value : '';
        var t = type ? type.value : '';
        var shown = 0;
        cards.forEach(function (card) {
          var pool = [
            card.dataset.title || '',
            card.dataset.region || '',
            card.dataset.genre || '',
            card.dataset.tags || '',
            card.dataset.type || ''
          ].join(' ').toLowerCase();
          var ok = true;
          if (q && pool.indexOf(q) === -1) {
            ok = false;
          }
          if (y && card.dataset.year !== y) {
            ok = false;
          }
          if (t && card.dataset.type !== t) {
            ok = false;
          }
          card.style.display = ok ? '' : 'none';
          if (ok) {
            shown += 1;
          }
        });
        if (empty) {
          empty.classList.toggle('show', shown === 0);
        }
      }
      [input, year, type].forEach(function (element) {
        if (element) {
          element.addEventListener('input', run);
          element.addEventListener('change', run);
        }
      });
      run();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    activateMenu();
    activateHero();
    activateFilters();
  });
})();
