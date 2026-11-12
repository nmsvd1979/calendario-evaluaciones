# Calendario de Evaluaciones — 2º semestre 2026

Una sola fuente de datos (`events.json`) de la que salen dos cosas:

- **App (PWA):** https://nmsvd1979.github.io/calendario-evaluaciones/
- **Archivos para el Calendario de Apple:** carpeta `ics/` (uno por curso)

> **Privacidad:** el sitio y el repositorio son **públicos**. Cualquiera con el enlace puede ver las fechas. No hay datos personales, solo nombres de evaluaciones. GitHub Pages con repositorio privado exige GitHub Pro (y aun así el sitio publicado es público). Alternativa realmente privada y gratis: Cloudflare Pages + Cloudflare Access (pide iniciar sesión con tu correo).

---

## A. Importar en el Calendario de Apple (Mac → iPhone por iCloud)

Colores de cada curso (para el paso 3):

| Archivo | Calendario | Color |
|---|---|---|
| `ics/FS.ics` | Financiamiento de Startups | `#0A6E62` |
| `ics/EC.ics` | Experiencia de Clientes | `#B5334A` |
| `ics/PP.ics` | Precios y Promociones | `#8F6209` |
| `ics/CNE.ics` | Creación de Nuevas Empresas | `#6A3FD1` |
| `ics/LE.ics` | Liderazgo Estratégico | `#2452C7` |

Repite estos pasos para cada uno de los 5 cursos:

1. **Crea el calendario en iCloud.** Abre la app **Calendario** en el Mac. Menú **Archivo → Nuevo calendario → iCloud**. (Si no aparece el submenú "iCloud" y el calendario se crea directamente, revisa en la barra lateral izquierda que haya quedado bajo el título **iCloud** y no bajo "En mi Mac": solo los de iCloud llegan al iPhone.) Ponle el nombre del curso y presiona Enter.
2. **Importa el archivo.** Menú **Archivo → Importar…**, elige el `.ics` del curso (están en `Calendario/ics/`), clic en **Importar**. Cuando pregunte a qué calendario agregar los eventos, elige el que creaste en el paso 1 y confirma.
3. **Asigna el color a mano** (Apple suele ignorar el color que viene en el archivo). En la barra lateral, clic derecho (o Control + clic) sobre el calendario → **Color personalizado…** → en la ventana de colores elige la segunda pestaña (reguladores), selecciona **Reguladores RGB** y escribe el código de la tabla en el campo **Color hexadecimal** (sin el `#`).
4. **Revisa un evento.** Ve al 18 de noviembre de 2026: debe aparecer "[FS] EVAL · Prueba 3 (25%)" como evento de día completo, con una alerta el día anterior a las 20:00. El 10 de diciembre, "[PP] EVAL · Examen final…" debe ir de 08:20 a 10:20.

### Confirmar que llegó al iPhone

1. En el Mac: **Ajustes del Sistema → [tu nombre] → iCloud → Ver todo** (o "Apps que usan iCloud") → **Calendario de iCloud** debe estar activado.
2. En el iPhone: **Ajustes → [tu nombre] → iCloud → Ver todo → Calendario** activado, con la **misma cuenta de Apple** que el Mac.
3. En el iPhone abre **Calendario** → toca **Calendarios** (abajo al centro). Bajo **iCloud** deben aparecer los 5 cursos con su color. Si no, desliza hacia abajo en esa lista para forzar la actualización y espera un minuto.
4. Para que suenen los avisos: **Ajustes → Notificaciones → Calendario → Permitir notificaciones**.

### Alertas incluidas

- Evaluaciones: un aviso **la noche anterior a las 20:00**.
- Entregas: un aviso **el mismo día a las 08:00**.

### Reimportar sin duplicar

Cada evento tiene un identificador fijo (UID). Si cambias una fecha o un título y vuelves a importar el archivo **en el mismo calendario**, Calendario actualiza el evento existente en vez de crear otro.

- Si importas en un calendario distinto, sí se duplican.
- **Si borraste un evento**, reimportar no lo quita: clic derecho sobre el calendario → **Eliminar**, créalo de nuevo (paso 1) e importa otra vez.

---

## B. Instalar la app

Enlace: **https://nmsvd1979.github.io/calendario-evaluaciones/**

### iPhone

1. Abre el enlace en **Safari** (no dentro de WhatsApp, Instagram u otra app: si se abrió ahí, usa "Abrir en Safari").
2. Toca el botón **Compartir**: el cuadrado con una flecha hacia arriba, en la barra inferior.
3. Desliza la lista de opciones hacia abajo y toca **Agregar a pantalla de inicio**. (Si no aparece, baja hasta el final → "Editar acciones…" y agrégala.)
4. Deja el nombre "Evaluaciones" y toca **Agregar** (arriba a la derecha).
5. Abre la app desde el ícono nuevo **una vez con internet**. Desde ahí funciona sin conexión.

### Mac

1. Abre el enlace en **Safari**.
2. Menú **Archivo → Agregar al Dock…**
3. Clic en **Agregar**. Queda como una app en el Dock y en Launchpad.

### Cómo se guardan los cambios

- Lo que agregas, editas o borras se guarda **en ese dispositivo**. El iPhone y el Mac no se sincronizan entre sí.
- **Exportar .ics**: genera el archivo de un curso con tus cambios, para reimportarlo en el Calendario de Apple (sección A).
- **Exportar respaldo (.json)**: copia de todos los datos, con el mismo formato que `events.json`.
- **Restablecer datos originales**: descarta los cambios del dispositivo y vuelve a lo publicado.

---

## C. Cambiar los datos para todos los dispositivos

1. Edita `events.json` (o reemplázalo por un respaldo exportado desde la app).
2. Regenera y valida los `.ics`:
   ```bash
   npm run ics
   ```
3. Publica:
   ```bash
   git add -A && git commit -m "Actualiza eventos" && git push
   ```
4. En un par de minutos la app muestra los datos nuevos. Un dispositivo donde ya hiciste cambios locales conserva los suyos hasta que toques "Restablecer datos originales".

Formato de un evento en `events.json`:

```json
{ "uid": "FS-20260902-ba32ffa387@calendario-uc", "date": "2026-09-02",
  "course": "FS", "cat": "eval", "title": "Prueba 1 (25%)", "seq": 0 }
```

- `cat`: `eval` o `deadline`.
- `time` (opcional): `{ "start": "08:20", "end": "10:20" }`, hora de Chile. Sin `time` es de día completo.
- `uid`: no lo cambies al editar un evento. Para uno nuevo, inventa uno con la misma forma (debe ser único).
- `seq`: súbele 1 cada vez que edites el evento.

Otros comandos: `npm test` (valida los .ics con ical.js y prueba las fechas en varias zonas horarias), `npm run icons` (regenera los íconos).
