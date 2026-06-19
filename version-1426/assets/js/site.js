(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            var open = mobileNav.classList.toggle('is-open');
            menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    var hero = document.querySelector('[data-hero-carousel]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === current);
            });
        }

        function startTimer() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                startTimer();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot') || 0));
                startTimer();
            });
        });

        startTimer();
    }

    var filterPanels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));

    filterPanels.forEach(function (panel) {
        var input = panel.querySelector('[data-card-filter]');
        var typeSelect = panel.querySelector('[data-type-filter]');
        var sortSelect = panel.querySelector('[data-sort-cards]');
        var container = document.querySelector('[data-card-container]');

        if (!container) {
            return;
        }

        var cards = Array.prototype.slice.call(container.querySelectorAll('.movie-card'));
        var originalCards = cards.slice();

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function applyFilters() {
            var keyword = normalize(input ? input.value : '');
            var selectedType = typeSelect ? typeSelect.value : '';

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-tags'),
                    card.textContent
                ].join(' '));
                var typeOk = !selectedType || haystack.indexOf(normalize(selectedType)) !== -1;
                var keywordOk = !keyword || haystack.indexOf(keyword) !== -1;
                card.classList.toggle('is-hidden', !(typeOk && keywordOk));
            });
        }

        function applySort() {
            var value = sortSelect ? sortSelect.value : 'default';
            var sorted = cards.slice();

            if (value === 'year-desc') {
                sorted.sort(function (a, b) {
                    return Number(b.getAttribute('data-year') || 0) - Number(a.getAttribute('data-year') || 0);
                });
            } else if (value === 'year-asc') {
                sorted.sort(function (a, b) {
                    return Number(a.getAttribute('data-year') || 0) - Number(b.getAttribute('data-year') || 0);
                });
            } else if (value === 'title') {
                sorted.sort(function (a, b) {
                    return String(a.getAttribute('data-title') || '').localeCompare(String(b.getAttribute('data-title') || ''), 'zh-CN');
                });
            } else {
                sorted = originalCards.slice();
            }

            sorted.forEach(function (card) {
                container.appendChild(card);
            });
            cards = sorted;
            applyFilters();
        }

        if (input) {
            input.addEventListener('input', applyFilters);
        }

        if (typeSelect) {
            typeSelect.addEventListener('change', applyFilters);
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', applySort);
        }
    });

    var globalSearch = document.getElementById('globalSearch');
    var globalResults = document.getElementById('globalSearchResults');

    if (globalSearch && globalResults && Array.isArray(window.searchMovies)) {
        function clean(value) {
            return String(value || '').toLowerCase().trim();
        }

        function closeResults() {
            globalResults.classList.remove('is-open');
            globalResults.innerHTML = '';
        }

        function renderResults() {
            var query = clean(globalSearch.value);

            if (!query) {
                closeResults();
                return;
            }

            var results = window.searchMovies.filter(function (movie) {
                var text = clean([
                    movie.title,
                    movie.year,
                    movie.region,
                    movie.type,
                    movie.category,
                    movie.oneLine,
                    (movie.tags || []).join(' ')
                ].join(' '));
                return text.indexOf(query) !== -1;
            }).slice(0, 12);

            if (!results.length) {
                globalResults.innerHTML = '<div class="search-result-item"><div></div><div><strong>暂无匹配内容</strong><p>换一个关键词继续搜索</p></div></div>';
                globalResults.classList.add('is-open');
                return;
            }

            globalResults.innerHTML = results.map(function (movie) {
                return '<a class="search-result-item" href="' + movie.href + '">' +
                    '<img src="' + movie.cover + '" alt="' + movie.title.replace(/"/g, '&quot;') + '" loading="lazy">' +
                    '<div><strong>' + movie.title + '</strong><p>' + movie.oneLine + '</p><span>' + movie.year + ' · ' + movie.category + '</span></div>' +
                    '</a>';
            }).join('');
            globalResults.classList.add('is-open');
        }

        globalSearch.addEventListener('input', renderResults);
        document.addEventListener('click', function (event) {
            if (!globalSearch.contains(event.target) && !globalResults.contains(event.target)) {
                closeResults();
            }
        });
    }
})();
