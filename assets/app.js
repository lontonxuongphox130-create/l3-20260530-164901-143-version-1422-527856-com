(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var button = document.querySelector("[data-menu-button]");
        var mobile = document.querySelector("[data-mobile-nav]");
        if (button && mobile) {
            button.addEventListener("click", function () {
                mobile.classList.toggle("is-open");
            });
        }

        document.querySelectorAll("[data-hero]").forEach(function (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var index = 0;
            function show(next) {
                if (!slides.length) return;
                index = (next + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("is-active", i === index);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("is-active", i === index);
                });
            }
            dots.forEach(function (dot, i) {
                dot.addEventListener("click", function () {
                    show(i);
                });
            });
            if (slides.length > 1) {
                window.setInterval(function () {
                    show(index + 1);
                }, 5200);
            }
        });

        document.querySelectorAll("[data-filter-root]").forEach(function (root) {
            var input = root.querySelector("[data-filter-input]");
            var count = root.querySelector("[data-filter-count]");
            var cards = Array.prototype.slice.call(root.querySelectorAll(".movie-card"));
            if (!input) return;
            if (input.hasAttribute("data-query-sync")) {
                var params = new URLSearchParams(window.location.search);
                var q = params.get("q") || "";
                input.value = q;
            }
            function apply() {
                var term = input.value.trim().toLowerCase();
                var visible = 0;
                cards.forEach(function (card) {
                    var text = card.textContent.toLowerCase() + " " + Array.prototype.map.call(card.attributes, function (attr) {
                        return attr.value.toLowerCase();
                    }).join(" ");
                    var ok = !term || text.indexOf(term) !== -1;
                    card.style.display = ok ? "" : "none";
                    if (ok) visible += 1;
                });
                if (count) count.textContent = visible + " 部";
            }
            input.addEventListener("input", apply);
            apply();
        });
    });
})();
