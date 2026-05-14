/* ════════════════════════════════════════════
   RÉVEILLONS-NOUS — main.js
   ════════════════════════════════════════════ */

// ── BURGER ───────────────────────────────────
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── NAV ACTIVE AU SCROLL ─────────────────────
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a');

function updateActiveNav() {
  const y = window.scrollY + 80;
  sections.forEach(s => {
    if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) {
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${s.id}`);
      });
    }
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });

// ── SON VIDÉO HERO ───────────────────────────
const heroVideo      = document.getElementById('heroVideo');
const heroSoundBtn   = document.getElementById('heroSoundBtn');
const heroIconMuted  = document.getElementById('heroIconMuted');
const heroIconSound  = document.getElementById('heroIconSound');

const heroFullscreenBtn = document.getElementById('heroFullscreenBtn');
if (heroFullscreenBtn && heroVideo) {
  heroFullscreenBtn.addEventListener('click', () => {
    if (heroVideo.requestFullscreen) heroVideo.requestFullscreen();
    else if (heroVideo.webkitRequestFullscreen) heroVideo.webkitRequestFullscreen();
  });
}

if (heroSoundBtn && heroVideo) {
  heroSoundBtn.addEventListener('click', () => {
    heroVideo.muted = !heroVideo.muted;
    heroIconMuted.style.display = heroVideo.muted ? 'block' : 'none';
    heroIconSound.style.display = heroVideo.muted ? 'none'  : 'block';
  });
}

// ── LIRE PLUS ────────────────────────────────
const heroReadMore = document.getElementById('heroReadMore');
const heroMore     = document.getElementById('heroMore');

if (heroReadMore && heroMore) {
  heroReadMore.addEventListener('click', () => {
    const expanded = !heroMore.hidden;
    heroMore.hidden = expanded;
    heroReadMore.textContent = expanded ? '+ Lire plus' : '− Lire moins';
  });
}

// ── SCROLL REVEAL ────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
    const i = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('visible'), i * 90);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── BARRE DE SIGNATURES ──────────────────────
const GOAL        = 150000;
const RECT_COUNT  = 44;
const sigBarInner = document.getElementById('sigBarInner');

let petitionCount = 276;

fetch('https://petitions.lecese.fr/initiatives/i-821.json')
  .then(r => r.json())
  .then(data => {
    const live = data.supports_count ?? data.online_votes_count ?? data.votes_count ?? null;
    if (typeof live === 'number' && live > 0) petitionCount = live;
  })
  .catch(() => {});

for (let i = 0; i < RECT_COUNT; i++) {
  const rect = document.createElement('div');
  rect.className = 'sig-bar__rect';
  sigBarInner.appendChild(rect);
}

const counterSection = document.getElementById('counter');

const sigBarObs = new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting) return;
  const filled = Math.max(1, Math.round((petitionCount / GOAL) * RECT_COUNT));
  const rects = sigBarInner.querySelectorAll('.sig-bar__rect');
  rects.forEach((r, i) => {
    setTimeout(() => {
      if (i < filled) r.classList.add('signed');
    }, i * 30);
  });
  sigBarObs.disconnect();
}, { threshold: 0.35 });
sigBarObs.observe(counterSection);

// ── COMPTEUR ANIMÉ ───────────────────────────
let counted = false;

function animateCount(el, target, duration = 2500) {
  const start = performance.now();
  const tick = now => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('fr-FR');
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const counterObs = new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting || counted) return;
  counted = true;
  animateCount(document.getElementById('countNum'), petitionCount);
  counterObs.disconnect();
}, { threshold: 0.35 });
counterObs.observe(counterSection);

// ── FAQ ACCORDÉON ────────────────────────────
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq__item');
    const answer = item.querySelector('.faq__answer');
    const isOpen = item.classList.contains('open');

    // Fermer tous les autres + retirer le vert
    document.querySelectorAll('.faq__item.open').forEach(open => {
      if (open !== item) {
        open.classList.remove('open', 'faq__item--green');
        open.querySelector('.faq__answer').style.maxHeight = '0';
      }
    });

    if (isOpen) {
      item.classList.remove('open', 'faq__item--green');
      answer.style.maxHeight = '0';
    } else {
      item.classList.add('open', 'faq__item--green');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ── SLIDER TÉMOIGNAGES ───────────────────────
const track    = document.getElementById('testimonialTrack');
const cards    = [...track.querySelectorAll('.testimonial__card')];
const dotsWrap = document.getElementById('dots');
const prevBtn  = document.getElementById('prevBtn');
const nextBtn  = document.getElementById('nextBtn');

let current  = 0;
let perView  = 3;
let maxIdx   = 0;
let autoTimer;

function getPerView() {
  if (window.innerWidth < 769) return 1;
  return 2;
}

function buildDots() {
  dotsWrap.innerHTML = '';
  maxIdx = Math.max(0, cards.length - perView);
  for (let i = 0; i <= maxIdx; i++) {
    const dot = document.createElement('button');
    dot.className = 'testimonials__dot' + (i === current ? ' active' : '');
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
    dotsWrap.appendChild(dot);
  }
}

function updateDots() {
  document.querySelectorAll('.testimonials__dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
}

function goTo(idx) {
  current = Math.max(0, Math.min(idx, maxIdx));
  const w = cards[0].offsetWidth + 42;
  track.style.transform = `translateX(-${current * w}px)`;
  updateDots();
}

function setup() {
  perView = getPerView();
  maxIdx  = Math.max(0, cards.length - perView);
  current = Math.min(current, maxIdx);
  buildDots();
  goTo(current);
}

prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

function startAuto() {
  autoTimer = setInterval(() => goTo(current < maxIdx ? current + 1 : 0), 5000);
}
function resetAuto() { clearInterval(autoTimer); startAuto(); }

window.addEventListener('resize', setup);
setup();
startAuto();

// ── FORMULAIRE CONTACT ───────────────────────
function setError(inputEl, errorEl, msg) {
  inputEl.classList.toggle('form__input--error', !!msg);
  inputEl.classList.toggle('form__textarea--error', !!msg);
  errorEl.textContent = msg;
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();

  const email   = document.getElementById('contactEmail');
  const message = document.getElementById('contactMessage');
  const feedback = document.getElementById('contactFeedback');

  let valid = true;

  setError(email, document.getElementById('errEmail'),
    !email.value.trim() ? 'L\'adresse e-mail est obligatoire.' :
    !isValidEmail(email.value.trim()) ? 'Adresse e-mail invalide.' : '');
  if (!email.value.trim() || !isValidEmail(email.value.trim())) valid = false;

  setError(message, document.getElementById('errMessage'),
    !message.value.trim() ? 'Le message est obligatoire.' : '');
  if (!message.value.trim()) valid = false;

  feedback.className = 'form__feedback';

  if (!valid) {
    feedback.textContent = 'Veuillez corriger les erreurs avant d\'envoyer.';
    feedback.classList.add('form__feedback--error');
    return;
  }

  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = 'Envoi en cours…';
  btn.disabled = true;

  setTimeout(() => {
    feedback.textContent = 'Une erreur est survenue. Veuillez réessayer plus tard ou nous contacter directement par e-mail.';
    feedback.classList.add('form__feedback--error');
    btn.textContent = 'Envoyer';
    btn.disabled = false;
  }, 1200);
});

// ── NEWSLETTER ───────────────────────────────
document.getElementById('newsletterBtn').addEventListener('click', () => {
  const input    = document.getElementById('newsletterEmail');
  const errEl    = document.getElementById('errNewsletter');
  const feedback = document.getElementById('newsletterFeedback');

  feedback.textContent = '';
  feedback.style.color = '';

  if (!input.value.trim() || !isValidEmail(input.value.trim())) {
    errEl.textContent = 'Veuillez entrer une adresse e-mail valide.';
    input.style.borderColor = '#e53e3e';
    return;
  }

  errEl.textContent = '';
  input.style.borderColor = '';

  setTimeout(() => {
    feedback.textContent = 'Une erreur est survenue. Veuillez réessayer plus tard.';
    feedback.style.color = '#c53030';
  }, 800);
});

// ── BOUTON FLOTTANT ──────────────────────────
const floatCta = document.getElementById('floatCta');

let scrollTimer;
window.addEventListener('scroll', () => {
  floatCta.classList.add('hidden');
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    const atBottom = (window.scrollY + window.innerHeight) > document.querySelector('.footer').offsetTop - 80;
    if (!atBottom) floatCta.classList.remove('hidden');
  }, 500);
}, { passive: true });

// ── SMOOTH SCROLL (offset nav) ───────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
  });
});
