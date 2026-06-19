(function () {
  "use strict";

  var menuButton = document.querySelector(".menu-toggle");
  var mobileNav = document.querySelector(".mobile-nav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function filterCards(input) {
    var list = document.querySelector(".filter-list");
    if (!list || !input) {
      return;
    }

    var query = normalize(input.value);
    var cards = list.querySelectorAll(".movie-card");
    var visible = 0;

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute("data-search"));
      var matched = !query || text.indexOf(query) !== -1;
      card.hidden = !matched;
      if (matched) {
        visible += 1;
      }
    });

    var empty = document.querySelector(".empty-state");
    if (empty) {
      empty.hidden = visible !== 0;
    }
  }

  var params = new URLSearchParams(window.location.search);
  var query = params.get("q") || "";
  var searchInput = document.querySelector("[data-search-input]");
  var localInput = document.querySelector("[data-local-filter]");

  if (searchInput) {
    searchInput.value = query;
    filterCards(searchInput);
    searchInput.addEventListener("input", function () {
      filterCards(searchInput);
    });
  }

  if (localInput) {
    localInput.addEventListener("input", function () {
      filterCards(localInput);
    });
  }

  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var slides = hero.querySelectorAll(".hero-slide");
    var dots = hero.querySelectorAll("[data-hero-dot]");
    var current = 0;
    var timer = null;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    function startTimer() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
        startTimer();
      });
    });

    startTimer();
  }
})();
