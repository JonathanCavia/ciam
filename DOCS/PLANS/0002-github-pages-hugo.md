# Plan 0002 — Publicación del sitio Hugo en GitHub Pages

- **Estado:** Implementado — pendiente de revisión humana
- **Fecha de propuesta:** 2026-11-24
- **Alcance:** Configurar la publicación del sitio Hugo en GitHub Pages mediante GitHub Actions al actualizar `main`, y documentar cómo habilitarla en GitHub.
- **Planes relacionados:** [0001 — Entorno local con Docker Compose para Hugo](0001-compose-desarrollo-hugo.md)
- **Responsable de implementación:** Codex, después de la aprobación explícita de una persona.

## Contexto y problema

El repositorio `JonathanCavia/ciam` contiene un sitio estático Hugo que hoy solo documenta cómo ejecutarlo localmente. `hugo.toml` usa `https://example.org/` como `baseURL`, y no existe un workflow de GitHub Actions. El plan 0001 excluyó expresamente publicar o desplegar el sitio.

## Objetivo

Publicar automáticamente el sitio en `https://jonathancavia.github.io/ciam/` cuando haya cambios en `main`, y permitir iniciar una publicación manual desde GitHub Actions.

## Alcance

1. Configurar la URL de producción de Hugo para la URL de GitHub Pages del repositorio.
2. Añadir un workflow de GitHub Actions que compile el sitio y lo publique usando GitHub Pages.
3. Documentar la activación inicial de GitHub Pages y el flujo de publicación en el README.

### Fuera de alcance

- Configurar un dominio personalizado, DNS o HTTPS fuera del dominio administrado por GitHub Pages.
- Publicar, desplegar o cambiar la configuración del repositorio remoto como parte de la implementación local.
- Cambiar contenido, estilos o comportamiento del sitio.

## Requerimientos y criterios de aceptación

| ID | Requerimiento | Criterio de aceptación / evidencia |
| --- | --- | --- |
| REQ-01 | Construir el sitio para la ruta de proyecto de GitHub Pages. | Los enlaces generados por Hugo incluyen `/ciam/` y la URL de producción es `https://jonathancavia.github.io/ciam/`. |
| REQ-02 | Automatizar la publicación. | Un workflow en GitHub Actions construye el directorio `public` en pushes a `main` y lo despliega con las acciones oficiales de GitHub Pages. |
| REQ-03 | Permitir una ejecución manual. | El workflow declara `workflow_dispatch`. |
| REQ-04 | Documentar la configuración inicial. | README explica seleccionar GitHub Actions como fuente en Settings → Pages y dónde consultar el resultado. |
| REQ-05 | Mantener la publicación bajo control del repositorio. | No se realizan commits, pushes, cambios remotos de Settings ni despliegues durante esta implementación. |

## Decisiones y restricciones

- **Decisión:** Usar GitHub Actions y el flujo de artifacts de GitHub Pages (`upload-pages-artifact` y `deploy-pages`), sin una rama `gh-pages` mantenida manualmente.
- **Decisión:** Usar la URL de proyecto `https://jonathancavia.github.io/ciam/`, derivada del remoto `JonathanCavia/ciam`.
- **Decisión:** Disparar el workflow en pushes a `main` y ofrecer `workflow_dispatch` para ejecuciones manuales.
- **Restricción:** GitHub Pages debe configurarse en Settings → Pages para usar GitHub Actions como fuente antes de que el workflow pueda publicar.
- **Supuesto:** El repositorio seguirá publicándose bajo `jonathancavia.github.io/ciam/`; un dominio personalizado requeriría revisar el `baseURL` y este plan.

## Dependencias y riesgos

- La publicación necesita que Pages esté habilitado para el repositorio y que GitHub Actions tenga permisos de lectura del contenido, escritura de Pages y emisión de identidad OIDC.
- La URL del sitio depende de la ruta del repositorio. Si cambia el propietario, nombre o dominio, hay que actualizar el `baseURL`.

## Fases de trabajo

### Fase 1 — Configuración de Hugo y workflow

- Actualizar `baseURL` y crear el workflow de build y deploy.
- **Aceptación:** El workflow genera un artifact de Pages desde `public` y define deploy automático en `main` y ejecución manual.

### Fase 2 — Documentación y revisión

- Documentar la activación inicial y el seguimiento de la publicación en el README.
- Revisar el mapa de archivos y los criterios de aceptación.
- **Aceptación:** Los pasos documentados corresponden al workflow y la publicación queda pendiente de la habilitación/configuración humana en GitHub.

## Mapa de archivos previsto

Comprobado contra el estado del repositorio el 2026-11-24. No hay actualmente un directorio `.github/workflows/`.

| Archivo o grupo | Acción | Motivo |
| --- | --- | --- |
| `hugo.toml` | Modificar | Cambiar `baseURL` desde el placeholder `https://example.org/` a la URL de proyecto GitHub Pages. |
| `.github/workflows/deploy-pages.yml` | Crear | Compilar Hugo en GitHub Actions y publicar el artifact de Pages en pushes a `main` o ejecución manual. |
| `README.md` | Modificar | Documentar la selección de GitHub Actions en Settings → Pages y cómo consultar el sitio publicado. |
| `DOCS/PLANS/README.md` | Modificar | Incluir esta propuesta en el índice de planes. |
| `DOCS/PLANS/0002-github-pages-hugo.md` | Crear | Registrar el alcance, criterios, mapa de archivos y resultado de la implementación. |

## Verificación prevista

- [x] `make test`: Hugo generó el sitio de producción con la nueva `baseURL` el 2026-11-24.
- [x] `make lint`: Prettier comprobó correctamente los archivos incluidos el 2026-11-24.
- [x] Revisar que el workflow use los permisos de Pages requeridos, publique el artifact `public` y solo despliegue para el evento previsto; revisión del archivo completada el 2026-11-24.
- [ ] Después de integrar los cambios y habilitar Pages en GitHub, revisar en Actions y en la URL pública que la publicación terminó correctamente.
- [ ] Revisión humana del workflow, la URL y las instrucciones.

## Aprobación y revisión humana

| Hito | Decisión | Persona | Fecha | Observaciones |
| --- | --- | --- | --- | --- |
| Aprobación del plan antes de implementar | Aprobado | Usuario | 2026-11-24 | Aprobación explícita en la conversación. |
| Revisión de la implementación | Pendiente | — | — | Revisar el resultado y los criterios de aceptación. |

## Implementación y archivos modificados

| Archivo o grupo modificado | Motivo del cambio | ¿Estaba previsto? |
| --- | --- | --- |
| `hugo.toml` | Configura el `baseURL` de producción para la URL de proyecto GitHub Pages. | Sí |
| `.github/workflows/deploy-pages.yml` | Compila Hugo en un contenedor y publica el artifact con GitHub Pages en pushes a `main` o ejecución manual. | Sí |
| `README.md` | Documenta la URL pública, la activación inicial de Pages y cómo seguir/iniciar publicaciones. | Sí |
| `DOCS/PLANS/README.md`, `DOCS/PLANS/0002-github-pages-hugo.md` | Registran la aprobación, el estado, la implementación y la verificación del plan. | Sí |

## Verificación realizada

- `make test`: pasó el 2026-11-24; Hugo v0.154.5+extended compiló 3 páginas y 2 archivos estáticos con la configuración de producción.
- `make lint`: pasó el 2026-11-24; todos los archivos del comando Prettier usan el formato esperado.
- Revisión del workflow: verificados manualmente los disparadores `push` a `main` y `workflow_dispatch`, permisos `contents: read`, `pages: write`, `id-token: write`, artifact `public` y acción de despliegue oficial.
- `git diff --check`: pasó el 2026-11-24.
- La primera ejecución de `make test lint` en sandbox falló por permisos al socket de Docker; ambas comprobaciones pasaron al repetirlas con acceso autorizado al daemon.
- No se cambió Settings en GitHub, no se hizo push y no se ejecutó un despliegue remoto. La publicación real queda pendiente de integrar los cambios y habilitar Pages.

## Registro de cambios del plan

| Fecha | Cambio | Motivo / decisión |
| --- | --- | --- |
| 2026-11-24 | Creación de la propuesta | Registrar la publicación solicitada y describir el estado actual del repo antes de implementar. |
| 2026-11-24 | Aprobación e inicio de implementación | El usuario aprobó el alcance; se inicia la configuración prevista. |
| 2026-11-24 | Implementación y verificación | Se configuró Hugo, el workflow y el README; build, lint y diff check pasaron. Queda pendiente la revisión humana y la primera publicación en GitHub. |
