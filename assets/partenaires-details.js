/* ════════════════════════════════════════════
   PAGE LISTING PARTENAIRES — partenaires-details.js
   ════════════════════════════════════════════ */

// ── NAV BURGER ───────────────────────────────
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
if (burger && navLinks) {
  burger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ── NAV SCROLL ───────────────────────────────
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── LOGO + FAVICON (depuis le dashboard) ─────
(async function applyGlobalBranding() {
  try {
    const cached = sessionStorage.getItem('siteContent');
    const data = cached ? JSON.parse(cached) : await (await fetch('/api/content')).json();
    if (!cached) sessionStorage.setItem('siteContent', JSON.stringify(data));
    const g = data.global;
    if (!g) return;
    if (g.logoUrl) {
      document.querySelectorAll('.nav__logo-img, .footer__logo-img').forEach(img => img.setAttribute('src', g.logoUrl));
    }
    if (g.logoAlt) {
      document.querySelectorAll('.nav__logo-img, .footer__logo-img').forEach(img => img.setAttribute('alt', g.logoAlt));
    }
    if (g.favicon) {
      document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach(link => link.setAttribute('href', g.favicon));
    }
  } catch {}
})();

// ── NEWSLETTER ───────────────────────────────
(function initNewsletter() {
  const btn      = document.getElementById('newsletterBtn');
  const input    = document.getElementById('newsletterEmail');
  const feedback = document.getElementById('newsletterFeedback');
  if (!btn || !input) return;
  btn.addEventListener('click', async () => {
    const email = input.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (feedback) { feedback.textContent = 'Adresse e-mail invalide.'; feedback.style.color = '#ef4444'; }
      return;
    }
    btn.disabled = true;
    try {
      await emailjs.send('service_yp3vwuq', 'template_newsletter', { email });
      if (feedback) { feedback.textContent = 'Merci pour votre inscription !'; feedback.style.color = '#b9ff66'; }
      input.value = '';
    } catch {
      if (feedback) { feedback.textContent = 'Erreur, réessayez.'; feedback.style.color = '#ef4444'; }
    } finally {
      btn.disabled = false;
    }
  });
})();

// ── LISTING PARTENAIRES ──────────────────────
(async function loadPartners() {
  const grid  = document.getElementById('partnersGrid');
  const title = document.getElementById('partnersPageTitle');
  const empty = document.getElementById('partnersEmpty');
  if (!grid) return;

  let data;
  try {
    const cached = sessionStorage.getItem('siteContent');
    data = cached ? JSON.parse(cached) : await (await fetch('/api/content')).json();
    if (!cached) sessionStorage.setItem('siteContent', JSON.stringify(data));
  } catch {
    if (empty) { empty.textContent = 'Impossible de charger les partenaires.'; empty.style.display = ''; }
    return;
  }

  const partenaires = data.partenaires || {};
  const logos = partenaires.logos || [];

  if (partenaires.pageTitre) {
    title.textContent = partenaires.pageTitre;
    document.title = `${partenaires.pageTitre} — Réveillons-nous`;
  }

  if (!logos.length) {
    if (empty) empty.style.display = '';
    return;
  }

  grid.innerHTML = logos.map(l => {
    const url = (l.url || '').replace(/"/g, '&quot;');
    const alt = (l.alt || '').replace(/"/g, '&quot;');
    return `<div class="partnerspage__item">
      <img src="${url}" alt="${alt}" class="partnerspage__img" loading="lazy" />
    </div>`;
  }).join('');
})();
