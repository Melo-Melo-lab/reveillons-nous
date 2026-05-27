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
    const nomVal     = nom.value.trim()     || 'Non renseigné';
    const emailVal   = email.value.trim();
    const sujetVal   = sujet.value          || 'Non renseigné';
    const messageVal = message.value.trim();

    const htmlBody = `
<div style="font-family:Arial,sans-serif;background:#f3f3f3;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;background:#191a23;border-radius:24px;overflow:hidden;">
    <div style="background:#b9ff66;padding:28px 40px;">
      <p style="margin:0;font-size:13px;font-weight:bold;color:#191a23;text-transform:uppercase;letter-spacing:1px;">Réveillons-nous</p>
      <h1 style="margin:6px 0 0;font-size:24px;color:#191a23;">Nouveau message reçu</h1>
    </div>
    <div style="padding:32px 40px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.4);font-size:12px;text-transform:uppercase;letter-spacing:1px;width:100px;">Nom</td>
          <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.1);color:#fff;font-size:15px;">${nomVal}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.4);font-size:12px;text-transform:uppercase;letter-spacing:1px;">Email</td>
          <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.1);color:#b9ff66;font-size:15px;">${emailVal}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.4);font-size:12px;text-transform:uppercase;letter-spacing:1px;">Sujet</td>
          <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.1);color:#fff;font-size:15px;">${sujetVal}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;color:rgba(255,255,255,0.4);font-size:12px;text-transform:uppercase;letter-spacing:1px;vertical-align:top;">Message</td>
          <td style="padding:12px 0;color:#fff;font-size:15px;line-height:1.7;">${messageVal.replace(/\n/g, '<br>')}</td>
        </tr>
      </table>
    </div>
    <div style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.08);">
      <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.3);">© 2026 Réveillons-nous — contact@reveillons-nous.org</p>
    </div>
  </div>
</div>`;

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: 'd010b76e-cfaa-47e2-90e2-10ffb057fdb0',
        subject:    'Nouveau message - ' + sujetVal,
        from_name:  nomVal,
        replyto:    emailVal,
        html:       htmlBody,
      })
    });
    const data = await res.json();
    if (data.success) {
      feedback.textContent = '✓ Message envoyé ! Nous vous répondrons dans les plus brefs délais.';
      feedback.classList.add('form__feedback--success');
      e.target.reset();
    } else {
      throw new Error();
    }
  } catch {
    feedback.textContent = 'Une erreur est survenue. Écrivez-nous à contact@reveillons-nous.org';
    feedback.classList.add('form__feedback--error');
  } finally {
    btn.textContent = 'Envoyer';
    btn.disabled = false;
  }
});

// ── NEWSLETTER ───────────────────────────────
document.getElementById('newsletterBtn')?.addEventListener('click', () => {
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
