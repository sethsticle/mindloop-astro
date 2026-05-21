(function () {
  var videos = document.querySelectorAll('video[data-video-src]');

  function loadVideo(v) {
    if (!v.getAttribute('src')) {
      v.src = v.dataset.videoSrc;
      v.load();
      v.play().catch(function () {});
    }
  }

  if (!('IntersectionObserver' in window)) {
    videos.forEach(loadVideo);
    return;
  }

  var io = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      loadVideo(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '300px 0px' });

  videos.forEach(function (v) {
    if (v.getAttribute('src')) return; // eager videos already have src
    io.observe(v);
  });
})();
