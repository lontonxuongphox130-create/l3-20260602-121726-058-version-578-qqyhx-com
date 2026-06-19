(function () {
  function loadScript(url) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  var hlsPromise = null;

  function getHls() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }

    if (!hlsPromise) {
      hlsPromise = import('./hls.js')
        .then(function (module) {
          return module.H;
        })
        .catch(function () {
          return loadScript('https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js')
            .then(function () {
              return window.Hls;
            });
        });
    }

    return hlsPromise;
  }

  function bindPlayer(shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('.play-cover');

    if (!video || !button) {
      return;
    }

    var mediaUrl = video.getAttribute('src');
    var prepared = false;

    function prepare() {
      if (prepared) {
        return Promise.resolve();
      }

      prepared = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = mediaUrl;
        return Promise.resolve();
      }

      return getHls().then(function (Hls) {
        if (Hls && Hls.isSupported()) {
          video.removeAttribute('src');
          var hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(mediaUrl);
          hls.attachMedia(video);
        }
      });
    }

    function start() {
      shell.classList.add('is-playing');
      prepare().then(function () {
        var playTask = video.play();
        if (playTask && typeof playTask.catch === 'function') {
          playTask.catch(function () {});
        }
      });
    }

    button.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener('play', function () {
      shell.classList.add('is-playing');
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('.player-shell')).forEach(bindPlayer);
})();
