// Comprueba el bug de fecha: new Date(y,m,d).toISOString().slice(0,10) corre el
// día en zonas al este de UTC. Se relanza a sí mismo en varias zonas horarias.
// Uso: node scripts/test-dates.mjs
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const isoLocal = (y, m, day) => y + '-' + String(m + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0'); // igual que en index.html
const viejo = (y, m, day) => new Date(y, m, day).toISOString().slice(0, 10);

if (process.env.TZ_CHILD) {
  let malNuevo = 0, malViejo = 0, total = 0;
  for (let m = 7; m <= 11; m++) {
    const dias = new Date(2026, m + 1, 0).getDate();
    for (let d = 1; d <= dias; d++) {
      total++;
      const esperado = `2026-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      if (isoLocal(2026, m, d) !== esperado) malNuevo++;
      if (viejo(2026, m, d) !== esperado) malViejo++;
    }
  }
  console.log(`${process.env.TZ.padEnd(20)} días: ${total}   código viejo erróneos: ${String(malViejo).padStart(3)}   código nuevo erróneos: ${malNuevo}`);
  process.exit(malNuevo ? 1 : 0);
}
for (const TZ of ['America/Santiago', 'UTC', 'Europe/Madrid', 'Asia/Tokyo', 'Pacific/Auckland'])
  execFileSync(process.execPath, [fileURLToPath(import.meta.url)], { env: { ...process.env, TZ, TZ_CHILD: '1' }, stdio: 'inherit' });
console.log('OK: el formato local no desplaza ningún día');
