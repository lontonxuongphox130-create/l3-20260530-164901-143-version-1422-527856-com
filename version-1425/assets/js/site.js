(function () {
  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function setupNavigation() {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.nav-toggle');
    if (!header || !toggle) {
      return;
    }
    toggle.addEventListener('click', function () {
      var isOpen = header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  function setupImageFallbacks() {
    var images = document.querySelectorAll('img[data-fallback]');
    images.forEach(function (image) {
      image.addEventListener('error', function () {
        image.classList.add('is-missing');
        image.removeAttribute('src');
      });
    });
  }

  function setupGlobalSearchForms() {
    var forms = document.querySelectorAll('form[data-global-search]');
    forms.forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = form.querySelector('input[name="q"]');
        if (!input || !input.value.trim()) {
          event.preventDefault();
          input && input.focus();
        }
      });
    });
  }

  function getQueryValue(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
  }

  function setupFiltering() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    var input = document.querySelector('.js-filter-input');
    var selects = Array.prototype.slice.call(document.querySelectorAll('.js-filter-select'));
    var count = document.querySelector('.js-visible-count');
    if (!cards.length || (!input && !selects.length)) {
      return;
    }

    if (input) {
      var q = getQueryValue('q');
      if (q) {
        input.value = q;
      }
    }

    function applyFilters() {
      var keyword = normalize(input ? input.value : '');
      var activeFilters = selects.map(function (select) {
        return {
          field: select.getAttribute('data-filter-field'),
          value: normalize(select.value)
        };
      }).filter(function (item) {
        return item.value;
      });
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-search'));
        var keywordMatch = !keyword || text.indexOf(keyword) !== -1;
        var filterMatch = activeFilters.every(function (filter) {
          var cardValue = normalize(card.getAttribute('data-' + filter.field));
          return cardValue.indexOf(filter.value) !== -1;
        });
        var show = keywordMatch && filterMatch;
        card.classList.toggle('is-hidden', !show);
        if (show) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = String(visible);
      }
    }

    if (input) {
      input.addEventListener('input', applyFilters);
    }
    selects.forEach(function (select) {
      select.addEventListener('change', applyFilters);
    });
    applyFilters();
  }

  setupNavigation();
  setupImageFallbacks();
  setupGlobalSearchForms();
  setupFiltering();
})();
