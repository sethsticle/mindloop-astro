(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const delay = e.target.dataset.delay || 0;
          setTimeout(() => e.target.classList.add('revealed'), delay * 1000);
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: '-100px' }
  );

  els.forEach((el) => {
    el.classList.add('will-reveal');
    io.observe(el);
  });
})();
