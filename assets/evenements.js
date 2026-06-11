/* ════════════════════════════════════════════
   PAGE ÉVÉNEMENTS — evenements.js
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

// ── ÉVÉNEMENTS ───────────────────────────────
(function initEventsPage() {
  const MOIS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

  const filtersEl   = document.getElementById('evtp-filters');
  const upcomingEl  = document.getElementById('evtp-upcoming');
  const pastEl      = document.getElementById('evtp-past');
  const tabUpcoming = document.getElementById('evtp-tab-upcoming');
  const tabPast     = document.getElementById('evtp-tab-past');
  const countUp     = document.getElementById('evtp-count-upcoming');
  const countPast   = document.getElementById('evtp-count-past');
  const titleEl     = document.querySelector('.evtpage__title');
  const descEl      = document.querySelector('.evtpage__desc');

  if (!upcomingEl) return;

  let allEvents    = [];
  let activeFilter = 'Tous';
  let activeTab    = 'upcoming';

  async function load() {
    try {
      const cached = sessionStorage.getItem('siteContent');
      const data   = cached ? JSON.parse(cached) : await (await fetch('/api/content')).json();
      if (!cached) sessionStorage.setItem('siteContent', JSON.stringify(data));

      if (data.evenements) {
        if (titleEl && data.evenements.titre) titleEl.textContent = data.evenements.titre;
        if (descEl  && data.evenements.description) descEl.textContent = data.evenements.description;
        allEvents = (data.evenements.liste || []).map(ev => ({
          ...ev,
          _date: new Date(ev.date + (ev.heure ? 'T' + ev.heure : 'T00:00')),
        }));
      }
    } catch { /* Fallback silencieux */ }
    render();
  }

  function formatDate(d) {
    return `${d.getDate()} ${MOIS[d.getMonth()]}. ${d.getFullYear()}`;
  }

  function getCategories() {
    const cats = new Set();
    allEvents.forEach(ev => (ev.categories || []).forEach(c => { if (c?.trim()) cats.add(c.trim()); }));
    return ['Tous', ...Array.from(cats)];
  }

  function cardHTML(ev) {
    const dateFmt  = formatDate(ev._date);
    const evCats   = (ev.categories || []).filter(c => c?.trim());
    const catStr   = evCats.length ? evCats.join(', ') : '';
    const meta     = catStr ? `${dateFmt} <span class="evt__cat">| ${catStr}</span>` : dateFmt;
    const footInfo = [ev.heure, ev.lieu].filter(Boolean).join(' · ');
    return `
      <article class="evtpage__card">
        <div class="evtpage__card-meta">${meta}</div>
        <h2 class="evtpage__card-title">${ev.titre || '(Sans titre)'}</h2>
        ${ev.description ? `<p class="evtpage__card-desc">${ev.description}</p>` : ''}
        ${footInfo ? `<div class="evtpage__card-info">${footInfo}</div>` : ''}
        ${ev.lien
          ? `<a class="evtpage__card-link" href="${ev.lien}" target="_blank" rel="noopener">Voir l'événement →</a>`
          : ''}
      </article>`;
  }

  function render() {
    const cats = getCategories();

    if (filtersEl) {
      filtersEl.innerHTML = cats.map(c =>
        `<button class="evt__filter-btn${c === activeFilter ? ' evt__filter-btn--active' : ''}" data-cat="${c}">${c}</button>`
      ).join('');
      filtersEl.querySelectorAll('.evt__filter-btn').forEach(btn => {
        btn.addEventListener('click', () => { activeFilter = btn.dataset.cat; render(); });
      });
    }

    const now     = new Date();
    const filtered = allEvents.filter(ev =>
      activeFilter === 'Tous' || (ev.categories || []).map(c => c.trim()).includes(activeFilter)
    );
    const upcoming = filtered.filter(ev => ev._date >= now).sort((a, b) => a._date - b._date);
    const past     = filtered.filter(ev => ev._date <  now).sort((a, b) => b._date - a._date);

    if (countUp)   countUp.textContent   = upcoming.length;
    if (countPast) countPast.textContent = past.length;

    upcomingEl.innerHTML = upcoming.length
      ? upcoming.map(cardHTML).join('')
      : '<p class="evtpage__empty">Aucun événement à venir.</p>';

    if (pastEl) {
      pastEl.innerHTML = past.length
        ? past.map(cardHTML).join('')
        : '<p class="evtpage__empty">Aucun événement passé.</p>';
    }
  }

  if (tabUpcoming && tabPast) {
    tabUpcoming.addEventListener('click', () => {
      activeTab = 'upcoming';
      tabUpcoming.classList.add('evtpage__tab--active');
      tabPast.classList.remove('evtpage__tab--active');
      upcomingEl.style.display = '';
      if (pastEl) pastEl.style.display = 'none';
    });
    tabPast.addEventListener('click', () => {
      activeTab = 'past';
      tabPast.classList.add('evtpage__tab--active');
      tabUpcoming.classList.remove('evtpage__tab--active');
      upcomingEl.style.display = 'none';
      if (pastEl) pastEl.style.display = '';
    });
  }

  load();
})();
