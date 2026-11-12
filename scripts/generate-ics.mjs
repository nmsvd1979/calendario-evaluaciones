// Genera un .ics por curso en ics/ a partir de events.json.
// Uso: node scripts/generate-ics.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import core from '../ics-core.js';

const data = JSON.parse(readFileSync(new URL('../events.json', import.meta.url), 'utf8'));
mkdirSync(new URL('../ics/', import.meta.url), { recursive: true });
const now = new Date();
for (const code of Object.keys(data.courses)) {
  const n = data.events.filter(e => e.course === code).length;
  writeFileSync(new URL(`../ics/${code}.ics`, import.meta.url), core.buildCalendar(code, data, now));
  console.log(`ics/${code}.ics  ${n} eventos  (${data.courses[code].name})`);
}
