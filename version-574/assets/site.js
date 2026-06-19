(function () {
    const navToggle = document.querySelector('[data-nav-toggle]');
    const mainNav = document.querySelector('[data-main-nav]');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function () {
            mainNav.classList.toggle('is-open');
        });
    }

    const input = document.querySelector('[data-filter-input]');
    const yearFilter = document.querySelector('[data-year-filter]');
    const grid = document.querySelector('[data-filter-grid]');

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function filterCards() {
        if (!grid) {
            return;
        }

        const query = normalize(input ? input.value : '');
        const year = yearFilter ? yearFilter.value : '';
        const cards = grid.querySelectorAll('.movie-card, .ranking-item');

        cards.forEach(function (card) {
            const text = normalize(card.textContent + ' ' + (card.dataset.title || '') + ' ' + (card.dataset.region || '') + ' ' + (card.dataset.type || '') + ' ' + (card.dataset.year || ''));
            const matchesQuery = !query || text.includes(query);
            const matchesYear = !year || String(card.dataset.year || '').includes(year);
            card.classList.toggle('hidden-by-filter', !(matchesQuery && matchesYear));
        });
    }

    if (input) {
        input.addEventListener('input', filterCards);
    }

    if (yearFilter) {
        yearFilter.addEventListener('change', filterCards);
    }
})();
