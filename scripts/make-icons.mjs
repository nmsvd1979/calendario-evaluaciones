// Genera icons/icon.svg y los PNG (180, 192, 512, maskable 512) con resvg.
// Uso: node scripts/make-icons.mjs
import { writeFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

const cells = ['#0A6E62', '#B5334A', '#8F6209', '#6A3FD1', '#2452C7', '#C7CDD8'];
const art = `
  <rect x="96" y="112" width="320" height="304" rx="36" fill="#EFF2F6"/>
  <rect x="128" y="148" width="140" height="22" rx="11" fill="#1A2233"/>
  <rect x="352" y="148" width="32" height="22" rx="11" fill="#C7CDD8"/>
  ${cells.map((c, i) => `<rect x="${128 + (i % 3) * 92}" y="${216 + Math.floor(i / 3) * 92}" width="72" height="72" rx="14" fill="${c}"/>`).join('\n  ')}`;
// scale: el ícono "maskable" deja el dibujo dentro de la zona segura (círculo de 80%).
const svg = scale => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#1A2233"/>
  <g transform="translate(256 256) scale(${scale}) translate(-256 -256)">${art}
  </g>
</svg>
`;
const out = f => new URL('../icons/' + f, import.meta.url);
const png = (scale, size) => new Resvg(svg(scale), { fitTo: { mode: 'width', value: size } }).render().asPng();

writeFileSync(out('icon.svg'), svg(1));
writeFileSync(out('apple-touch-icon-180.png'), png(1, 180));
writeFileSync(out('icon-192.png'), png(1, 192));
writeFileSync(out('icon-512.png'), png(1, 512));
writeFileSync(out('icon-maskable-512.png'), png(0.82, 512));
console.log('íconos generados en icons/');
