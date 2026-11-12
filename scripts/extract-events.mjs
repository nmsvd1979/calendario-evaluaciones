// Extrae el arreglo EVENTS del HTML original y escribe events.json (fuente única).
// Uso: node scripts/extract-events.mjs "<ruta al HTML original>"
// Solo hace falta correrlo una vez; después events.json se edita directamente.
import { readFileSync, writeFileSync } from 'node:fs';
import core from '../ics-core.js';

const src = process.argv[2];
if (!src) { console.error('Falta la ruta al HTML original'); process.exit(1); }
const html = readFileSync(src, 'utf8');
const raw = JSON.parse(html.match(/const EVENTS = (\[[\s\S]*?\n\]);/)[1]);

const courses = {
  FS:  { name: 'Financiamiento de Startups',  color: '#0A6E62' },
  EC:  { name: 'Experiencia de Clientes',     color: '#B5334A' },
  PP:  { name: 'Precios y Promociones',       color: '#8F6209' },
  CNE: { name: 'Creación de Nuevas Empresas', color: '#6A3FD1' },
  LE:  { name: 'Liderazgo Estratégico',       color: '#2452C7' },
};

const events = raw.map(e => {
  const ev = { uid: core.makeUid(e.course, e.date, e.title), date: e.date, course: e.course, cat: e.cat, title: e.title };
  // Único evento con hora: examen final de PP (hora de America/Santiago).
  if (e.course === 'PP' && e.date === '2026-12-10') ev.time = { start: '08:20', end: '10:20' };
  ev.seq = 0;
  return ev;
});

if (new Set(events.map(e => e.uid)).size !== events.length) throw new Error('UID duplicado');
writeFileSync(new URL('../events.json', import.meta.url),
  JSON.stringify({ version: 1, timezone: core.TZID, courses, events }, null, 2) + '\n');
console.log(`events.json: ${events.length} eventos, ${events.filter(e => e.time).length} con hora`);
