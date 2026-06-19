(function () {
  var blocks = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));

  blocks.forEach(function (block) {
    var video = block.querySelector("video");
    var trigger = block.querySelector("[data-play-trigger]");
    var hlsInstance = null;
    var ready = false;

    if (!video) {
      return;
    }

    var initPlayer = function () {
      if (ready) {
        return;
      }

      var stream = video.getAttribute("data-stream");

      if (!stream) {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls();
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
      } else {
        video.src = stream;
      }

      ready = true;
    };

    var start = function () {
      initPlayer();

      if (trigger) {
        trigger.classList.add("is-hidden");
      }

      var attempt = video.play();

      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function () {
          if (trigger) {
            trigger.classList.remove("is-hidden");
          }
        });
      }
    };

    if (trigger) {
      trigger.addEventListener("click", start);
    }

    video.addEventListener("play", function () {
      if (trigger) {
        trigger.classList.add("is-hidden");
      }
    });

    video.addEventListener("emptied", function () {
      if (hlsInstance && typeof hlsInstance.destroy === "function") {
        hlsInstance.destroy();
      }
      hlsInstance = null;
      ready = false;
    });
  });
})();
