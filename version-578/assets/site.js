(function() {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function() {
      mobileNav.classList.toggle('is-open');
      menuButton.textContent = mobileNav.classList.contains('is-open') ? '×' : '☰';
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = selectAll('[data-hero-slide]', hero);
    var dots = selectAll('[data-hero-dot]', hero);
    var index = 0;
    function showSlide(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }
    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() {
        showSlide(i);
      });
    });
    if (slides.length > 1) {
      setInterval(function() {
        showSlide(index + 1);
      }, 5200);
    }
  }

  selectAll('[data-search-form]').forEach(function(form) {
    form.addEventListener('submit', function(event) {
      var input = form.querySelector('[data-search-input]');
      if (input && input.value.trim()) {
        event.preventDefault();
        window.location.href = form.getAttribute('action') + '?q=' + encodeURIComponent(input.value.trim());
      }
    });
  });

  var cards = selectAll('[data-card]');
  var localSearch = document.querySelector('[data-local-search]');
  var activeFilter = 'all';

  function cardText(card) {
    return [
      card.dataset.title,
      card.dataset.genre,
      card.dataset.region,
      card.dataset.year,
      card.dataset.type,
      card.dataset.tags
    ].join(' ').toLowerCase();
  }

  function applyCards() {
    if (!cards.length) {
      return;
    }
    var query = localSearch ? localSearch.value.trim().toLowerCase() : '';
    cards.forEach(function(card) {
      var text = cardText(card);
      var matchQuery = !query || text.indexOf(query) !== -1;
      var matchFilter = activeFilter === 'all' || text.indexOf(activeFilter.toLowerCase()) !== -1;
      card.classList.toggle('is-hidden', !(matchQuery && matchFilter));
    });
  }

  if (localSearch) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q) {
      localSearch.value = q;
    }
    localSearch.addEventListener('input', applyCards);
    applyCards();
  }

  selectAll('[data-filter-bar]').forEach(function(bar) {
    bar.addEventListener('click', function(event) {
      var button = event.target.closest('[data-filter]');
      if (!button) {
        return;
      }
      activeFilter = button.dataset.filter || 'all';
      selectAll('[data-filter]', bar).forEach(function(btn) {
        btn.classList.toggle('is-active', btn === button);
      });
      applyCards();
    });
  });

  var backTop = document.querySelector('[data-back-top]');
  if (backTop) {
    window.addEventListener('scroll', function() {
      backTop.classList.toggle('is-visible', window.scrollY > 520);
    });
    backTop.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}());
