(function () {
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-menu]');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  const inputs = document.querySelectorAll('[data-search-input]');
  inputs.forEach(function (input) {
    const scopeSelector = input.getAttribute('data-search-scope') || 'body';
    const scope = document.querySelector(scopeSelector) || document;
    const items = Array.from(scope.querySelectorAll('.search-item'));

    input.addEventListener('input', function () {
      const query = input.value.trim().toLowerCase();
      items.forEach(function (item) {
        const haystack = [
          item.getAttribute('data-title'),
          item.getAttribute('data-year'),
          item.getAttribute('data-genre'),
          item.getAttribute('data-region'),
          item.textContent
        ].join(' ').toLowerCase();
        item.classList.toggle('hidden-by-filter', query && !haystack.includes(query));
      });
    });
  });

  const hero = document.querySelector('[data-hero-slider]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let index = 0;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      slides[index].classList.remove('is-active');
      index = (nextIndex + slides.length) % slides.length;
      slides[index].classList.add('is-active');
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
      });
    }

    setInterval(function () {
      showSlide(index + 1);
    }, 5200);
  }

  document.querySelectorAll('img').forEach(function (image) {
    image.addEventListener('error', function () {
      const shell = image.closest('.poster-shell, .detail-poster, .hero-poster-card');
      if (shell) {
        shell.classList.add('poster-no-image');
      }
    });
  });
})();
