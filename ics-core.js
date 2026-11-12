/* Generador de iCalendar (RFC 5545) compartido entre Node (scripts/) y la PWA.
   Una sola implementación para que el .ics exportado desde la app sea igual
   al que genera scripts/generate-ics.mjs. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ICSCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const TZID = 'America/Santiago';
  const CAT_PREFIX = { eval: 'EVAL', deadline: 'ENTREGA' };

  // Reglas vigentes de Chile continental: horario de verano (-03) desde el
  // primer domingo de septiembre, horario de invierno (-04) desde el primer
  // domingo de abril. El cambio ocurre a las 24:00 del sábado.
  const VTIMEZONE = [
    'BEGIN:VTIMEZONE',
    'TZID:' + TZID,
    'BEGIN:STANDARD',
    'DTSTART:20230402T000000',
    'RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU',
    'TZOFFSETFROM:-0300',
    'TZOFFSETTO:-0400',
    'TZNAME:-04',
    'END:STANDARD',
    'BEGIN:DAYLIGHT',
    'DTSTART:20230903T000000',
    'RRULE:FREQ=YEARLY;BYMONTH=9;BYDAY=1SU',
    'TZOFFSETFROM:-0400',
    'TZOFFSETTO:-0300',
    'TZNAME:-03',
    'END:DAYLIGHT',
    'END:VTIMEZONE',
  ];

  // cyrb53: hash síncrono y determinista (crypto.subtle es async en el navegador).
  function hash(str) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    const n = 4294967296 * (2097151 & h2) + (h1 >>> 0);
    return n.toString(16).padStart(14, '0').slice(-10);
  }

  // UID estable derivado de curso + fecha + título. Se calcula al crear el
  // evento y se conserva aunque después se edite.
  function makeUid(course, date, title) {
    return course + '-' + date.replace(/-/g, '') + '-' + hash(course + '|' + date + '|' + title) + '@calendario-uc';
  }

  function escapeText(s) {
    return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  }

  function utf8Len(ch) {
    const cp = ch.codePointAt(0);
    return cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4;
  }

  // Plegado a 75 octetos por línea (las de continuación empiezan con un espacio
  // que cuenta dentro de los 75), sin cortar caracteres multibyte.
  function fold(line) {
    const out = [];
    let cur = '', bytes = 0;
    for (const ch of line) {
      const n = utf8Len(ch);
      if (bytes + n > 75) { out.push(cur); cur = ' '; bytes = 1; }
      cur += ch; bytes += n;
    }
    out.push(cur);
    return out.join('\r\n');
  }

  const p2 = n => String(n).padStart(2, '0');
  const compactDate = iso => iso.replace(/-/g, '');
  const compactTime = hm => hm.replace(':', '') + '00';
  const toMinutes = hm => { const [h, m] = hm.split(':').map(Number); return h * 60 + m; };

  function nextDay(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    const t = new Date(Date.UTC(y, m - 1, d + 1));
    return t.getUTCFullYear() + p2(t.getUTCMonth() + 1) + p2(t.getUTCDate());
  }

  function utcStamp(date) {
    return date.getUTCFullYear() + p2(date.getUTCMonth() + 1) + p2(date.getUTCDate()) + 'T' +
      p2(date.getUTCHours()) + p2(date.getUTCMinutes()) + p2(date.getUTCSeconds()) + 'Z';
  }

  function duration(minutes) {
    if (minutes === 0) return 'PT0S';
    const abs = Math.abs(minutes), h = Math.floor(abs / 60), m = abs % 60;
    return (minutes < 0 ? '-' : '') + 'PT' + (h ? h + 'H' : '') + (m ? m + 'M' : '');
  }

  // Una alerta por evento, relativa al inicio:
  //   eval     -> 20:00 de la noche anterior
  //   deadline -> 08:00 del mismo día
  // En eventos de día completo el inicio es las 00:00 locales.
  function alarmTrigger(ev) {
    const startMin = ev.time ? toMinutes(ev.time.start) : 0;
    const target = ev.cat === 'deadline' ? 8 * 60 : -4 * 60; // minutos desde las 00:00 del día
    return duration(target - startMin);
  }

  function summary(ev) {
    return '[' + ev.course + '] ' + (CAT_PREFIX[ev.cat] || 'EVAL') + ' · ' + ev.title;
  }

  function buildCalendar(code, data, now) {
    const course = data.courses[code];
    const events = data.events.filter(e => e.course === code)
      .slice().sort((a, b) => a.date.localeCompare(b.date) || a.uid.localeCompare(b.uid));
    const stamp = utcStamp(now || new Date());
    const L = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Calendario UC//Evaluaciones 2026-2//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:' + escapeText(course.name),
      'X-WR-TIMEZONE:' + TZID,
      'X-APPLE-CALENDAR-COLOR:' + course.color,
    ];
    if (events.some(e => e.time)) L.push(...VTIMEZONE);
    for (const ev of events) {
      const sum = escapeText(summary(ev));
      L.push('BEGIN:VEVENT', 'UID:' + ev.uid, 'DTSTAMP:' + stamp, 'SEQUENCE:' + (ev.seq || 0));
      if (ev.time) {
        L.push('DTSTART;TZID=' + TZID + ':' + compactDate(ev.date) + 'T' + compactTime(ev.time.start));
        L.push('DTEND;TZID=' + TZID + ':' + compactDate(ev.date) + 'T' + compactTime(ev.time.end));
      } else {
        L.push('DTSTART;VALUE=DATE:' + compactDate(ev.date));
        L.push('DTEND;VALUE=DATE:' + nextDay(ev.date));
        L.push('TRANSP:TRANSPARENT');
      }
      L.push(
        'SUMMARY:' + sum,
        'DESCRIPTION:' + escapeText(course.name),
        'CATEGORIES:' + escapeText(CAT_PREFIX[ev.cat] || 'EVAL'),
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        'DESCRIPTION:' + sum,
        'TRIGGER:' + alarmTrigger(ev),
        'END:VALARM',
        'END:VEVENT'
      );
    }
    L.push('END:VCALENDAR');
    return L.map(fold).join('\r\n') + '\r\n';
  }

  return { TZID, makeUid, buildCalendar, alarmTrigger, summary, fold, escapeText };
});
