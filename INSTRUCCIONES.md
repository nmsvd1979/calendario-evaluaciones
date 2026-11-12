# Calendario de Evaluaciones — 2º semestre 2026

Una sola fuente de datos (`events.json`) de la que salen dos cosas:

- **App (PWA):** https://nmsvd1979.github.io/calendario-evaluaciones/
- **Archivos para el Calendario de Apple:** carpeta `ics/` (uno por curso, más `EDG.ics` del Examen de Grado)

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
| `ics/EDG.ics` | Examen de Grado | `#C4511A` |

Repite estos pasos para cada uno de los 6 calendarios:

1. **Crea el calendario en iCloud.** Abre la app **Calendario** en el Mac. Menú **Archivo → Nuevo calendario → iCloud**. (Si no aparece el submenú "iCloud" y el calendario se crea directamente, revisa en la barra lateral izquierda que haya quedado bajo el título **iCloud** y no bajo "En mi Mac": solo los de iCloud llegan al iPhone.) Ponle el nombre del curso y presiona Enter.
2. **Importa el archivo.** Menú **Archivo → Importar…**, elige el `.ics` del curso (están en `Calendario/ics/`), clic en **Importar**. Cuando pregunte a qué calendario agregar los eventos, elige el que creaste en el paso 1 y confirma.
3. **Asigna el color a mano** (Apple suele ignorar el color que viene en el archivo). En la barra lateral, clic derecho (o Control + clic) sobre el calendario → **Color personalizado…** → en la ventana de colores elige la segunda pestaña (reguladores), selecciona **Reguladores RGB** y escribe el código de la tabla en el campo **Color hexadecimal** (sin el `#`).
4. **Revisa un evento.** Ve al 18 de noviembre de 2026: debe aparecer "[FS] EVAL · Prueba 3 (25%)" como evento de día completo, con una alerta el día anterior a las 20:00. El 10 de diciembre, "[PP] EVAL · Examen final…" debe ir de 08:20 a 10:20.

### Confirmar que llegó al iPhone

1. En el Mac: **Ajustes del Sistema → [tu nombre] → iCloud → Ver todo** (o "Apps que usan iCloud") → **Calendario de iCloud** debe estar activado.
2. En el iPhone: **Ajustes → [tu nombre] → iCloud → Ver todo → Calendario** activado, con la **misma cuenta de Apple** que el Mac.
3. En el iPhone abre **Calendario** → toca **Calendarios** (abajo al centro). Bajo **iCloud** deben aparecer los 6 calendarios con su color. Si no, desliza hacia abajo en esa lista para forzar la actualización y espera un minuto.
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

### Vista Mes y vista Semana

- Selector **Mes | Semana | Día** bajo el encabezado. La app recuerda la última que usaste.
- **Hoy:** en Mes es el primer botón de la fila de meses ("Hoy ↓"); en Semana y Día es el botón oscuro de la izquierda de la barra.
- **Pasar de día o de semana con gestos** (vista Día y vista Semana en pantalla ancha): en el iPhone, desliza el dedo hacia la izquierda (siguiente) o la derecha (anterior); en el Mac, dos dedos hacia los lados sobre el trackpad; o las flechas ← → del teclado. En el iPhone la vista Semana se desplaza por columnas, así que ahí usa los botones ‹ › o la vista Día.
- **Semana:** columnas lunes a domingo y filas por hora (desde las 07:00). Arriba, en "todo el día", van las evaluaciones y entregas; los eventos con hora (por ejemplo el examen) y tus bloques de estudio se dibujan a su hora. Flechas ‹ › cambian de semana y "Hoy" vuelve a la actual.
- **Crear un bloque de estudio:** toca un hueco de la semana (queda de 1 h, con el inicio redondeado a 30 min) o usa ＋ Agregar → Tipo "Bloque de estudio". Si el curso es **EDG**, puedes elegir el área (Pers, DyE, TF, DF, FM, MA).
- **Repetir:** marca "Repetir cada semana", elige los días (L M X J V S D) y la fecha final. Se crea un bloque por día. Al editar o borrar uno de una repetición, el formulario pregunta si es "solo este" o "este y los siguientes".
- En la vista Mes los bloques de estudio no se dibujan como etiquetas: cada día muestra la suma de horas (por ejemplo "2 h"), y al tocar el día ves el detalle.
- La tarjeta **Examen de Grado** muestra la cuenta regresiva, el estado de la inscripción y las horas de estudio de la semana por área. Son horas *planificadas*, no tu avance real.
- Los bloques de estudio **no** van al Calendario de Apple; solo evaluaciones, entregas y el examen.

### Cómo se guardan los cambios

- Lo que agregas, editas o borras se guarda **en ese dispositivo**. El iPhone y el Mac no se sincronizan entre sí.
- Todo está en el botón **⋯ Más**:
  - **Exportar .ics**: archivo de un calendario con tus cambios, para reimportarlo en Apple (sección A).
  - **Exportar respaldo (.json)** e **Importar respaldo (.json)**: para llevar tus bloques de estudio del iPhone al Mac o al revés (exporta en uno, importa en el otro). Importar reemplaza los datos de ese dispositivo.
  - **Restablecer datos originales**: descarta los cambios del dispositivo y vuelve a lo publicado.
- Cuando se publiquen eventos nuevos en `events.json` (como el Examen de Grado), tu dispositivo los suma solo al abrir la app con internet, sin pisar lo que editaste ni devolver lo que borraste.

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
- `note` (opcional): texto extra para la descripción del evento en Apple.
- `added` (opcional): número de versión de `events.json` en que se agregó el evento (lo usan los dispositivos para detectar lo nuevo). Si agregas eventos nuevos, sube `version` y ponles `"added"` con ese número.
- `cat: "study"` (bloque de estudio) también es válido en el archivo, pero lo normal es crearlos desde la app.
- `uid`: no lo cambies al editar un evento. Para uno nuevo, inventa uno con la misma forma (debe ser único).
- `seq`: súbele 1 cada vez que edites el evento.

Otros comandos: `npm test` (valida los .ics con ical.js y prueba las fechas en varias zonas horarias), `npm run icons` (regenera los íconos).
