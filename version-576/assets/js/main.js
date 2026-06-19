(function () {
  var navButton = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');

  if (navButton && nav) {
    navButton.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var prev = document.querySelector('.hero-prev');
  var next = document.querySelector('.hero-next');
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  function startCarousel() {
    if (timer) {
      clearInterval(timer);
    }

    if (slides.length > 1) {
      timer = setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  if (prev) {
    prev.addEventListener('click', function () {
      showSlide(current - 1);
      startCarousel();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      showSlide(current + 1);
      startCarousel();
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
      startCarousel();
    });
  });

  showSlide(0);
  startCarousel();

  var filterInput = document.querySelector('.filter-input');
  var filterRegion = document.querySelector('.filter-region');
  var filterYear = document.querySelector('.filter-year');
  var searchCards = Array.prototype.slice.call(document.querySelectorAll('.search-grid .movie-card'));

  function readQuery() {
    var params = new URLSearchParams(window.location.search);
    var value = params.get('q') || '';
    if (filterInput && value) {
      filterInput.value = value;
    }
  }

  function filterCards() {
    if (!searchCards.length) {
      return;
    }

    var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var region = filterRegion ? filterRegion.value : '';
    var year = filterYear ? filterYear.value : '';

    searchCards.forEach(function (card) {
      var haystack = [
        card.dataset.title || '',
        card.dataset.region || '',
        card.dataset.year || '',
        card.dataset.genre || '',
        card.dataset.category || '',
        card.textContent || ''
      ].join(' ').toLowerCase();
      var matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var matchedRegion = !region || card.dataset.region === region;
      var matchedYear = !year || card.dataset.year === year;
      card.classList.toggle('is-hidden', !(matchedKeyword && matchedRegion && matchedYear));
    });
  }

  readQuery();

  if (filterInput) {
    filterInput.addEventListener('input', filterCards);
  }

  if (filterRegion) {
    filterRegion.addEventListener('change', filterCards);
  }

  if (filterYear) {
    filterYear.addEventListener('change', filterCards);
  }

  filterCards();
})();
