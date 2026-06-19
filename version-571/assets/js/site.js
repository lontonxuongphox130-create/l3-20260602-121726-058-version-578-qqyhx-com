(() => {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  if (menuButton && mobileNav) menuButton.addEventListener('click', () => mobileNav.classList.toggle('is-open'));

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dot'));
  let heroIndex = slides.findIndex(s => s.classList.contains('is-active'));
  if (heroIndex < 0) heroIndex = 0;
  const showHero = index => {
    if (!slides.length) return;
    heroIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === heroIndex));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === heroIndex));
  };
  document.querySelectorAll('[data-hero-next]').forEach(btn => btn.addEventListener('click', () => showHero(heroIndex + 1)));
  document.querySelectorAll('[data-hero-prev]').forEach(btn => btn.addEventListener('click', () => showHero(heroIndex - 1)));
  dots.forEach((dot, i) => dot.addEventListener('click', () => showHero(i)));
  if (slides.length > 1) setInterval(() => showHero(heroIndex + 1), 5200);

  document.querySelectorAll('[data-search-form]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const input = form.querySelector('input');
      const q = encodeURIComponent((input && input.value || '').trim());
      location.href = q ? './search.html?q=' + q : './search.html';
    });
  });

  const liveInput = document.querySelector('[data-live-search]');
  const yearFilter = document.querySelector('[data-year-filter]');
  const typeFilter = document.querySelector('[data-type-filter]');
  const categoryFilter = document.querySelector('[data-category-filter]');
  const cards = Array.from(document.querySelectorAll('.movie-card[data-title]'));
  const empty = document.querySelector('[data-empty-hint]');
  const params = new URLSearchParams(location.search);
  if (liveInput && params.get('q')) liveInput.value = params.get('q');
  const applyFilters = () => {
    const q = (liveInput && liveInput.value || '').trim().toLowerCase();
    const y = yearFilter && yearFilter.value || '';
    const t = typeFilter && typeFilter.value || '';
    const c = categoryFilter && categoryFilter.value || '';
    let shown = 0;
    cards.forEach(card => {
      const text = [card.dataset.title, card.dataset.tags, card.dataset.region, card.dataset.type, card.dataset.category, card.dataset.year].join(' ').toLowerCase();
      const ok = (!q || text.includes(q)) && (!y || card.dataset.year === y) && (!t || card.dataset.type === t) && (!c || card.dataset.category === c);
      card.style.display = ok ? '' : 'none';
      if (ok) shown++;
    });
    if (empty) empty.style.display = shown ? 'none' : 'block';
  };
  [liveInput, yearFilter, typeFilter, categoryFilter].filter(Boolean).forEach(el => el.addEventListener('input', applyFilters));
  if (liveInput || yearFilter || typeFilter || categoryFilter) applyFilters();

  const video = document.querySelector('video[data-hls]');
  const play = document.querySelector('[data-play]');
  if (video && play) {
    let ready = false;
    const start = () => {
      const src = video.getAttribute('data-hls');
      if (!ready && src) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) video.src = src;
        else if (window.Hls && window.Hls.isSupported()) {
          const hls = new window.Hls({maxBufferLength: 30});
          hls.loadSource(src);
          hls.attachMedia(video);
        } else video.src = src;
        ready = true;
      }
      play.classList.add('is-hidden');
      video.play().catch(() => {});
    };
    play.addEventListener('click', start);
    video.addEventListener('click', () => { if (video.paused) start(); });
  }
})();