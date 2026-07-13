// ==========================================================================
// PeerInsight — interactions
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Page loader ---------- */
  const loader = document.getElementById('pageLoader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('hidden'), 300);
  });

  /* ---------- Navbar scroll state + mobile toggle ---------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 12);
    toTopBtn.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', navMenu.classList.contains('open'));
  });
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
  }));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const goldSpan = el.querySelector('.gold');
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = Math.floor(eased * target);
        el.textContent = val + suffix;
        if (goldSpan) { /* preserved via textContent overwrite intentionally omitted */ }
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => counterIO.observe(el));

  /* ---------- Service modals ---------- */
  const modalOverlay = document.getElementById('serviceModal');
  const modalIcon = document.getElementById('modalIcon');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  const serviceDetails = {
    critical: {
      title: 'Critical Issues (Must Fix)',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z"/></svg>',
      points: [
        'Major gaps in argument, methodology, or evidence',
        'Inconsistencies that could affect examiner confidence',
        'Issues that typically require attention before submission',
        'Clearly flagged and explained, not just listed'
      ]
    },
    minor: {
      title: 'Minor Issues',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>',
      points: [
        'Optional refinements that strengthen an already solid draft',
        'Wording, clarity, and emphasis suggestions',
        'Presentation touches that add polish',
        'Prioritised so you know what matters most'
      ]
    },
    biblio: {
      title: 'Bibliography & Citation Review',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>',
      points: [
        'Citation style consistency (APA, MLA, Chicago, IEEE and more)',
        'Cross-check of in-text citations against the reference list',
        'Formatting and completeness of each entry',
        'Flags for missing or mismatched sources'
      ]
    },
    language: {
      title: 'Language & Grammar Review',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>',
      points: [
        'Grammar, punctuation, and sentence-level clarity',
        'Academic tone and register',
        'Repetition and awkward phrasing flagged with suggestions',
        'Readability improvements that preserve your voice'
      ]
    },
    structure: {
      title: 'Structure & Formatting Review',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
      points: [
        'Logical flow between chapters and sections',
        'Heading hierarchy and numbering consistency',
        'Formatting against common university guidelines',
        'Overall readability and visual organisation'
      ]
    }
  };

  document.querySelectorAll('[data-service]').forEach(btn => {
    btn.addEventListener('click', () => {
      const data = serviceDetails[btn.dataset.service];
      if (!data) return;
      modalIcon.innerHTML = data.icon;
      modalTitle.textContent = data.title;
      modalBody.innerHTML = `<ul>${data.points.map(p => `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m20 6-11 11-5-5"/></svg><span>${p}</span></li>`).join('')}</ul>`;
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.getElementById('modalClose').addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !isOpen);
      q.setAttribute('aria-expanded', String(!isOpen));
      a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
    });
  });

  /* ---------- Testimonial slider ---------- */
  const track = document.getElementById('testiSlides');
  const slides = track ? Array.from(track.children) : [];
  const dotsWrap = document.getElementById('testiDots');
  let testiIndex = 0;
  let testiTimer;

  if (slides.length) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    });

    function goToSlide(i) {
      testiIndex = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${testiIndex * 100}%)`;
      dotsWrap.querySelectorAll('.testi-dot').forEach((d, idx) => d.classList.toggle('active', idx === testiIndex));
    }
    document.getElementById('testiPrev').addEventListener('click', () => { goToSlide(testiIndex - 1); resetTimer(); });
    document.getElementById('testiNext').addEventListener('click', () => { goToSlide(testiIndex + 1); resetTimer(); });

    function resetTimer() {
      clearInterval(testiTimer);
      testiTimer = setInterval(() => goToSlide(testiIndex + 1), 6000);
    }
    resetTimer();
  }

  /* ---------- Contact form (Netlify Forms ready) ---------- */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', function (e) {
      // Netlify will intercept this submission in production (data-netlify="true").
      // For local preview we prevent default and show a confirmation state.
      if (window.location.hostname === '' || window.location.protocol === 'file:') {
        e.preventDefault();
        successMsg.classList.add('show');
        form.reset();
        setTimeout(() => successMsg.classList.remove('show'), 6000);
      }
    });
  }

  /* ---------- Back to top ---------- */
  const toTopBtn = document.getElementById('toTopBtn');
  toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

});
