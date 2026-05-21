(function () {

  // --- FADE ---
  var FADE_SECONDS = 1.5;

  function attachFade(video) {
    video.style.transition = 'opacity 0.1s linear';
    let rafId;

    function checkFade() {
      if (video.paused || video.ended) return;
      if (video.duration) {
        var remaining = video.duration - video.currentTime;
        if (remaining < FADE_SECONDS) {
          video.style.opacity = String(Math.max(0, remaining / FADE_SECONDS));
        }
      }
      rafId = requestAnimationFrame(checkFade);
    }

    video.addEventListener('play', function() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(checkFade);
    });

    video.addEventListener('ended', function () {
      video.currentTime = 0;
      video.style.opacity = '1';
      video.play().catch(function () {});
    });
  }

  // --- FREEZE ---
  var FREEZE_SECONDS = 0.6; // You can safely raise this now that the curve is smooth
  var MIN_SPEED = 0.55; // 24fps * 0.25 = 6fps. Going lower causes the "slideshow" jitter.

  function attachFreeze(video) {
    let rafId;

    function updateFreeze() {
      if (video.paused || video.ended) return;

      if (video.duration) {
        var remaining = video.duration - video.currentTime;

        if (remaining <= 0.05) {
          // Snap to end and pause to prevent looping/stuttering on the absolute last tick
          video.pause();
          video.currentTime = video.duration;
          return;
        }

        if (remaining < FREEZE_SECONDS) {
          // 1. Calculate a normalized progress (0.0 to 1.0)
          var progress = 1 - (remaining / FREEZE_SECONDS);
          
          // 2. Apply an Ease-Out Cubic curve (feels like natural braking)
          var easeOut = 1 - Math.pow(1 - progress, 3);
          
          // 3. Map the eased value to our playback speed range (1.0 down to MIN_SPEED)
          var targetRate = 1.0 - (easeOut * (1.0 - MIN_SPEED));
          
          video.playbackRate = Math.max(MIN_SPEED, targetRate);
        } else {
          // Ensure it stays at 1.0 if we haven't hit the freeze zone
          video.playbackRate = 1.0; 
        }
      }
      rafId = requestAnimationFrame(updateFreeze);
    }

    video.addEventListener('play', function() {
      // Reset rate on play, cancel any old loops, start a new one
      video.playbackRate = 1.0; 
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateFreeze);
    });

    video.addEventListener('seeked', function() {
      if (!video.paused) {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(updateFreeze);
      }
    });
  }

  document.querySelectorAll('video[data-fade]').forEach(attachFade);
  document.querySelectorAll('video[data-freeze]').forEach(attachFreeze);

})();


// (function () {

//   // --- FADE: opacity fades to 0 over the last FADE_SECONDS, then restarts ---
//   // Applied to videos with data-fade attribute.
//   var FADE_SECONDS = 1.5;

//   function attachFade(video) {
//     video.style.transition = 'opacity 0.1s linear';

//     video.addEventListener('timeupdate', function () {
//       if (!video.duration) return;
//       var remaining = video.duration - video.currentTime;
//       if (remaining < FADE_SECONDS) {
//         video.style.opacity = String(remaining / FADE_SECONDS);
//       }
//     });

//     video.addEventListener('ended', function () {
//       video.currentTime = 0;
//       video.style.opacity = '1';
//       video.play().catch(function () {});
//     });
//   }

//   // --- FREEZE: playbackRate ramps down to near-zero over the last FREEZE_SECONDS,
//   //     then pauses on the final frame. Full opacity throughout. ---
//   // Applied to videos with data-freeze attribute.
//   var FREEZE_SECONDS = 0.25; // tune: how many seconds the slow-down takes

//   function attachFreeze(video) {
//     video.addEventListener('timeupdate', function () {
//       if (!video.duration) return;
//       var remaining = video.duration - video.currentTime;
//       if (remaining < FREEZE_SECONDS) {
//         // Ramp from 1.0 → 0.05 (never fully 0 or ended event may not fire)
//         video.playbackRate = Math.max(0.05, remaining / FREEZE_SECONDS);
//       }
//     });

//     video.addEventListener('ended', function () {
//       video.pause();
//       // Snap to absolute last frame in case browser rounded currentTime
//       video.currentTime = video.duration;
//     });
//   }

//   document.querySelectorAll('video[data-fade]').forEach(attachFade);
//   document.querySelectorAll('video[data-freeze]').forEach(attachFreeze);

// })();
