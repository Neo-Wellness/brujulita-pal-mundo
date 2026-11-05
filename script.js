(() => {
  const header = document.querySelector('[data-header]');
  const nav = document.querySelector('#site-nav');
  const toggle = document.querySelector('.nav-toggle');

  const setHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  if (toggle && nav) {
    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.querySelector('.sr-only').textContent = 'メニューを開く';
      nav.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggle.querySelector('.sr-only').textContent = isOpen ? 'メニューを開く' : 'メニューを閉じる';
      nav.classList.toggle('is-open', !isOpen);
      document.body.classList.toggle('menu-open', !isOpen);
    });

    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = [...document.querySelectorAll('.reveal')];
  reveals.forEach((node) => {
    const delay = node.dataset.delay;
    if (delay) node.style.setProperty('--reveal-delay', `${delay}ms`);
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 });
    reveals.forEach((node) => observer.observe(node));
  } else {
    reveals.forEach((node) => node.classList.add('is-visible'));
  }

  const progress = document.querySelector('[data-progress]');
  if (progress) {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      progress.style.width = `${value}%`;
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  const sections = [...document.querySelectorAll('.longform section[id]')];
  const tocLinks = [...document.querySelectorAll('.toc a')];
  if (sections.length && tocLinks.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      tocLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`));
    }, { rootMargin: '-22% 0px -64% 0px', threshold: [0, 0.2, 0.6] });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const toc = document.querySelector('[data-toc]');
  if (toc && window.matchMedia('(max-width: 980px)').matches) toc.removeAttribute('open');

  const storyVideos = [...document.querySelectorAll('.story-video-card video')];
  storyVideos.forEach((video) => {
    video.addEventListener('play', () => {
      storyVideos.forEach((otherVideo) => {
        if (otherVideo !== video && !otherVideo.paused) otherVideo.pause();
      });
    });
  });
})();
