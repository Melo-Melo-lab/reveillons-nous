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

let petitionCount   = 312; // valeur de repli mise à jour manuellement
let fetchComplete   = false;
let sectionVisible  = false;
let animationStarted = false;

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

function startCounterAnimation() {
  if (!fetchComplete || !sectionVisible || animationStarted) return;
  animationStarted = true;

  const filled = Math.max(1, Math.round((petitionCount / GOAL) * RECT_COUNT));
  sigBarInner.querySelectorAll('.sig-bar__rect').forEach((r, i) => {
    setTimeout(() => { if (i < filled) r.classList.add('signed'); }, i * 30);
  });

  animateCount(document.getElementById('countNum'), petitionCount);
}

fetch('/api/signatures')
  .then(r => r.json())
  .then(data => {
    if (typeof data.count === 'number' && data.count > 0) petitionCount = data.count;
  })
  .catch(() => {})
  .finally(() => {
    fetchComplete = true;
    startCounterAnimation();
  });

for (let i = 0; i < RECT_COUNT; i++) {
  const rect = document.createElement('div');
  rect.className = 'sig-bar__rect';
  sigBarInner.appendChild(rect);
}

const counterSection = document.getElementById('counter');

const sigBarObs = new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting) return;
  sectionVisible = true;
  sigBarObs.disconnect();
  startCounterAnimation();
}, { threshold: 0.35 });
sigBarObs.observe(counterSection);

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


// ── FORMULAIRE CONTACT ───────────────────────
function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function setError(inputEl, errorEl, msg) {
  inputEl.classList.toggle('form__input--error', !!msg);
  inputEl.classList.toggle('form__textarea--error', !!msg);
  errorEl.textContent = msg;
}

document.getElementById('contactForm')?.addEventListener('submit', async e => {
  e.preventDefault();

  const nom      = document.getElementById('contactNom');
  const email    = document.getElementById('contactEmail');
  const message  = document.getElementById('contactMessage');
  const sujet    = document.getElementById('contactSujet');
  const feedback = document.getElementById('contactFeedback');
  const btn      = e.target.querySelector('button[type=submit]');

  // Validation
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

  btn.textContent = 'Envoi en cours…';
  btn.disabled = true;

  try {
    await emailjs.send('service_yp9ijoq', 'template_fp6bvn3', {
      nom:     nom.value.trim()   || 'Non renseigné',  // {{nom}} dans le corps
      name:    nom.value.trim()   || 'Non renseigné',  // {{name}} dans From Name
      email:   email.value.trim(),                      // {{email}} dans Reply To + corps
      sujet:   sujet.value        || 'Non renseigné',   // {{sujet}}
      message: message.value.trim(),                    // {{message}}
    });
    feedback.textContent = '✓ Message envoyé ! Nous vous répondrons dans les plus brefs délais.';
    feedback.classList.add('form__feedback--success');
    e.target.reset();
  } catch {
    feedback.textContent = 'Une erreur est survenue. Écrivez-nous à contact@reveillons-nous.org';
    feedback.classList.add('form__feedback--error');
  } finally {
    btn.textContent = 'Envoyer';
    btn.disabled = false;
  }
});

// ── NEWSLETTER (Brevo) ───────────────────────────────
// 👉 Remplacer ces deux valeurs après création du compte Brevo
const BREVO_API_KEY = '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';
const BREVO_LIST_ID = 3;

document.getElementById('newsletterBtn')?.addEventListener('click', async () => {
  const input    = document.getElementById('newsletterEmail');
  const errEl    = document.getElementById('errNewsletter');
  const feedback = document.getElementById('newsletterFeedback');
  const btn      = document.getElementById('newsletterBtn');

  feedback.textContent = '';
  feedback.style.color = '';

  if (!input.value.trim() || !isValidEmail(input.value.trim())) {
    errEl.textContent = 'Veuillez entrer une adresse e-mail valide.';
    input.style.borderColor = '#e53e3e';
    return;
  }

  errEl.textContent = '';
  input.style.borderColor = '';
  btn.disabled = true;

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept':       'application/json',
        'content-type': 'application/json',
        'api-key':      BREVO_API_KEY,
      },
      body: JSON.stringify({
        email:         input.value.trim(),
        listIds:       [BREVO_LIST_ID],
        updateEnabled: true,
      }),
    });

    if (res.ok || res.status === 204) {
      feedback.textContent = 'Merci ! Vous êtes bien inscrit(e).';
      feedback.style.color = '#276749';
      input.value = '';
    } else {
      const data = await res.json().catch(() => ({}));
      // 400 + code DUPLICATE_PARAMETER = déjà inscrit
      if (res.status === 400 && data.code === 'duplicate_parameter') {
        feedback.textContent = 'Cette adresse est déjà inscrite.';
        feedback.style.color = '#276749';
      } else {
        throw new Error(data.message || 'Erreur');
      }
    }
  } catch {
    feedback.textContent = 'Une erreur est survenue. Veuillez réessayer plus tard.';
    feedback.style.color = '#c53030';
  } finally {
    btn.disabled = false;
  }
});

// ── BOUTON FLOTTANT ──────────────────────────
const floatCta = document.getElementById('floatCta');

function updateFloatCta() {
  if (!floatCta) return;
  const footer   = document.querySelector('.footer');
  const atBottom = footer && (window.scrollY + window.innerHeight) > footer.offsetTop - 80;
  if (window.scrollY > 80 && !atBottom) {
    floatCta.classList.remove('hidden');
  } else {
    floatCta.classList.add('hidden');
  }
}

window.addEventListener('scroll', updateFloatCta, { passive: true });
updateFloatCta();

// ── FLOAT CTA : INVERSION SUR FOND VERT ─────
function updateFloatCtaTheme() {
  if (!floatCta) return;
  const ctaRect = floatCta.getBoundingClientRect();
  let overGreen = false;

  document.querySelectorAll('.faq__item--green, .btn--green, .sig-bar__rect.signed, .counter__goal').forEach(el => {
    if (overGreen) return;
    const r = el.getBoundingClientRect();
    if (ctaRect.left < r.right && ctaRect.right > r.left &&
        ctaRect.top  < r.bottom && ctaRect.bottom > r.top) {
      overGreen = true;
    }
  });

  floatCta.classList.toggle('float-cta--inverted', overGreen);
}
window.addEventListener('scroll', updateFloatCtaTheme, { passive: true });
updateFloatCtaTheme();

// ── CALENDRIER GOOGLE CALENDAR API ───────────
(function initCalendar() {
  const API_KEY     = 'AIzaSyCkD6tPxJ0HAw8JUTwESMxEOrGnlSUWYNo';
  const CALENDAR_ID = 'f23aa8edc7d1484e74c26f9a8699a7e9e0d49c15a13c03d72804f7db12c1b6de@group.calendar.google.com';
  const MOIS   = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const MOISC  = ['jan.','fév.','mar.','avr.','mai','juin','juil.','aoû.','sep.','oct.','nov.','déc.'];
  const JOURS  = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

  const calGrid   = document.getElementById('calGrid');
  const calEvents = document.getElementById('calEvents');
  const calLabel  = document.getElementById('calMonthLabel');
  const btnPrev   = document.getElementById('calPrev');
  const btnNext   = document.getElementById('calNext');
  if (!calGrid) return;

  let current = new Date();
  let allEvents = [];

  async function fetchEvents() {
    const now  = new Date();
    const min  = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const max  = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    const url  = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${min.toISOString()}&timeMax=${max.toISOString()}&orderBy=startTime&singleEvents=true&maxResults=200`;
    try {
      const data = await fetch(url).then(r => r.json());
      allEvents  = data.items || [];
    } catch(e) { allEvents = []; }
    render();
  }

  function render() {
    const y = current.getFullYear(), m = current.getMonth();
    calLabel.textContent = `${MOIS[m]} ${y}`;
    const firstDay    = new Date(y, m, 1).getDay();
    const offset      = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const today       = new Date();
    const monthEvs    = allEvents.filter(ev => {
      const d = new Date(ev.start.dateTime || ev.start.date);
      return d.getFullYear() === y && d.getMonth() === m;
    });

    let html = JOURS.map(j => `<div class="cal__day-header">${j}</div>`).join('');
    for (let i = 0; i < offset; i++) html += `<div class="cal__day cal__day--empty"></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday   = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
      const hasEvent  = monthEvs.some(ev => new Date(ev.start.dateTime || ev.start.date).getDate() === d);
      html += `<div class="cal__day${isToday?' cal__day--today':''}${hasEvent?' cal__day--has-event':''}" data-day="${d}">
        <span class="cal__day-num">${d}</span>
        ${hasEvent ? '<span class="cal__dot"></span>' : ''}
      </div>`;
    }
    calGrid.innerHTML = html;

    calGrid.querySelectorAll('.cal__day[data-day]').forEach(el => {
      el.addEventListener('click', () => {
        const day = +el.dataset.day;
        const evs = monthEvs.filter(ev => new Date(ev.start.dateTime || ev.start.date).getDate() === day);
        if (evs.length) renderDayEvents(evs);
        else renderUpcoming();
      });
    });
    renderUpcoming();
  }

  function renderDayEvents(evs) {
    calEvents.innerHTML = evs.map(ev => {
      const s    = new Date(ev.start.dateTime || ev.start.date);
      const time = ev.start.dateTime ? s.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}) : 'Toute la journée';
      return `<div class="cal__event-card">
        <div class="cal__event-date">
          <span class="cal__event-day">${String(s.getDate()).padStart(2,'0')}</span>
          <span class="cal__event-month">${MOISC[s.getMonth()]}</span>
        </div>
        <div class="cal__event-info">
          <div class="cal__event-title">${ev.summary || '(Sans titre)'}</div>
          <div class="cal__event-time">${time}</div>
          ${ev.location ? `<div class="cal__event-loc">📍 ${ev.location}</div>` : ''}
        </div>
      </div>`;
    }).join('');
  }

  function renderUpcoming() {
    const now     = new Date();
    const upcoming = allEvents.filter(ev => new Date(ev.start.dateTime || ev.start.date) >= now).slice(0, 3);
    if (!upcoming.length) { calEvents.innerHTML = '<p class="cal__no-events">Aucun évènement à venir.</p>'; return; }
    renderDayEvents(upcoming);
  }

  btnPrev.addEventListener('click', () => { current.setMonth(current.getMonth()-1); render(); });
  btnNext.addEventListener('click', () => { current.setMonth(current.getMonth()+1); render(); });
  fetchEvents();
})();

// ── SMOOTH SCROLL (offset nav) ───────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    try {
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
    } catch (_) {}
  });
});
