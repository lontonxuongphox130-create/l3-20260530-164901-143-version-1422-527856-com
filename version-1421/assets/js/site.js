(function () {
    function setupMenu() {
        var button = document.querySelector('[data-menu-toggle]');
        var nav = document.querySelector('[data-main-nav]');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var root = document.querySelector('[data-hero]');
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
        var prev = root.querySelector('[data-hero-prev]');
        var next = root.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(target) {
            if (!slides.length) {
                return;
            }
            index = (target + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });
        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }
        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function setupSearch() {
        var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-search]'));
        if (!inputs.length) {
            return;
        }
        inputs.forEach(function (input) {
            input.addEventListener('input', function () {
                var value = input.value.trim().toLowerCase();
                var scope = input.closest('main') || document;
                var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
                cards.forEach(function (card) {
                    var text = card.getAttribute('data-search-text') || '';
                    card.style.display = !value || text.indexOf(value) !== -1 ? '' : 'none';
                });
            });
        });
    }

    function setupSort() {
        var selects = Array.prototype.slice.call(document.querySelectorAll('[data-sort]'));
        selects.forEach(function (select) {
            select.addEventListener('change', function () {
                var container = select.closest('.section-block');
                if (!container) {
                    var section = select.closest('section');
                    var next = section ? section.nextElementSibling : null;
                    container = next && next.matches('.section-block') ? next : document;
                }
                var list = container.querySelector('[data-movie-grid]');
                if (!list) {
                    return;
                }
                var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
                var mode = select.value;
                cards.sort(function (a, b) {
                    if (mode === 'year-desc') {
                        return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
                    }
                    if (mode === 'views-desc') {
                        return Number(b.getAttribute('data-views')) - Number(a.getAttribute('data-views'));
                    }
                    if (mode === 'title-asc') {
                        return String(a.getAttribute('data-title')).localeCompare(String(b.getAttribute('data-title')), 'zh-CN');
                    }
                    return 0;
                });
                cards.forEach(function (card) {
                    list.appendChild(card);
                });
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMenu();
        setupHero();
        setupSearch();
        setupSort();
    });
}());
