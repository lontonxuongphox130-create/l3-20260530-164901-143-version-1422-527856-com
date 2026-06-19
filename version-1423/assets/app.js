(function() {
  var menuButton = document.querySelector('[data-menu-button]');
  var menu = document.querySelector('[data-menu]');
  if (menuButton && menu) {
    menuButton.addEventListener('click', function() {
      menu.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function() {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() {
        show(i);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function() {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function() {
        show(index + 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    start();
  }

  var searchPage = document.querySelector('[data-search-page]');
  if (searchPage) {
    var input = searchPage.querySelector('[data-search-input]');
    var buttons = Array.prototype.slice.call(searchPage.querySelectorAll('[data-filter]'));
    var cards = Array.prototype.slice.call(searchPage.querySelectorAll('[data-card]'));
    var active = 'all';

    function normalize(value) {
      return (value || '').toString().trim().toLowerCase();
    }

    function cardText(card) {
      return normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-year'),
        card.textContent
      ].join(' '));
    }

    function update() {
      var keyword = normalize(input ? input.value : '');
      cards.forEach(function(card) {
        var okText = !keyword || cardText(card).indexOf(keyword) !== -1;
        var okCat = active === 'all' || card.getAttribute('data-cat') === active;
        card.style.display = okText && okCat ? '' : 'none';
      });
    }

    buttons.forEach(function(button) {
      button.addEventListener('click', function() {
        active = button.getAttribute('data-filter') || 'all';
        buttons.forEach(function(item) {
          item.classList.toggle('active', item === button);
        });
        update();
      });
    });

    if (input) {
      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q) {
        input.value = q;
      }
      input.addEventListener('input', update);
    }

    update();
  }
})();
