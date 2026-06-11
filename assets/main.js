/* ════════════════════════════════════════════
   RÉVEILLONS-NOUS — main.js
   ════════════════════════════════════════════ */

// ── CONTENU DYNAMIQUE DEPUIS L'API ───────────
async function initContent() {
  let data;
  try {
    const cached = sessionStorage.getItem('siteContent');
    if (cached) {
      data = JSON.parse(cached);
    } else {
      const res = await fetch('/api/content');
      if (!res.ok) throw new Error('API indisponible');
      data = await res.json();
      sessionStorage.setItem('siteContent', JSON.stringify(data));
    }
    applyContent(data);
  } catch {
    // Fallback silencieux : les valeurs hardcodées dans le HTML restent affichées
  }
}

function applyContent(d) {
  // Navigation
  if (d.navigation?.liens) {
    const items = document.querySelectorAll('.nav__links li a');
    d.navigation.liens.forEach((lien, i) => {
      if (items[i]) {
        items[i].textContent = lien.label;
        items[i].setAttribute('href', lien.href);
      }
    });
  }
  // Hero
  if (d.hero) {
    setTextContent('#hero .hero__title', d.hero.titre);
    setTextContent('#hero .hero__text', d.hero.texte);
    const heroVideo = document.querySelector('#heroVideo source');
    if (heroVideo && d.hero.videoUrl) heroVideo.setAttribute('src', d.hero.videoUrl);
    const heroBtn = document.querySelector('#hero .btn.btn--dark');
    if (heroBtn) {
      if (d.hero.ctaLabel) heroBtn.textContent = d.hero.ctaLabel;
      if (d.hero.ctaHref)  heroBtn.setAttribute('href', d.hero.ctaHref);
    }
  }
  // Pétition
  if (d.petition) {
    setTextContent('#counter .heading__label', d.petition.labelSection);
    setTextContent('#counter .heading__desc', d.petition.description);
    const floatCta = document.getElementById('floatCta');
    if (floatCta) {
      if (d.petition.ctaLabel) floatCta.textContent = d.petition.ctaLabel;
      if (d.petition.urlPetitionExterne) floatCta.setAttribute('href', d.petition.urlPetitionExterne);
    }
  }
  // Témoignages
  if (d.temoignages) {
    setTextContent('#temoignages .heading__label', d.temoignages.titre);
    setTextContent('#temoignages .heading__desc', d.temoignages.description);
    const temoBtn = document.querySelector('#temoignages .btn.btn--dark');
    if (temoBtn) {
      if (d.temoignages.ctaLabel) temoBtn.textContent = d.temoignages.ctaLabel;
      if (d.temoignages.ctaHref)  temoBtn.setAttribute('href', d.temoignages.ctaHref);
    }
  }
  // Événements
  if (d.evenements) {
    setTextContent('#evenements .heading__label', d.evenements.titre);
    setTextContent('#evenements .heading__desc', d.evenements.description);
  }
  // FAQ
  if (d.faq) {
    setTextContent('#faq .heading__label', d.faq.titre);
    setInnerHTML('#faq .heading__desc', d.faq.description);
    if (d.faq.items?.length) {
      renderFAQ(d.faq.items);
    }
  }
  // Contact
  if (d.contact) {
    setTextContent('#contact .heading__label', d.contact.titre);
    setTextContent('#contact .heading__desc', d.contact.description);
    if (d.contact.formulaire?.sujets) {
      const select = document.getElementById('contactSujet');
      if (select) {
        select.innerHTML = '<option value="" disabled selected>Choisir un sujet</option>';
        d.contact.formulaire.sujets.forEach(s => {
          const opt = document.createElement('option');
          opt.textContent = s;
          select.appendChild(opt);
        });
      }
    }
    if (d.contact.formulaire?.actif === false) {
      const form = document.getElementById('contactForm');
      if (form) form.style.display = 'none';
    }
  }
  // Footer
  if (d.footer) {
    setTextContent('.footer__bottom span', d.footer.copyright);
    setHref('footer a[href^="mailto"]', `mailto:${d.footer.emailContact}`);
    const emailLink = document.querySelector('footer a[href^="mailto"]');
    if (emailLink && d.footer.emailContact) emailLink.textContent = d.footer.emailContact;
    const footerNavLinks = document.querySelectorAll('.footer__nav a');
    if (d.footer.liens) {
      d.footer.liens.forEach((lien, i) => {
        if (footerNavLinks[i]) {
          footerNavLinks[i].textContent = lien.label;
          footerNavLinks[i].setAttribute('href', lien.href);
        }
      });
    }
    if (d.footer.newsletter) {
      const input = document.getElementById('newsletterEmail');
      if (input && d.footer.newsletter.placeholder) input.setAttribute('placeholder', d.footer.newsletter.placeholder);
      const btn = document.getElementById('newsletterBtn');
      if (btn && d.footer.newsletter.ctaLabel) btn.textContent = d.footer.newsletter.ctaLabel;
    }
    // Réseaux sociaux
    if (d.contact?.reseauxSociaux) {
      const socials = d.contact.reseauxSociaux;
      const links = document.querySelectorAll('.footer__social');
      links.forEach(link => {
        const label = link.getAttribute('aria-label')?.toLowerCase();
        if (label === 'facebook' && socials.facebook) link.setAttribute('href', socials.facebook);
        if (label === 'instagram' && socials.instagram) link.setAttribute('href', socials.instagram);
        if (label === 'youtube' && socials.youtube) link.setAttribute('href', socials.youtube);
        if (label === 'discord' && socials.discord) link.setAttribute('href', socials.discord);
      });
    }
  }

  // Stocker les événements pour le calendrier (appelé après initContent)
  if (d.evenements?.liste) {
    window._siteEvents = d.evenements.liste;
    if (window._calendarReady) renderCalendar(window._siteEvents);
  }
}

function setTextContent(selector, text) {
  if (!text) return;
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}

function setInnerHTML(selector, html) {
  if (!html) return;
  const el = document.querySelector(selector);
  if (el) el.innerHTML = html;
}

function setHref(selector, href) {
  if (!href) return;
  const el = document.querySelector(selector);
  if (el) el.setAttribute('href', href);
}

function renderFAQ(items) {
  const list = document.querySelector('.faq__list');
  if (!list) return;
  list.innerHTML = items.map((item, idx) => `
    <div class="faq__item${idx === 0 ? ' faq__item--green open' : ''}">
      <div class="faq__question">
        <span class="faq__num">${item.numero}</span>
        <span class="faq__q-text">${item.question}</span>
        <div class="faq__icon"></div>
      </div>
      <div class="faq__answer"${idx === 0 ? ' style="max-height:600px"' : ''}>
        <div class="faq__answer-inner">${item.reponse}</div>
      </div>
    </div>
  `).join('');
  // Réattacher l'accordéon
  initFAQ();
}

// Lancer la récupération du contenu en premier
initContent();

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

let petitionCount   = 312;
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
function initFAQ() {
  document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq__item');
      const answer = item.querySelector('.faq__answer');
      const isOpen = item.classList.contains('open');

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
}

initFAQ();

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
      nom:     nom.value.trim()   || 'Non renseigné',
      name:    nom.value.trim()   || 'Non renseigné',
      email:   email.value.trim(),
      sujet:   sujet.value        || 'Non renseigné',
      message: message.value.trim(),
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

// ── NEWSLETTER (Brevo) ───────────────────────
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

// ── YOUTUBE SHORTS ───────────────────────────
const YT_API_KEY = 'AIzaSyBhqZtvJxQqhHtL0hASB2u-vCapQLMoqr0';

function parseDuration(d) {
  const m = d.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  return (parseInt(m?.[1] || 0) * 3600) + (parseInt(m?.[2] || 0) * 60) + parseInt(m?.[3] || 0);
}

async function loadShorts() {
  const grid = document.getElementById('shortsGrid');
  if (!grid) return;
  try {
    const chRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=ia.reveillonsnous&key=${YT_API_KEY}`
    );
    const chData = await chRes.json();
    const uploadsId = chData.items[0].contentDetails.relatedPlaylists.uploads;

    const plRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${uploadsId}&key=${YT_API_KEY}`
    );
    const plData = await plRes.json();
    const videoIds = plData.items.map(i => i.snippet.resourceId.videoId).join(',');

    const vRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${YT_API_KEY}`
    );
    const vData = await vRes.json();

    const shorts = vData.items.filter(v => {
      const secs = parseDuration(v.contentDetails.duration);
      const hasTag = /short/i.test(v.snippet.title + ' ' + v.snippet.description);
      return secs <= 180 || hasTag;
    }).slice(0, 8);

    grid.innerHTML = shorts.map(v => {
      const thumb = v.snippet.thumbnails.maxres?.url || v.snippet.thumbnails.high?.url || v.snippet.thumbnails.medium?.url;
      const title = v.snippet.title.replace(/"/g, '&quot;');
      return `
        <a class="short__card" href="https://www.youtube.com/shorts/${v.id}" target="_blank" rel="noopener" aria-label="${title}">
          <img src="${thumb}" alt="${title}" loading="lazy">
          <div class="short__play">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </a>`;
    }).join('');
  } catch (e) {
    console.error('YouTube Shorts:', e);
  }
}

loadShorts();

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

// ── CALENDRIER (données admin) ────────────────
(function initCalendarModule() {
  const MOIS  = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const MOISC = ['jan.','fév.','mar.','avr.','mai','juin','juil.','aoû.','sep.','oct.','nov.','déc.'];
  const JOURS = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

  const calGrid   = document.getElementById('calGrid');
  const calEvents = document.getElementById('calEvents');
  const calLabel  = document.getElementById('calMonthLabel');
  const btnPrev   = document.getElementById('calPrev');
  const btnNext   = document.getElementById('calNext');
  if (!calGrid) return;

  let current   = new Date();
  let allEvents = [];

  window.renderCalendar = function(events) {
    allEvents = (events || []).map(ev => ({
      ...ev,
      _date: new Date(ev.date + (ev.heure ? 'T' + ev.heure : 'T00:00')),
    }));
    render();
  };

  window._calendarReady = true;
  // Si les données sont déjà disponibles (fetch API avant init)
  if (window._siteEvents) {
    window.renderCalendar(window._siteEvents);
  } else {
    render(); // Affiche un calendrier vide en attendant
  }

  function render() {
    const y = current.getFullYear(), m = current.getMonth();
    calLabel.textContent = `${MOIS[m]} ${y}`;
    const firstDay    = new Date(y, m, 1).getDay();
    const offset      = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const today       = new Date();
    const monthEvs    = allEvents.filter(ev => {
      return ev._date.getFullYear() === y && ev._date.getMonth() === m;
    });

    let html = JOURS.map(j => `<div class="cal__day-header">${j}</div>`).join('');
    for (let i = 0; i < offset; i++) html += `<div class="cal__day cal__day--empty"></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday  = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
      const hasEvent = monthEvs.some(ev => ev._date.getDate() === d);
      html += `<div class="cal__day${isToday?' cal__day--today':''}${hasEvent?' cal__day--has-event':''}" data-day="${d}">
        <span class="cal__day-num">${d}</span>
        ${hasEvent ? '<span class="cal__dot"></span>' : ''}
      </div>`;
    }
    calGrid.innerHTML = html;

    calGrid.querySelectorAll('.cal__day[data-day]').forEach(el => {
      el.addEventListener('click', () => {
        const day = +el.dataset.day;
        const evs = monthEvs.filter(ev => ev._date.getDate() === day);
        if (evs.length) renderDayEvents(evs);
        else renderUpcoming();
      });
    });
    renderUpcoming();
  }

  function renderDayEvents(evs) {
    calEvents.innerHTML = evs.map(ev => {
      const s    = ev._date;
      const time = ev.heure || 'Toute la journée';
      return `<div class="cal__event-card">
        <div class="cal__event-date">
          <span class="cal__event-day">${String(s.getDate()).padStart(2,'0')}</span>
          <span class="cal__event-month">${MOISC[s.getMonth()]}</span>
        </div>
        <div class="cal__event-info">
          <div class="cal__event-title">${ev.titre || '(Sans titre)'}</div>
          <div class="cal__event-time">${time}</div>
          ${ev.lieu ? `<div class="cal__event-loc">📍 ${ev.lieu}</div>` : ''}
          ${ev.lien ? `<a class="cal__event-link" href="${ev.lien}" target="_blank" rel="noopener">Voir l'événement →</a>` : ''}
        </div>
      </div>`;
    }).join('');
  }

  function renderUpcoming() {
    const now      = new Date();
    const upcoming = allEvents.filter(ev => ev._date >= now)
      .sort((a, b) => a._date - b._date)
      .slice(0, 3);
    if (!upcoming.length) {
      calEvents.innerHTML = '<p class="cal__no-events">Aucun évènement à venir.</p>';
      return;
    }
    renderDayEvents(upcoming);
  }

  btnPrev.addEventListener('click', () => { current.setMonth(current.getMonth()-1); render(); });
  btnNext.addEventListener('click', () => { current.setMonth(current.getMonth()+1); render(); });
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

// ── ACCÈS ADMIN CACHÉ ────────────────────────

// --- Méthode 1 : 5 clics rapides sur l'année copyright (footer) ---
(function initClickSecret() {
  const footerBottom = document.querySelector('.footer__bottom span');
  if (!footerBottom) return;
  let clicks = 0, timer = null;
  footerBottom.style.cursor = 'default';
  footerBottom.addEventListener('click', () => {
    clicks++;
    clearTimeout(timer);
    timer = setTimeout(() => { clicks = 0; }, 2000);
    if (clicks >= 5) {
      clicks = 0;
      openAdminLogin();
    }
  });
})();

// --- Méthode 2 : Code Konami (↑↑↓↓←→←→A) ---
(function initKonami() {
  const SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','a'];
  let pos = 0;
  document.addEventListener('keydown', e => {
    if (!e.key) return;
    if (e.key.toLowerCase() === SEQ[pos].toLowerCase() || e.key === SEQ[pos]) {
      pos++;
      if (pos === SEQ.length) {
        pos = 0;
        openAdminLogin();
      }
    } else {
      pos = e.key === SEQ[0] ? 1 : 0;
    }
  });
})();

// --- Méthode 3 : URL /gate?k=TOKEN ---
(function initGateAccess() {
  if (window.location.pathname !== '/gate') return;
  const params = new URLSearchParams(window.location.search);
  const k = params.get('k');
  if (!k) { window.location.replace('/'); return; }
  fetch(`/api/auth/gate?k=${encodeURIComponent(k)}`)
    .then(r => r.json())
    .then(data => {
      if (data.authorized) {
        history.replaceState({}, '', '/');
        openAdminLogin();
      } else {
        window.location.replace('/');
      }
    })
    .catch(() => window.location.replace('/'));
})();

// --- Modal de login ---
function openAdminLogin() {
  if (document.getElementById('adminLoginModal')) return;

  const modal = document.createElement('div');
  modal.id = 'adminLoginModal';
  modal.innerHTML = `
    <div class="admin-login__overlay"></div>
    <div class="admin-login__box">
      <form class="admin-login__form" id="adminLoginForm" autocomplete="off">
        <input
          type="password"
          id="adminLoginPassword"
          class="admin-login__input"
          placeholder="Mot de passe"
          autofocus
        />
        <div class="admin-login__error" id="adminLoginError"></div>
        <button type="submit" class="admin-login__btn">Connexion</button>
      </form>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #adminLoginModal {
      position: fixed; inset: 0; z-index: 9999;
      display: flex; align-items: center; justify-content: center;
    }
    .admin-login__overlay {
      position: absolute; inset: 0;
      background: rgba(25,26,35,0.92);
      backdrop-filter: blur(8px);
    }
    .admin-login__box {
      position: relative; z-index: 1;
      background: #fff; border-radius: 14px;
      padding: 40px 48px; min-width: 320px;
    }
    .admin-login__form { display: flex; flex-direction: column; gap: 16px; }
    .admin-login__input {
      padding: 14px 18px; border-radius: 8px;
      border: 1.5px solid #e1e2e9; font-size: 1rem;
      font-family: inherit; outline: none;
    }
    .admin-login__input:focus { border-color: #191a23; }
    .admin-login__error { color: #c53030; font-size: 0.875rem; min-height: 20px; }
    .admin-login__btn {
      padding: 14px; border-radius: 8px;
      background: #191a23; color: #fff;
      border: none; font-size: 1rem; font-family: inherit;
      cursor: pointer; transition: background .2s;
    }
    .admin-login__btn:hover { background: #2d2f3d; }
    .admin-login__btn:disabled { opacity: .6; cursor: not-allowed; }
  `;

  document.head.appendChild(style);
  document.body.appendChild(modal);

  document.getElementById('adminLoginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const password = document.getElementById('adminLoginPassword').value;
    const errorEl  = document.getElementById('adminLoginError');
    const btn      = e.target.querySelector('button');

    errorEl.textContent = '';
    btn.disabled = true;
    btn.textContent = '…';

    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        sessionStorage.setItem('adminToken', data.token);
        window.location.href = '/admin';
      } else {
        errorEl.textContent = data.error || 'Mot de passe incorrect';
        btn.disabled = false;
        btn.textContent = 'Connexion';
      }
    } catch {
      errorEl.textContent = 'Erreur de connexion';
      btn.disabled = false;
      btn.textContent = 'Connexion';
    }
  });

  // Fermer en cliquant sur l'overlay (optionnel, discret)
  modal.querySelector('.admin-login__overlay').addEventListener('click', () => {
    modal.remove();
  });
}
