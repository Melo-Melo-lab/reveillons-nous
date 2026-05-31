const CALENDAR_ID = 'f23aa8edc7d1484e74c26f9a8699a7e9e0d49c15a13c03d72804f7db12c1b6de%40group.calendar.google.com';

module.exports = async function handler(req, res) {
  try {
    const response = await fetch(
      `https://calendar.google.com/calendar/ical/${CALENDAR_ID}/public/basic.ics`,
      { headers: { 'User-Agent': 'reveillons-nous-bot/1.0' } }
    );
    if (!response.ok) throw new Error('HTTP ' + response.status);

    const ical = await response.text();
    const events = parseIcal(ical);

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ events });
  } catch (err) {
    console.error('events API error:', err.message);
    res.status(500).json({ events: [] });
  }
};

function unfold(ical) {
  return ical.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '');
}

function parseIcalDate(str) {
  const s = str.replace(/^TZID=[^:]+:/, '').replace('Z', '');
  if (s.length === 8) {
    return new Date(`${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}T00:00:00`);
  }
  return new Date(
    `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}T${s.slice(9,11)}:${s.slice(11,13)}:${s.slice(13,15)}`
  );
}

function parseIcal(raw) {
  const text = unfold(raw);
  const blocks = text.split('BEGIN:VEVENT').slice(1);
  const now = new Date();
  const events = [];

  for (const block of blocks) {
    const get = (key) => {
      const m = block.match(new RegExp(`${key}[^:]*:([^\r\n]+)`));
      return m ? m[1].trim().replace(/\\n/g, ' ').replace(/\\,/g, ',') : '';
    };

    const summary     = get('SUMMARY');
    const dtStartRaw  = get('DTSTART');
    const dtEndRaw    = get('DTEND');
    const description = get('DESCRIPTION');
    const location    = get('LOCATION');
    const allDay      = dtStartRaw.length === 8;

    if (!summary || !dtStartRaw) continue;

    const start = parseIcalDate(dtStartRaw);
    const end   = dtEndRaw ? parseIcalDate(dtEndRaw) : null;

    if (start < now && (!end || end < now)) continue;

    events.push({ summary, start: start.toISOString(), end: end ? end.toISOString() : null, description, location, allDay });
  }

  return events.sort((a, b) => new Date(a.start) - new Date(b.start));
}
