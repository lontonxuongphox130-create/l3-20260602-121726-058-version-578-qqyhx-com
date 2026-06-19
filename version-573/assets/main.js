(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function initMenu() {
    const toggle = $('[data-menu-toggle]');
    const nav = $('[data-mobile-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', () => {
      nav.classList.toggle('is-open');
    });
  }

  function initHero() {
    const hero = $('[data-hero]');
    if (!hero) {
      return;
    }
    const slides = $$('[data-hero-slide]', hero);
    const dots = $$('[data-hero-dot]', hero);
    const prev = $('[data-hero-prev]', hero);
    const next = $('[data-hero-next]', hero);
    if (!slides.length) {
      return;
    }
    let current = 0;
    let timer = null;

    const show = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    const start = () => {
      stop();
      timer = window.setInterval(() => show(current + 1), 5000);
    };

    const stop = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    prev && prev.addEventListener('click', () => {
      show(current - 1);
      start();
    });
    next && next.addEventListener('click', () => {
      show(current + 1);
      start();
    });
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        show(Number(dot.dataset.heroDot || 0));
        start();
      });
    });
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initMovieFilters() {
    const list = $('[data-movie-list]');
    if (!list) {
      return;
    }
    const cards = $$('.movie-card, .rank-card', list);
    const search = $('[data-movie-search]');
    const year = $('[data-year-filter]');
    const region = $('[data-region-filter]');
    const count = $('[data-filter-count]');

    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q');
    if (search && initialQuery) {
      search.value = initialQuery;
    }

    const apply = () => {
      const q = search ? search.value.trim().toLowerCase() : '';
      const selectedYear = year ? year.value : '';
      const selectedRegion = region ? region.value : '';
      let visible = 0;

      cards.forEach((card) => {
        const text = (card.dataset.search || '').toLowerCase();
        const cardYear = card.dataset.year || '';
        const cardRegion = (card.dataset.region || '').toLowerCase();
        const matched = (!q || text.includes(q)) &&
          (!selectedYear || cardYear === selectedYear) &&
          (!selectedRegion || cardRegion === selectedRegion);
        card.classList.toggle('is-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = `当前显示 ${visible} 部影片`;
      }
    };

    [search, year, region].forEach((control) => {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });
    apply();
  }

  function initPlayer() {
    const video = $('#movie-player');
    const button = $('[data-player-start]');
    const scrollButton = $('[data-scroll-player]');
    if (!video) {
      return;
    }
    let hls = null;

    const loadSource = () => {
      if (video.dataset.loaded === 'true') {
        return;
      }
      const source = video.dataset.src;
      if (!source) {
        return;
      }
      video.controls = true;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, (_event, data) => {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            hls.destroy();
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        video.src = source;
      }
      video.dataset.loaded = 'true';
    };

    const play = () => {
      loadSource();
      const promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {});
      }
    };

    if (button) {
      button.addEventListener('click', () => {
        button.classList.add('is-hidden');
        play();
      });
      video.addEventListener('play', () => button.classList.add('is-hidden'));
      video.addEventListener('pause', () => {
        if (!video.ended) {
          button.classList.remove('is-hidden');
        }
      });
    }

    if (scrollButton) {
      scrollButton.addEventListener('click', () => {
        window.setTimeout(play, 240);
      });
    }

    window.addEventListener('beforeunload', () => {
      if (hls) {
        hls.destroy();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initHero();
    initMovieFilters();
    initPlayer();
  });
})();
