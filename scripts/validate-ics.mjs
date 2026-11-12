// Valida los .ics con un parser real (ical.js), no solo "que se vean bien".
// Uso: node scripts/validate-ics.mjs [carpeta]   (por defecto ics/)
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ICAL from 'ical.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const dir = resolve(process.argv[2] || join(root, 'ics'));
const data = JSON.parse(readFileSync(join(root, 'events.json'), 'utf8'));
data.events = data.events.filter(e => e.cat !== 'study'); // los bloques de estudio no deben llegar a los .ics
const compareWithSource = !process.argv[2];

const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);
const p2 = n => String(n).padStart(2, '0');
const wall = t => `${t.year}-${p2(t.month)}-${p2(t.day)} ${p2(t.hour)}:${p2(t.minute)}`;
const allUids = [];
let total = 0, alarms = 0, timed = 0;

for (const file of readdirSync(dir).filter(f => f.endsWith('.ics')).sort()) {
  const buf = readFileSync(join(dir, file));
  const text = buf.toString('utf8');

  // --- Nivel de bytes: CRLF y plegado a 75 octetos ---
  if (/[^\r]\n/.test(text) || /\r(?!\n)/.test(text)) fail(file, 'hay saltos de línea que no son CRLF');
  if (!text.endsWith('\r\n')) fail(file, 'no termina en CRLF');
  for (const line of text.split('\r\n')) {
    const n = Buffer.byteLength(line, 'utf8');
    if (n > 75) fail(file, `línea de ${n} octetos (>75): ${line.slice(0, 40)}…`);
  }

  // --- Parser ---
  let cal;
  try { cal = new ICAL.Component(ICAL.parse(text)); }
  catch (e) { fail(file, 'ical.js no pudo parsear: ' + e.message); continue; }

  for (const prop of ['version', 'prodid', 'x-wr-calname', 'x-apple-calendar-color'])
    if (!cal.getFirstPropertyValue(prop)) fail(file, `falta ${prop.toUpperCase()}`);
  if (cal.getFirstPropertyValue('version') !== '2.0') fail(file, 'VERSION no es 2.0');

  const code = file.replace('.ics', '');
  const course = data.courses[code];
  if (course) {
    if (cal.getFirstPropertyValue('x-wr-calname') !== course.name) fail(file, 'X-WR-CALNAME no coincide con el curso');
    if (cal.getFirstPropertyValue('x-apple-calendar-color') !== course.color) fail(file, 'color no coincide');
  }

  const vtz = cal.getFirstSubcomponent('vtimezone');
  if (vtz) ICAL.TimezoneService.register(new ICAL.Timezone(vtz));

  for (const ve of cal.getAllSubcomponents('vevent')) {
    total++;
    const ev = new ICAL.Event(ve);
    const id = `${ev.uid || '(sin UID)'}`;
    if (!ev.uid) fail(file, 'VEVENT sin UID');
    allUids.push(ev.uid);
    if (!ve.getFirstPropertyValue('dtstamp')) fail(file, `${id} sin DTSTAMP`);
    if (ve.getFirstPropertyValue('sequence') == null) fail(file, `${id} sin SEQUENCE`);
    if (!/^\[[A-Z]+\] (EVAL|ENTREGA) · .+/.test(ev.summary || '')) fail(file, `${id} SUMMARY inesperado: ${ev.summary}`);

    const start = ev.startDate, end = ev.endDate;
    const isEval = / EVAL · /.test(ev.summary);
    const dateIso = `${start.year}-${p2(start.month)}-${p2(start.day)}`;

    if (start.isDate) {
      if (!end.isDate || end.subtractDate(start).toSeconds() !== 86400) fail(file, `${id} día completo debe durar exactamente 1 día`);
    } else {
      timed++;
      const tzid = ve.getFirstProperty('dtstart').getParameter('tzid');
      if (!tzid) fail(file, `${id} evento con hora sin TZID`);
      if (!vtz || vtz.getFirstPropertyValue('tzid') !== tzid) fail(file, `${id} sin VTIMEZONE para ${tzid}`);
      // El instante UTC calculado con NUESTRO VTIMEZONE debe coincidir con la
      // base de datos de zonas horarias del sistema (Intl).
      const instant = start.toJSDate();
      const viaIntl = new Intl.DateTimeFormat('sv-SE', { timeZone: tzid, dateStyle: 'short', timeStyle: 'short' }).format(instant);
      if (viaIntl !== wall(start)) fail(file, `${id} VTIMEZONE da ${instant.toISOString()} = ${viaIntl} según Intl, se esperaba ${wall(start)}`);
      else console.log(`  hora verificada: ${ev.summary} → ${wall(start)} ${tzid} = ${instant.toISOString()}`);
    }

    // --- Alarma: una por evento, se calcula su hora absoluta de pared ---
    const valarms = ve.getAllSubcomponents('valarm');
    if (valarms.length !== 1) { fail(file, `${id} tiene ${valarms.length} VALARM (se espera 1)`); continue; }
    alarms++;
    const al = valarms[0];
    if (al.getFirstPropertyValue('action') !== 'DISPLAY') fail(file, `${id} VALARM sin ACTION:DISPLAY`);
    if (!al.getFirstPropertyValue('description')) fail(file, `${id} VALARM sin DESCRIPTION`);
    const trig = al.getFirstPropertyValue('trigger');
    if (!(trig instanceof ICAL.Duration)) { fail(file, `${id} TRIGGER no es una duración relativa`); continue; }
    // Día completo: el inicio es 00:00 hora local (flotante).
    const fire = new ICAL.Time({ year: start.year, month: start.month, day: start.day,
      hour: start.isDate ? 0 : start.hour, minute: start.isDate ? 0 : start.minute, second: 0, isDate: false });
    fire.addDuration(trig);
    const d = new Date(Date.UTC(start.year, start.month - 1, start.day - (isEval ? 1 : 0)));
    const expected = `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())} ${isEval ? '20:00' : '08:00'}`;
    if (wall(fire) !== expected) fail(file, `${id} (${dateIso}) alarma suena ${wall(fire)}, se esperaba ${expected}`);
  }
}

if (new Set(allUids).size !== allUids.length) errors.push('hay UID repetidos entre archivos');
if (compareWithSource) {
  const src = new Set(data.events.map(e => e.uid));
  if (total !== data.events.length) errors.push(`hay ${total} VEVENT y events.json tiene ${data.events.length}`);
  for (const u of allUids) if (!src.has(u)) errors.push(`UID ${u} no está en events.json`);
  const expectedTimed = data.events.filter(e => e.time).length;
  if (timed !== expectedTimed) errors.push(`${timed} eventos con hora, se esperaban ${expectedTimed}`);
}

console.log(`${dir}: ${total} VEVENT, ${alarms} VALARM, ${timed} con hora, ${new Set(allUids).size} UID únicos`);
if (errors.length) { console.error('ERRORES:\n - ' + errors.join('\n - ')); process.exit(1); }
console.log('OK: todos los archivos son válidos');
