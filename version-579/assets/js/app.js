(function () {
  var navButton = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-main-nav]");

  if (navButton && nav) {
    navButton.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var activeIndex = 0;

    var showSlide = function (index) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, currentIndex) {
        slide.classList.toggle("is-active", currentIndex === activeIndex);
      });
      dots.forEach(function (dot, currentIndex) {
        dot.classList.toggle("is-active", currentIndex === activeIndex);
      });
    };

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5200);
    }
  }

  var filterInput = document.querySelector("[data-card-filter]");
  var clearButton = document.querySelector("[data-clear-filter]");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search]"));

  var filterCards = function (value) {
    var keyword = String(value || "").trim().toLowerCase();
    cards.forEach(function (card) {
      var text = card.getAttribute("data-search") || "";
      card.classList.toggle("is-filtered-out", keyword && text.indexOf(keyword) === -1);
    });
  };

  if (filterInput) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";

    if (filterInput.hasAttribute("data-url-query") && query) {
      filterInput.value = query;
      filterCards(query);
    }

    filterInput.addEventListener("input", function () {
      filterCards(filterInput.value);
    });
  }

  if (clearButton && filterInput) {
    clearButton.addEventListener("click", function () {
      filterInput.value = "";
      filterCards("");
      filterInput.focus();
    });
  }

  Array.prototype.slice.call(document.querySelectorAll("[data-filter-chip]")).forEach(function (chip) {
    chip.addEventListener("click", function () {
      if (filterInput) {
        filterInput.value = chip.getAttribute("data-filter-chip") || "";
        filterCards(filterInput.value);
      }
    });
  });
})();
