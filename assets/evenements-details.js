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

  function esc(s) {
    return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function safeUrl(url) {
    try { const u = new URL(url || ''); return ['http:','https:'].includes(u.protocol) ? url : ''; }
    catch { return ''; }
  }

  function renderItem(ev) {
    const dateFmt  = formatDate(ev._date);
    const cats     = (ev.categories || []).filter(c => c?.trim()).map(esc);
    const catStr   = cats.join(', ');
    const infoParts = [];
    if (ev.heure) infoParts.push(esc(ev.heure));
    if (ev.lieu)  infoParts.push(esc(ev.lieu));
    const footInfo = infoParts.join(' · ');
    const titre    = esc(ev.titre) || '(Sans titre)';
    const desc     = ev.description ? DOMPurify.sanitize(ev.description) : '';
    const lien     = safeUrl(ev.lien);

    return `<div class="evtlist__item" id="evt-${esc(ev.id)}">
      <div class="evtlist__meta">${dateFmt}${catStr ? ` · ${catStr}` : ''}${footInfo ? ` · ${footInfo}` : ''}</div>
      <h2 class="evtlist__title">${titre}</h2>
      ${desc ? `<div class="evtlist__desc">${desc}</div>` : ''}
      ${lien ? `<a href="${esc(lien)}" target="_blank" rel="noopener" class="evtlist__link">Voir l'événement →</a>` : ''}
    </div>`;
  }

  function renderList(events) {
    return events.map((ev, i) =>
      renderItem(ev) + (i < events.length - 1 ? '<hr class="evtlist__sep" />' : '')
    ).join('');
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
            ${renderList(upcoming)}
          </div>` : ''}

        ${past.length ? `
          <div class="evtpage__section">
            <p class="evtpage__section-title evtpage__section-title--dim">Passés · ${past.length}</p>
            ${renderList(past)}
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
