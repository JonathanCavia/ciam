# Plan 0001 — Entorno local con Docker Compose para Hugo

- **Estado:** En curso
- **Fecha de propuesta:** 2026-11-18
- **Alcance:** Añadir un entorno Docker Compose para ejecutar el servidor de desarrollo de Hugo, una interfaz Makefile para las tareas comunes y actualizar las instrucciones de inicio local.
- **Planes relacionados:** Ninguno.
- **Responsable de implementación:** Codex, después de la aprobación explícita de una persona.

## Contexto y problema

El repositorio contiene un sitio Hugo estático para CIAM, pero no tiene configuración Docker. El README indica que Hugo debe instalarse en la máquina local. La solicitud es poder iniciar el sitio con Docker Compose.

Estado comprobado antes de proponer el plan: hay `hugo.toml`, `layouts/index.html`, `data/jurisdicciones.yaml`, `static/css/site.css`, `static/js/site.js` y un README; no existen `compose.yml`, `Dockerfile` ni `.dockerignore`.

## Objetivo

Permitir que una persona con Docker y el plugin Compose configure, ejecute, reconstruya y compruebe el sitio Hugo desde el repositorio sin instalar Hugo en su máquina ni herramientas de lint en el host.

## Alcance

1. Añadir `compose.yml` y `Dockerfile` para un servicio de desarrollo Hugo, publicar el puerto 1313 y enlazar Hugo a `0.0.0.0`.
2. Montar el directorio del proyecto dentro del contenedor y configurar el servidor Hugo para detectar cambios por polling, reconstruir y recargar la página automáticamente.
3. Añadir un `Makefile` con los targets `setup`, `up`, `down`, `restart`, `rebuild`, `test`, `lint` y `lint-fix`.
4. Ejecutar el formateo/lint del frontend desde un contenedor de herramientas, con versiones fijadas en los manifiestos del repo; no requerir Node instalado en el host.
5. Documentar prerrequisitos y flujo con Make, conservando la alternativa de ejecución nativa con Hugo.

### Fuera de alcance

- Crear una imagen de producción o un servidor web estático.
- Publicar, desplegar o configurar un dominio.
- Añadir servicios backend, bases de datos, secretos, volúmenes persistentes de datos de usuario o automatización CI.

## Requerimientos y criterios de aceptación

| ID | Requerimiento | Criterio de aceptación / evidencia |
| --- | --- | --- |
| REQ-01 | Configurar dependencias y contenedores. | `make setup` prepara la imagen de Hugo y las herramientas de lint con Docker, sin Hugo ni Node instalados localmente. |
| REQ-02 | Acceder al sitio desde el host. | El sitio responde en `http://localhost:1313/`. |
| REQ-03 | Recarga automática durante desarrollo. | `make up` ejecuta Hugo con polling y live reload; al cambiar una plantilla, contenido o recurso montado, Hugo reconstruye y el navegador actualiza la página automáticamente. |
| REQ-04 | Cubrir las tareas operativas solicitadas. | Makefile define `setup`, `up`, `down`, `restart`, `rebuild`, `test`, `lint` y `lint-fix`, con comandos funcionales documentados. |
| REQ-05 | Comprobar el sitio. | `make test` realiza una compilación Hugo y devuelve fallo si Hugo no puede generar el sitio. |
| REQ-06 | Revisar y corregir estilo. | `make lint` comprueba formato de plantillas y recursos del frontend; `make lint-fix` aplica el mismo formateo. |
| REQ-07 | Documentar el flujo. | README indica prerrequisitos, targets Make, acceso local y alternativa nativa. |
| REQ-08 | Mantener el alcance de POC. | Compose ejecuta Hugo y herramientas de desarrollo; no agrega backend ni despliegue. |

## Decisiones y restricciones

- **Decisión:** Usar una imagen base Hugo (`hugomods/hugo:exts`) en un `Dockerfile` pequeño, construido por Compose, para que `rebuild` tenga un significado explícito y reproducible.
- **Decisión:** Montar el repo como `/src`, enlazar el servidor a `0.0.0.0`, usar `--poll 700ms` en Hugo para detectar cambios a través del volumen montado y mapear `1313:1313` para el acceso desde el host.
- **Decisión:** `make up` ejecutará Hugo en modo servidor de desarrollo; su live reload reconstruye el sitio y actualiza el navegador tras cambios detectados. No implica conservar estado de JavaScript como HMR de una aplicación SPA.
- **Decisión:** Añadir un servicio de herramientas Node para Prettier y `prettier-plugin-go-template`. `lint` ejecutará Prettier en modo check y `lint-fix` aplicará Prettier a los mismos archivos.
- **Decisión:** `test` ejecutará una compilación Hugo de producción. No hay una suite de tests en el estado actual del repo.
- **Decisión:** Make targets operativos delegarán a Docker Compose: `setup` prepara imágenes y dependencias; `up` inicia Hugo en segundo plano; `down` detiene y elimina contenedores; `restart` reinicia Hugo; `rebuild` reconstruye sin caché y recrea Hugo.
- **Restricción:** La configuración es para desarrollo local, no para publicación o producción.
- **Supuesto:** La máquina tiene Docker Engine y Docker Compose v2; se confirmará con las instrucciones y la comprobación de Compose.
- **Riesgo:** El tag `exts` puede cambiar con el tiempo. Se revisará que la imagen exista y pueda ejecutar Hugo antes de cerrar la implementación.

## Dependencias y riesgos

- Docker debe estar instalado y operativo en la máquina del usuario.
- La descarga inicial de la imagen requiere acceso al registro de contenedores.
- La configuración de lint requiere acceso inicial a npm para resolver las dependencias fijadas.
- En sistemas que no admiten eventos de filesystem montado, el refresco puede requerir sondeo; validar si aplica antes de añadir configuración adicional.

## Fases de trabajo

### Fase 1 — Contenedores y tareas Make

- Crear los servicios Hugo y de herramientas con volumen de trabajo, puerto y comandos apropiados.
- Crear Makefile para los ocho targets solicitados.
- **Aceptación:** Compose acepta la configuración, `make up` activa polling/live reload y los targets Make ejecutan la tarea indicada.

### Fase 2 — Documentación y verificación

- Actualizar README con Docker Compose y conservar el flujo nativo.
- Comprobar la configuración y el acceso local si Docker está disponible.
- **Aceptación:** Los pasos documentados coinciden con los comandos y la verificación registra su resultado real.

## Mapa de archivos previsto

Comprobado contra el estado del repositorio el 2026-11-18.

| Archivo o grupo | Acción | Motivo |
| --- | --- | --- |
| `compose.yml` | Crear | Definir los servicios locales de Hugo y herramientas de lint. |
| `Dockerfile` | Crear | Fijar la imagen base y el comando Hugo del servicio de desarrollo. |
| `Makefile` | Crear | Exponer los targets `setup`, `up`, `down`, `restart`, `rebuild`, `test`, `lint` y `lint-fix`. |
| `package.json` y `package-lock.json` | Crear | Fijar Prettier y el plugin Go Template para lint/fix reproducible. |
| `.prettierrc.json` | Crear | Configurar Prettier para las plantillas Hugo y recursos soportados. |
| `.prettierignore` | Crear | Excluir artefactos generados y archivos fuera del alcance de formato. |
| `.dockerignore` | Crear | Excluir dependencias locales y artefactos generados del contexto Docker. |
| `.gitignore` | Crear | Excluir dependencias y artefactos de Hugo/Node generados localmente. |
| `README.md` | Modificar | Documentar prerrequisitos y targets Make, además del método nativo. |
| `DOCS/PLANS/README.md` | Modificar | Registrar el plan nuevo en el índice. |
| `DOCS/PLANS/0001-compose-desarrollo-hugo.md` | Crear | Registrar alcance, criterios, archivos y resultados según las instrucciones del repo. |

No se prevén cambios a `hugo.toml`, plantillas, contenido o recursos estáticos.

## Verificación prevista

- [ ] `make setup`: imágenes y dependencias se preparan.
- [ ] `docker compose config`: Compose acepta la configuración propuesta.
- [ ] `make up`: el servicio inicia Hugo sin errores.
- [ ] Abrir `http://localhost:1313/`: la portada se muestra correctamente.
- [ ] Cambiar una plantilla, contenido o recurso del proyecto y confirmar que Hugo lo detecta y el navegador recarga automáticamente.
- [ ] `make test`, `make lint` y `make lint-fix`: completan sus tareas documentadas.
- [ ] `make down`: el servicio se detiene.
- [ ] Revisión humana del Compose y de las instrucciones actualizadas.

## Aprobación y revisión humana

| Hito | Decisión | Persona | Fecha | Observaciones |
| --- | --- | --- | --- | --- |
| Aprobación del plan antes de implementar | Aprobado | Usuario | 2026-11-18 | Aprobación explícita del plan en la conversación. |
| Revisión de la implementación | Pendiente | — | — | Revisar el resultado y los criterios de aceptación. |

## Implementación y archivos modificados

| Archivo o grupo modificado | Motivo del cambio | ¿Estaba previsto? |
| --- | --- | --- |
| `compose.yml` | Define Hugo y el servicio de herramientas, el volumen del proyecto, el puerto y el perfil de tooling. | Sí |
| `Dockerfile` | Define la imagen Hugo de desarrollo y ejecuta `hugo server` con polling de 700 ms. | Sí |
| `Makefile` | Añade los ocho targets de operación, build, test y lint solicitados. | Sí |
| `package.json` | Fija Prettier y `prettier-plugin-go-template` con versiones exactas y scripts lint/fix. | Sí |
| `package-lock.json` | Fija las dependencias transitivas al instalar las herramientas de lint. | Sí |
| `.prettierrc.json`, `.prettierignore` | Configuran el formato de plantillas Hugo y archivos incluidos. | Sí |
| `.dockerignore`, `.gitignore` | Excluyen dependencias y artefactos generados de los contextos correspondientes. | Sí |
| `README.md` | Documenta Compose, recarga automática, targets Make y ejecución nativa; Prettier normalizó su tabla de targets. | Sí |
| `layouts/index.html`, `static/css/site.css`, `static/js/site.js` | Prettier aplicó el formato configurado como parte de `make lint-fix`. | Sí |
| `DOCS/PLANS/README.md`, `DOCS/PLANS/0001-compose-desarrollo-hugo.md` | Registran el estado del plan, la aprobación, la implementación y la verificación. | Sí |

`package-lock.json` se generó al instalar las dependencias de herramientas el 2026-11-18. El primer intento no pudo resolver `registry.npmjs.org`; al reintentar con Docker disponible, npm reveló que el nombre configurado inicialmente (`@prettier/plugin-go-template`) no existe. Se corrigió al paquete publicado `prettier-plugin-go-template` dentro del mismo alcance aprobado.

## Verificación realizada

- `docker compose config --quiet`: pasó el 2026-11-18.
- `docker compose --profile tools config --quiet`: pasó el 2026-11-18; el perfil expone los servicios `hugo` y `tools`.
- `make -n setup up down restart rebuild test lint lint-fix`: pasó el 2026-11-18; Make expandió los ocho targets a los comandos previstos. No ejecutó los servicios.
- `node --check static/js/site.js` y lectura JSON de `package.json` y `.prettierrc.json`: pasó el 2026-11-18.
- `git diff --check`: pasó para los cambios de esta implementación. `git diff --cached --check` señala una línea en blanco extra al final del `hugo.toml` ya staged, que queda fuera del mapa aprobado y no se modificó.
- `make setup`: no pudo completar el 2026-11-18. El primer intento no pudo escribir en `~/.docker/buildx`; al redirigir `BUILDX_CONFIG` a `/tmp`, Docker denegó acceso a `unix:///Users/jon4/.docker/run/docker.sock`.
- `npm install --package-lock-only ...`: el intento inicial no pudo resolver `registry.npmjs.org` (`ENOTFOUND`); el intento posterior desde el servicio Docker `tools` pasó tras corregir el nombre del plugin y generó `package-lock.json`.
- `docker compose run --rm --no-deps tools npm install --ignore-scripts --no-audit --no-fund`: pasó el 2026-11-18; instaló las dependencias y generó `package-lock.json`.
- `make lint-fix`: pasó el 2026-11-18; Prettier aplicó formato a `layouts/index.html`, `static/css/site.css`, `static/js/site.js` y `README.md`; `data/jurisdicciones.yaml` no necesitó cambios.
- `make setup`: volvió a fallar antes de instalar dependencias porque Docker no pudo escribir en `/Users/jon4/.docker/buildx/activity` (`operation not permitted`). La instalación del servicio `tools` se completó directamente con el comando registrado arriba.
- `make test`, `make lint`, acceso por navegador y comprobación del hot reload: pendientes.

## Registro de cambios del plan

| Fecha | Cambio | Motivo / decisión |
| --- | --- | --- |
| 2026-11-18 | Creación de la propuesta | Registrar el alcance de Compose solicitado y los archivos actuales del repo. |
| 2026-11-18 | Ampliación propuesta: targets Make y herramientas de lint/fix | Incorporar los targets `up`, `down`, `restart`, `setup`, `rebuild`, `test`, `lint` y `lint-fix` solicitados; mantener pendiente la aprobación del plan. |
| 2026-11-18 | Requerimiento añadido: hot reload con `make up` | Especificar polling del volumen montado, reconstrucción Hugo y actualización automática del navegador. |
| 2026-11-18 | Aprobación explícita y comienzo de implementación | El usuario aprobó el plan actualizado. |
| 2026-11-18 | Implementación local | Archivos previstos creados; verificación de runtime incompleta por permisos del socket Docker y falta de resolución DNS de npm. |
| 2026-11-18 | Corrección de dependencia y lint/fix | Se cambió el nombre del plugin en `package.json` y `.prettierrc.json` tras npm responder 404, se generó `package-lock.json` y `make lint-fix` pasó. `make setup` sigue bloqueado por permisos de Buildx al construir Hugo. |
