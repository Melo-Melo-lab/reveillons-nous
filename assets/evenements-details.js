/* ════════════════════════════════════════════
   PAGE LISTING ÉVÉNEMENTS — evenements-details.js
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

// ── LISTING ÉVÉNEMENTS ───────────────────────
(async function loadEvents() {
  const root = document.getElementById('evtDetailRoot');
  if (!root) return;

  const params     = new URLSearchParams(window.location.search);
  const scrollToId = params.get('id');

  let data;
  try {
    const cached = sessionStorage.getItem('siteContent');
    data = cached ? JSON.parse(cached) : await (await fetch('/api/content')).json();
    if (!cached) sessionStorage.setItem('siteContent', JSON.stringify(data));
  } catch {
    root.innerHTML = `<section class="evtpage__hero"><div class="container">
      <a href="/#evenements" class="evtpage__back">← Retour à l'accueil</a>
      <p style="color:rgba(255,255,255,0.4);margin-top:24px;">Impossible de charger les événements.</p>
    </div></section>`;
    return;
  }

  document.title = 'Tous nos évènements — Réveillons-nous';

  const allEvents = (data.evenements?.liste || []).map(ev => ({
    ...ev,
    _date: new Date(ev.date + (ev.heure ? 'T' + ev.heure : 'T00:00')),
  }));

  const now      = new Date();
  const upcoming = allEvents.filter(ev => ev._date >= now).sort((a, b) => a._date - b._date);
  const past     = allEvents.filter(ev => ev._date < now).sort((a, b) => b._date - a._date);

  function formatDate(d) {
    return `${d.getDate()} ${MOIS[d.getMonth()]}. ${d.getFullYear()}`;
  }

  function renderCard(ev) {
    const dateFmt  = formatDate(ev._date);
    const cats     = (ev.categories || []).filter(c => c?.trim());
    const catStr   = cats.join(', ');
    const infoParts = [];
    if (ev.heure) infoParts.push('🕐 ' + ev.heure);
    if (ev.lieu)  infoParts.push('📍 ' + ev.lieu);
    const footInfo = infoParts.join(' · ');

    return `<div class="evtpage__card" id="evt-${ev.id}">
      <div class="evtpage__card-meta">
        ${dateFmt}${catStr ? ` <span class="evt__cat">| ${catStr}</span>` : ''}
      </div>
      <h2 class="evtpage__card-title">${ev.titre || '(Sans titre)'}</h2>
      ${footInfo ? `<div class="evtpage__card-info">${footInfo}</div>` : ''}
      ${ev.description ? `<div class="evtpage__card-desc">${ev.description}</div>` : ''}
      ${ev.lien ? `<div class="evtpage__card-actions">
        <a href="${ev.lien}" target="_blank" rel="noopener" class="evtpage__card-link">Voir l'événement →</a>
      </div>` : ''}
    </div>`;
  }

  root.innerHTML = `
    <section class="evtpage__hero">
      <div class="container">
        <a href="/#evenements" class="evtpage__back">← Retour à l'accueil</a>
        <h1 class="evtpage__title">Tous nos évènements</h1>
        <p class="evtpage__desc">Retrouvez toutes nos actions, conférences et mobilisations.</p>
      </div>
    </section>

    <section class="evtpage__body">
      <div class="container">
        ${upcoming.length ? `
          <div class="evtpage__section">
            <p class="evtpage__section-title">À venir · ${upcoming.length}</p>
            <div class="evtpage__grid">
              ${upcoming.map(ev => renderCard(ev)).join('')}
            </div>
          </div>` : ''}

        ${past.length ? `
          <div class="evtpage__section">
            <p class="evtpage__section-title evtpage__section-title--dim">Passés · ${past.length}</p>
            <div class="evtpage__grid">
              ${past.map(ev => renderCard(ev)).join('')}
            </div>
          </div>` : ''}

        ${!allEvents.length ? `<p class="evtpage__empty">Aucun événement pour le moment.</p>` : ''}
      </div>
    </section>
  `;

  if (scrollToId) {
    const target = document.getElementById('evt-' + scrollToId);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('evtpage__card--highlight');
      }, 120);
    }
  }
})();
