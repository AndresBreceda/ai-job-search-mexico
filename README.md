<p align="center">
  <img src="assets/mascot/pip_flight_loop.gif" alt="Pip, the courier bird" width="200">
</p>

# AI Job Search México

*El asistente de búsqueda y postulación de empleo impulsado por IA, adaptado para México y optimizado para Gemini.*

<p align="center">
  <a href="https://github.com/AndresBreceda/ai-job-search-mexico"><img src="https://img.shields.io/badge/Mercado-M%C3%A9xico%20%7C%20LATAM-green" alt="Mercado México"></a>
  <a href="https://deepmind.google/technologies/gemini/"><img src="https://img.shields.io/badge/AI%20Engine-Gemini-blue" alt="AI Engine Gemini"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow" alt="License MIT"></a>
</p>

Un framework integral de automatización para la búsqueda de empleo adaptado al **mercado laboral de México y remoto internacional**, diseñado para ejecutarse localmente con **Gemini** (Google Antigravity, Gemini CLI) y agentes compatibles. Evalúa ofertas de trabajo, adapta tu CV, redacta cartas de presentación a la medida y te prepara para entrevistas.

> **Edición México & Gemini:** Esta versión es una adaptación especializada de `ai-job-search` orientada al mercado mexicano (con soporte para portales como **OCCMundial**, **Computrabajo México**, **Get on Board**, **LinkedIn México** y **Hireline**), benchmarking de salarios en **Pesos Mexicanos (MXN)**, formatos culturales en español/inglés y operación nativa con modelos **Gemini**.

## ¿Qué es esto?

Un flujo de trabajo estructurado que convierte a tu asistente de IA en un asesor de carrera integral. Combina evaluación de compatibilidad (*fit scoring*), redacción de CV y cartas en LaTeX con un pipeline de doble agente (*drafter-reviewer*), y búsqueda activa en bolsas de trabajo clave de México y tecnología.

```
/setup              /scrape o /rank           /apply <url/texto>
  │                        │                         │
  ▼                        ▼                         ▼
Configura tu perfil      Busca vacantes en       Evalúa compatibilidad
con tus documentos       portales de México      Califica (0-100) y recomienda
(CV, LinkedIn, títulos)  (OCC, Get on Board, ...)    │
  │                        │                         ▼
  ▼                        ▼                     Redacta CV + Carta
Perfil listo en          Muestra vacantes con    (LaTeX compilado y adaptado)
CLAUDE.md                puntuación de fit           │
                           │                         ▼
                           ▼                     Agente Revisor critica
                       Selecciona vacante        -> Ajusta -> PDF final
                       -> /apply                 (chequeo de lectura ATS)
```

El framework codifica las mejores prácticas de orientación profesional: criterios estructurados de evaluación, enfoque proactivo en cartas de presentación y comparador de salarios de mercado en **Pesos Mexicanos (MXN)**.

## Requisitos previos

- **Motor de IA:** [Google Antigravity](https://deepmind.google) (IDE o CLI), [Gemini CLI](https://github.com/google-gemini/gemini-cli), o cualquier agente compatible con el estándar `AGENTS.md`. Esta versión está optimizada para **Gemini**. Si usas otro agente (Claude Code, Codex, Cursor), lee [`AGENTS.md`](AGENTS.md) — los skills de búsqueda en portales funcionan sin cambios adicionales.
- **Python 3.10+** (Windows: comando `python`, no `python3`)
- **Node.js 18+** (para el CLI de `getonbrd-search`)
- **Bun** (opcional — para los CLIs TypeScript de `linkedin-search` y `freehire-search`; si no lo tienes, usa los equivalentes `.js`)
- **Distribución LaTeX** con `lualatex` y `xelatex`: [MiKTeX](https://miktex.org/) (recomendado en Windows), [TeX Live](https://tug.org/texlive/), o [TinyTeX](https://yihui.org/tinytex/). El CV compila con `lualatex`; la carta de presentación con `xelatex` (requiere `fontspec`).
- Opcional: `pip install pypdf` para la verificación ATS en `/apply`. Alternativa: `pdftotext` de Poppler (`choco install poppler` en Windows). Si ninguno está disponible, la verificación se degrada a revisión visual de palabras clave.

## Inicio rápido

### 1. Clonar el repositorio

```bash
gh repo clone AndresBreceda/ai-job-search-mexico
cd ai-job-search-mexico
```

> [!IMPORTANT]
> Un fork de este repositorio siempre es **público** en GitHub. El comando `/setup` (paso 3) escribe tu información personal (nombre, contacto, historial laboral, expectativa salarial) en archivos **rastreados por Git**.
> Si esta copia es para tu propia búsqueda de empleo (no para contribuir al proyecto), usa un **repositorio privado** con este repo como `upstream`.

### 2. Instalar herramientas de búsqueda

```bash
python tools/install_portal_clis.py
```

Ejecuta la instalación de dependencias en cada portal CLI bajo `.agents/skills/*/cli/`. Los CLIs de Python (`mexico-portals-search`) no requieren instalación adicional. Para `getonbrd-search` (Node.js), ejecuta `npm install` en su directorio si es necesario.

### 3. Configurar tu perfil

Abre **Google Antigravity** (o Gemini CLI) en el directorio del proyecto y escribe:

```
/setup
```

`/setup` te ofrece tres rutas: leer tu carpeta `documents/` si ya la tienes poblada (PDF de CV, exportación de LinkedIn, diplomas, cartas de referencia), importar un CV pegado en el chat, o recorrer una entrevista guiada. El agente detecta automáticamente lo que tienes y pregunta. El modo carpeta de documentos es idempotente y seguro para re-ejecutar cuando agregues más material; consulta `documents/README.md` para la estructura.

### 4. Buscar vacantes

```
/scrape
```

Busca en múltiples portales de empleo (OCC, Computrabajo, Get on Board, LinkedIn México, etc.) posiciones que coincidan con tu perfil, elimina duplicados y las presenta ordenadas por compatibilidad. Selecciona una vacante para ejecutar `/apply` directamente — o, cuando el scrape devuelve más trabajos de los que quieres revisar, ejecuta `/rank` para calificarlos todos en lote.

### 5. Postularte a una vacante

```
/apply https://www.occ.com.mx/empleo/oferta/12345678/
```

Si la URL no puede obtenerse (algunos portales bloquean el acceso automatizado), puedes pegar la descripción del trabajo directamente:

```
/apply <pega aquí la descripción completa del puesto>
```

Esto ejecuta el flujo completo: evaluar compatibilidad, redactar CV + carta de presentación, revisar con un segundo agente, revisar y presentar el resultado final.

Las publicaciones se tratan como entradas no confiables (el flujo no sigue instrucciones incrustadas en ellas ni obtiene enlaces de su cuerpo). Consulta [SECURITY.md](SECURITY.md) para más detalles.

## Otros comandos

`/setup`, `/scrape` y `/apply` forman el flujo principal. Diez comandos adicionales lo extienden una vez que tienes tu perfil configurado:

- **`/interview`** te prepara para una entrevista programada sobre una postulación registrada. Construye un paquete de preparación específico por etapa a partir del archivo de la postulación (la vacante exacta, el CV y la carta que el entrevistador leyó, la retroalimentación de rondas anteriores), investiga la empresa y los entrevistadores, mapea preguntas probables con tus ejemplos STAR y ofrece una entrevista simulada.
- **`/outcome`** registra qué pasó con una postulación: etapas de entrevista, ofertas, rechazos, silencio. Archiva el CV enviado, la carta y el texto de la vacante en `documents/applications/<empresa>_<puesto>/`, mantiene `outcome.md` y actualiza el tracker. `/outcome followup` detecta postulaciones que han quedado en silencio (10 días por defecto) y redacta un seguimiento breve.
- **`/notion-sync`** publica una vista de solo lectura del pipeline en una base de datos de Notion via el servidor MCP oficial (OAuth, sin API keys).
- **`/gmail-sync`** lee tu Gmail en busca de señales de estado de tus postulaciones abiertas (invitaciones a entrevistas, links de evaluación, ofertas, rechazos) y las propone en lote para tu aprobación antes de escribir nada en el tracker.
- **`/rank`** califica en lote todas las vacantes recién buscadas contra el framework de compatibilidad y devuelve una lista corta ordenada con fortalezas y brechas por vacante.
- **`/expand`** enriquece tu perfil escaneando fuentes públicas que ya tienes vinculadas (repos de GitHub, portafolio, Kaggle, Google Scholar) y consultando los temarios de cursos y certificaciones nombrados.
- **`/upskill`** analiza la brecha entre tu perfil y las vacantes registradas (o una sola vacante via `/upskill <URL>`). Produce un mapa de calor de brechas de habilidades y un plan de aprendizaje con recursos buscados en web y estimaciones de tiempo.
- **`/html-report`** genera un dashboard HTML independiente desde `job_search_tracker.csv` y los archivos de postulación — tarjetas de estadísticas, gráficas de estado/sector/canal/embudo (SVG inline, sin dependencias externas) y una tabla filtrable de postulaciones.
- **`/add-template`** registra tu propio template de CV o carta de presentación (LaTeX, Typst u otra cadena de herramientas) en lugar de los incluidos.
- **`/add-portal`** genera un skill de búsqueda para un portal de empleo de tu mercado. Investiga el portal, arma el CLI skill con la misma estructura que los incluidos y ejecuta una búsqueda de prueba antes de registrar nada.

`/reset` también está disponible, consulta [Empezar de nuevo](#empezar-de-nuevo) más abajo.

## Estructura de archivos

```
ai-job-search-mexico/
├── CLAUDE.md                          # Perfil principal del candidato + reglas del flujo
├── AGENTS.md                          # Thin-pointer para motores de IA (Gemini, Claude, Codex...)
├── .claude/
│   ├── commands/
│   │   ├── apply.md                   # /apply flujo redactor-revisor
│   │   ├── setup.md                   # /setup onboarding (carpeta documentos, CV, entrevista)
│   │   ├── expand.md                  # /expand enriquecimiento de perfil desde documentos y presencia online
│   │   ├── add-template.md            # /add-template registrar templates personalizados (LaTeX, Typst...)
│   │   ├── add-portal.md              # /add-portal generar un skill de búsqueda para tu mercado
│   │   ├── rank.md                    # /rank priorizar vacantes buscadas en una lista corta
│   │   ├── outcome.md                 # /outcome registrar resultados, archivar materiales
│   │   ├── gmail-sync.md              # /gmail-sync detectar estado de postulaciones desde Gmail
│   │   ├── interview.md               # /interview paquete de preparación por etapa + entrevista simulada
│   │   ├── html-report.md             # /html-report generar dashboard de seguimiento
│   │   ├── notion-sync.md             # /notion-sync vista del pipeline en base de datos Notion
│   │   └── reset.md                   # /reset limpiar datos de perfil o carpeta de documentos
│   ├── skills/
│   │   ├── job-application-assistant/ # Skill principal de postulación
│   │   │   ├── SKILL.md               # Definición del skill
│   │   │   ├── 01-candidate-profile.md # Tu educación, experiencia, habilidades
│   │   │   ├── 02-behavioral-profile.md# Evaluación PI/DISC/personalidad
│   │   │   ├── 03-writing-style.md    # Tono, estructura, qué hacer y qué no
│   │   │   ├── 04-job-evaluation.md   # Framework de puntuación de compatibilidad laboral
│   │   │   ├── 05-cv-templates.md     # Estructura LaTeX del CV + reglas de personalización
│   │   │   ├── 06-cover-letter-templates.md # Templates LaTeX de carta de presentación
│   │   │   └── 07-interview-prep.md   # Ejemplos STAR + framework de entrevista
│   │   ├── job-scraper/               # Orquestación de búsqueda de empleo
│   │   └── upskill/                   # Análisis de brechas de habilidades y plan de aprendizaje
│   └── settings.json                  # Permisos del agente (compartidos, con alcance)
├── .agents/skills/                    # Herramientas CLI de portales de empleo
│   ├── mexico-portals-search/         # OCC Mundial + Computrabajo México (Python, sin deps)
│   ├── getonbrd-search/               # Get on Board — tech jobs México/LATAM (Node.js ESM)
│   ├── linkedin-search/               # LinkedIn vacantes públicas (agnóstico de país)
│   ├── freehire-search/               # freehire.me agregador tech (multi-mercado, REST API)
│   ├── jobbank-search/                # Akademikernes Jobbank (Dinamarca, disabled)
│   ├── jobdanmark-search/             # Jobdanmark.dk (Dinamarca, disabled)
│   ├── jobindex-search/               # Jobindex.dk (Dinamarca, disabled)
│   └── jobnet-search/                 # Jobnet.dk (Dinamarca, portal gubernamental, disabled)
├── cv/
│   └── main_example.tex               # Template moderncv LaTeX
├── cover_letters/
│   ├── cover.cls                      # Clase LaTeX personalizada para carta de presentación
│   ├── cover_example.tex              # Carta de ejemplo (referencia estructural + CI smoke test)
│   └── OpenFonts/                     # Fuentes Lato + Raleway
├── templates/                         # Templates personalizados registrados via /add-template
│   └── README.md                      # Instrucciones de estructura de la carpeta
├── documents/                         # Materiales de carrera para /setup y /expand
│   ├── README.md                      # Instrucciones de estructura de la carpeta
│   ├── cv/                            # CV maestro (PDF o .tex)
│   ├── linkedin/                      # Exportación del perfil LinkedIn (PDF)
│   ├── diplomas/                      # Certificados de grado y transcripciones
│   ├── references/                    # Cartas de referencia
│   └── applications/                  # Postulaciones pasadas (<empresa>_<puesto>/)
├── .github/workflows/ci.yml           # CI: compilaciones LaTeX, lint de skills, typechecks CLI
├── salary_lookup.py                   # Herramienta de benchmarking salarial
├── salary_data.json                   # Datos salariales de empresas tech en México (MXN)
├── tools/
│   ├── check_framework_version.py     # CI: verifica que framework_version se incrementa con cambios
│   ├── check_upstream_updates.py      # Previsualiza qué archivos personalizados toca una actualización upstream
│   ├── convert_salary_excel.py        # Convertir Excel de salarios a JSON
│   ├── install_portal_clis.py         # Instalar cada CLI de portal descubierto
│   ├── lint_skills.py                 # CI lint para skills, commands y settings.json
│   ├── robots_check.py                # Verificar robots.txt antes de scraping
│   ├── security_guards.py             # CI: lista blanca de permisos, reglas gitignore, manifiestos
│   ├── upstream_triage.py             # Clasificar commits upstream en "vale la pena revisar" vs "probablemente omitir"
│   ├── verify_layout.py               # Medir el layout de un PDF compilado (huecos, huérfanos, colisiones)
│   ├── verify_pdf.py                  # Verificar conteo de páginas y texto extraíble de un PDF
│   └── README_SALARY_TOOL.md          # Instrucciones de configuración de la herramienta de salarios
├── job_scraper/                       # Estado del scraper (jobs vistos, resultados)
├── gmail_sync/                        # Estado de /gmail-sync (IDs de mensajes procesados, fecha de último sync)
├── upskill/                           # Salida de reportes /upskill (reportes markdown por ejecución)
├── job_search_tracker.csv             # Hoja de seguimiento de postulaciones
└── SETUP.md                           # Guía detallada de configuración
```

## Cómo funciona `/apply`

El comando `/apply` ejecuta un **flujo de trabajo redactor-revisor** con compilación PDF obligatoria:

1. **Analiza** la vacante (URL o texto)
2. **Evalúa la compatibilidad** con tu perfil (habilidades, experiencia, cultura, ubicación, alineación de carrera)
3. **Redacta** un CV y una carta de presentación personalizados en LaTeX
4. **Lanza un agente revisor** que investiga la empresa y critica los borradores
5. **Revisa** según la retroalimentación del revisor
6. **Compila e inspecciona** ambos PDFs: `lualatex` para el CV, `xelatex` para la carta. El agente lee las páginas renderizadas e itera el LaTeX hasta que el CV tenga exactamente 2 páginas sin títulos huérfanos, y la carta sea exactamente 1 página con la firma visible y fuentes consistentes.
7. **Verifica ATS del CV**: extrae la capa de texto del PDF (`pdftotext`, dependencia opcional) y la verifica como lo haría un parser ATS — datos de contacto presentes como texto literal, sin glifos corruptos, orden de lectura coherente — luego puntúa la cobertura de palabras clave de la vacante contra la extracción. Las palabras clave que el perfil genuinamente soporta se agregan; las brechas reales permanecen visibles, nunca se rellenan.
8. **Presenta** el resultado final con una lista de verificación

Todas las afirmaciones en el CV y la carta se verifican contra tu perfil real. El sistema nunca fabrica habilidades ni experiencia.

### Qué hace diferente a este flujo

- **Ciclo de verificación PDF.** La mayoría de los templates de CV en LaTeX producen resultados que "se ven bien en el .tex" pero se rompen en el PDF. El comando `/apply` compila e inspecciona visualmente cada PDF y aplica correcciones específicas hasta que el layout esté limpio.
- **Verificación ATS en la capa de texto del PDF.** Un ATS lee el texto embebido del PDF, no la página renderizada. `/apply` extrae la capa de texto del CV compilado con `pdftotext` y verifica los datos de contacto, el orden de lectura y la cobertura de palabras clave. Regla de honestidad: una palabra clave que el perfil no soporta se reconoce como brecha, nunca se rellena.
- **Corte del CV ponderado por relevancia.** Cuando el CV supera las 2 páginas, el flujo no corta mecánicamente desde la sección "más antigua". Puntúa cada línea candidata por (a) relevancia con la vacante objetivo, (b) unicidad en el documento, y (c) si la carta depende de ella, y corta primero la línea con menor puntuación total.
- **Separación redactor-revisor.** El redactor escribe; un segundo agente Gemini, lanzado con contexto fresco, investiga la empresa y critica los borradores. El redactor luego revisa.
- **Despacho eficiente del revisor.** El agente revisor recibe los borradores en línea en lugar de releerlos, y la lista de verificación corre una sola vez al final del flujo.

## Personalización

### Qué archivos editar manualmente

Si prefieres editar archivos directamente en lugar de usar `/setup`:

| Archivo | Qué cambiar |
|---------|-------------|
| `CLAUDE.md` | Tu perfil completo (nombre, educación, experiencia, habilidades, objetivos) |
| `01-candidate-profile.md` | Versión estructurada de los datos de tu CV |
| `02-behavioral-profile.md` | Tu evaluación conductual o autoevaluación |
| `04-job-evaluation.md` | Áreas de coincidencia de habilidades, objetivos de carrera, filtros de motivación |
| `05-cv-templates.md` | Templates de declaración de perfil para diferentes tipos de puesto |
| `07-interview-prep.md` | Tus ejemplos STAR de experiencia real |
| `search-queries.md` | Consultas de búsqueda de empleo para tus habilidades y ubicación |

### Actualizar tus búsquedas

A medida que evolucionan tus prioridades, puedes reconfigurar solo la búsqueda de empleo sin re-ejecutar el setup completo del perfil:

```
/setup --section search
```

Esto re-ejecuta la entrevista de configuración de búsqueda: qué roles apuntar, qué habilidades buscar, qué ubicaciones y qué portales. También sugiere tipos de rol que podrías no haber considerado basándose en tu perfil.

### Templates personalizados

El CV usa [moderncv](https://ctan.org/pkg/moderncv) (estilo bancario). La carta de presentación usa una clase `cover.cls` personalizada con fuentes Lato/Raleway. Ambos son LaTeX — el motor de referencia que incluye y mantiene este repo.

Para usar tu propio template en su lugar — LaTeX, [Typst](https://typst.app/), u otra cadena de herramientas que compile a PDF desde la línea de comandos — ejecuta:

```
/add-template
```

Apúntalo a tu archivo fuente. El comando te entrevista sobre las instrucciones del template — extensión fuente, comando de compilación, fuentes y dónde viven, reglas de estilo a preservar, límite de páginas — almacena todo bajo `templates/`, ejecuta una compilación de prueba obligatoria y activa el template para que `/apply` redacte y compile desde él.

- `/add-template --list` muestra los templates registrados
- `/add-template --use <nombre>` cambia entre ellos
- `/add-template --use default` revierte a los templates estándar moderncv / cover.cls

### Herramientas de búsqueda de empleo

Este repositorio incluye skills de búsqueda activas para los **principales portales de empleo tech en México**:

- **`mexico-portals-search`** — Consulta **OCC Mundial** y **Computrabajo México** con scraping HTML liviano. Sin dependencias externas (Python puro). Devuelve título, empresa, ubicación y salario en MXN. Uso: `python .agents/skills/mexico-portals-search/cli/src/cli.py search -q "desarrollador python" --format table`
- **`getonbrd-search`** — Consulta la **API REST pública de Get on Board** ([getonbrd.com](https://www.getonbrd.com)). Tech-focused para México y LATAM. 120 resultados por página, JSON estructurado, sin autenticación. Uso: `node .agents/skills/getonbrd-search/cli/src/cli.js search -q "python" -c "Mexico" --limit 10`
- **`linkedin-search`** — Construido sobre los endpoints públicos `jobs-guest` de LinkedIn. Agnóstico de campo, **cero dependencias en tiempo de ejecución**, toma la ubicación como flag explícito (`-l "Ciudad de México"`, `-l "Remote"`, …). **Solo uso personal** — el acceso automatizado va contra los Términos de Servicio de LinkedIn, así que mantén el volumen bajo.
- **`freehire-search`** — Consulta la API REST pública de [freehire.me](https://freehire.me). Tech-focused (software, datos, ingeniería, DevOps, remoto), multi-mercado via flags de facetas.
- Los portales daneses (`jobbank`, `jobdanmark`, `jobindex`, `jobnet`) están incluidos con `enabled: false` como referencia de implementación.

Para agregar un portal adicional (por ejemplo, Indeed México, Hireline, OCC con scraping más profundo), ejecuta:

```
/add-portal
```

### Extender el framework: portales, templates, criterios

El framework tiene tres puntos de extensión, y ninguno requiere tocar el upstream:

1. **Portal skills** — el sistema de módulos para bolsas de trabajo. Cada skill `*-search` es una carpeta independiente bajo `.agents/skills/` con el mismo contrato (un CLI `search`/`detail`, salida `--format json|table|plain`, un flag `enabled:` en su `SKILL.md`). `/scrape` auto-descubre cualquier skill instalado que siga el contrato.
2. **Templates de documentos** — `/add-template` registra cualquier cadena de herramientas de CV o carta que compile a PDF desde la línea de comandos.
3. **Criterios de evaluación** — los deal-breakers y preferencias en tu perfil son de forma libre. "Prestaciones superiores a la ley", "salario mínimo X MXN/mes", "sin guardias nocturnas" — cada uno es una línea del perfil, sin código, y tiene peso real en las evaluaciones de compatibilidad de `/rank` y `/apply`.

**Tomar prestado un portal skill de otro fork** es la forma prevista de obtener un portal que el upstream no incluye: encuentra la carpeta en otro fork y cópiala a tu propio `.agents/skills/`. Antes de ejecutarla: lee el código completo, verifica que las únicas llamadas de red vayan al portal que dice buscar, y que `package.json` no tenga dependencias ni scripts de ciclo de vida.

### Benchmarking salarial

Este repositorio incluye `salary_data.json` con datos de **16 empresas tech en México** (Mercado Libre, Nubank MX, BBVA MX, Wizeline, Oracle MX, Intel MX, IBM MX, Softtek, Globant MX, Kavak, Clip, Coppel Tech, Bitso, TCS MX, Amazon MX, Microsoft MX) expresados en **Pesos Mexicanos (MXN/mes brutos)**, con una mediana de referencia de \$45,000 MXN.

Para extender los datos: usa el script `tools/convert_salary_excel.py` para convertir fuentes propias (exportaciones de Glassdoor México, OCC, encuestas salariales, investigación personal) al formato JSON esperado. Consulta `tools/README_SALARY_TOOL.md` para el formato y la configuración. Si no tienes datos de salarios, el paso salarial simplemente se omite.

### Empezar de nuevo

Para limpiar los datos de tu perfil y comenzar de cero:

```
/reset profile    # limpia archivos de skill, preserva las reglas del framework
/reset documents  # elimina archivos de la carpeta documents/
/reset all        # ambos
```

`/reset` muestra exactamente qué se eliminará y requiere que escribas `RESET` para confirmar. Nada se elimina hasta que lo hagas.

### Mantenerse actualizado

Revisa las [releases etiquetadas](../../releases) en vez de hacer pull de `master` directamente. `python tools/check_upstream_updates.py` previsualiza exactamente qué archivos personalizados toca una actualización antes de hacer merge, y `python tools/upstream_triage.py` clasifica los commits pendientes en "vale la pena revisar" vs "probablemente omitir". Guía completa en [SETUP.md](SETUP.md).

## Consejos para mejores resultados

### La profundidad del perfil importa

El factor más importante en la calidad del resultado es cuánto detalle pones en tu perfil. Un perfil delgado produce postulaciones genéricas; uno detallado permite resultados genuinamente personalizados.

- **Descripciones de rol:** No solo listes títulos. Describe qué hiciste realmente en cada puesto: proyectos específicos, herramientas usadas, responsabilidades y logros medibles.
- **Habilidades en contexto:** En lugar de listar "Python" o "gestión de proyectos", describe cómo y dónde las aplicaste. "Construí pipelines de ML para predicción de churn de clientes en Python usando scikit-learn" le da al sistema mucho más con qué trabajar que solo "Python, machine learning."
- **Todos los caminos de onboarding funcionan:** Ya sea que apuntes `/setup` a tu carpeta `documents/`, pegues un solo CV o recorras la entrevista, el principio es el mismo: una entrada más rica produce resultados más precisos.

### Descubrimiento de trayectoria profesional

El framework soporta dos modos distintos de búsqueda de empleo:

- **Targeting explícito:** Sabes qué roles o sectores quieres. El sistema ayuda a refinar y priorizar basándose en la compatibilidad.
- **Descubrimiento de oportunidades latentes:** Al analizar tu historial completo (no solo títulos, sino el trabajo real que hiciste), el sistema puede revelar trayectorias profesionales que no habías considerado. Habilidades transferibles que mapean a industrias inesperadas, patrones en lo que disfrutaste o en lo que te destacaste, o roles emergentes que combinan tu expertise de dominio con nueva tecnología.

Para obtener el máximo provecho, invierte tiempo durante `/setup` describiendo no solo tu experiencia, sino qué te energizó, qué te agotó y qué querrías más en el futuro.

## Contribuir

¿Pensando en un PR? Lee [CONTRIBUTING.md](CONTRIBUTING.md) primero — explica qué se fusiona, qué vive en forks y por qué.

## Agradecimientos

- [Mads Lorentzen](https://github.com/MadsLorentzen) por el proyecto original [ai-job-search](https://github.com/MadsLorentzen/ai-job-search) del que se deriva esta adaptación
- [Mikkel Krogholm](https://github.com/mikkelkrogsholm) por los skills originales de búsqueda en portales
- Adaptado para el mercado mexicano y optimizado para **Gemini** por [Andrés Bréceda](https://github.com/AndresBreceda)
- Desarrollado con [Google Antigravity](https://deepmind.google) impulsado por **Gemini**

## Licencia

MIT
