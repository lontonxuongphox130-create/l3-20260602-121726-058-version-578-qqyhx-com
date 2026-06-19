import { H as Hls } from './hls-dru42stk.js';

const video = document.querySelector('#movie-player');
const shell = document.querySelector('[data-player-shell]');
const cover = document.querySelector('[data-player-cover]');
const button = document.querySelector('[data-play-button]');
let isReady = false;
let hlsInstance = null;

function attachSource() {
  if (!video || isReady) {
    return;
  }

  const source = video.getAttribute('data-play-url');

  if (!source) {
    return;
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    isReady = true;
    return;
  }

  if (Hls && Hls.isSupported()) {
    hlsInstance = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });
    hlsInstance.loadSource(source);
    hlsInstance.attachMedia(video);
    isReady = true;
  }
}

function startPlayback(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  attachSource();

  if (cover) {
    cover.classList.add('is-hidden');
  }

  if (video) {
    video.controls = true;
    video.play().catch(function () {
      if (cover) {
        cover.classList.remove('is-hidden');
      }
    });
  }
}

if (button) {
  button.addEventListener('click', startPlayback);
}

if (shell) {
  shell.addEventListener('click', function (event) {
    if (!isReady || video.paused) {
      startPlayback(event);
    }
  });
}

window.addEventListener('pagehide', function () {
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }
});
