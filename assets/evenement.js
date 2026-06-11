/* ════════════════════════════════════════════
   PAGE DÉTAIL ÉVÉNEMENT — evenement.js
   ════════════════════════════════════════════ */

const MOIS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

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

// ── ÉVÉNEMENT ────────────────────────────────
(async function loadEvent() {
  const root = document.getElementById('evtDetailRoot');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');

  if (!id) {
    showError(root, 'Aucun événement spécifié.', true);
    return;
  }

  let ev = null;
  try {
    const cached = sessionStorage.getItem('siteContent');
    const data   = cached ? JSON.parse(cached) : await (await fetch('/api/content')).json();
    if (!cached) sessionStorage.setItem('siteContent', JSON.stringify(data));
    ev = (data.evenements?.liste || []).find(e => e.id === id) || null;
  } catch {
    showError(root, 'Impossible de charger les données.');
    return;
  }

  if (!ev) {
    showError(root, 'Cet événement est introuvable.', true);
    return;
  }

  const date    = new Date(ev.date + (ev.heure ? 'T' + ev.heure : 'T00:00'));
  const dateFmt = `${date.getDate()} ${MOIS[date.getMonth()]}. ${date.getFullYear()}`;
  const cats    = (ev.categories || []).filter(c => c?.trim());
  const catStr  = cats.join(', ');

  // Mettre à jour le title du document
  document.title = `${ev.titre} — Réveillons-nous`;

  root.innerHTML = `
    <!-- Hero -->
    <section class="evtdetail__hero">
      <div class="container">
        <a href="/evenements" class="evtpage__back">← Tous les évènements</a>
        <div class="evtdetail__meta">
          <span class="evtdetail__date">${dateFmt}</span>
          ${catStr ? `<span class="evtdetail__cats">${catStr}</span>` : ''}
        </div>
        <h1 class="evtdetail__title">${ev.titre || '(Sans titre)'}</h1>
        ${ev.heure || ev.lieu ? `
          <div class="evtdetail__where">
            ${ev.heure ? `<span class="evtdetail__info-item">🕐 ${ev.heure}</span>` : ''}
            ${ev.lieu  ? `<span class="evtdetail__info-item">📍 ${ev.lieu}</span>` : ''}
          </div>` : ''}
      </div>
    </section>

    <!-- Corps -->
    <section class="evtdetail__body">
      <div class="container">
        ${ev.description ? `
          <div class="evtdetail__desc">
            ${ev.description}
          </div>` : '<p class="evtdetail__nodesc">Aucune description pour cet événement.</p>'}

        ${ev.lien ? `
          <div class="evtdetail__cta">
            <a href="${ev.lien}" target="_blank" rel="noopener" class="evtdetail__btn">
              Voir l'événement officiel →
            </a>
          </div>` : ''}
      </div>
    </section>
  `;
})();

function showError(root, msg, withBack = false) {
  root.innerHTML = `
    <section class="evtdetail__hero">
      <div class="container">
        ${withBack ? '<a href="/evenements" class="evtpage__back">← Tous les évènements</a>' : ''}
        <p style="color:rgba(255,255,255,0.5); margin-top:24px;">${msg}</p>
      </div>
    </section>`;
}
