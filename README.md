# CIAM · Centro de Información al Menor

Frontend estático en Hugo para orientar a niñas, niños y adolescentes sobre sus derechos y posibles pasos para pedir ayuda en Argentina.

## Ejecutar con Docker Compose

Requisitos: Docker Engine, Docker Compose v2 y `make`.

```sh
make setup
make up
```

Abrí [http://localhost:1313/](http://localhost:1313/). El servicio monta el repositorio dentro del contenedor y Hugo comprueba cambios cada 700 ms. Al modificar una plantilla, contenido o recurso, Hugo reconstruye la página y el navegador la actualiza automáticamente.

Para detener el servidor:

```sh
make down
```

### Targets disponibles

| Target          | Acción                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------- |
| `make setup`    | Valida Compose, construye la imagen Hugo e instala las herramientas de lint en un volumen Docker. |
| `make up`       | Inicia el servidor Hugo con polling y live reload en segundo plano.                               |
| `make down`     | Detiene y elimina los contenedores del proyecto.                                                  |
| `make restart`  | Reinicia el servidor Hugo.                                                                        |
| `make rebuild`  | Reconstruye la imagen Hugo sin caché y recrea el servidor.                                        |
| `make test`     | Construye el sitio Hugo en modo de producción.                                                    |
| `make lint`     | Comprueba el formato de las plantillas y los recursos del frontend con Prettier.                  |
| `make lint-fix` | Aplica Prettier a los mismos archivos.                                                            |

`make setup` es necesario antes de `make lint` o `make lint-fix`. En la primera ejecución, npm genera `package-lock.json` con las versiones exactas declaradas en `package.json`; revisá y conservá ese archivo para fijar también las dependencias transitivas. Docker descarga las imágenes y dependencias en el primer uso; no hace falta instalar Hugo ni Node en el host.

## Ejecutar Hugo directamente

Si Hugo ya está instalado, desde esta carpeta:

```sh
hugo server --baseURL http://localhost:1313/ --appendPort=false --poll 700ms
```

`hugo.toml` conserva la URL de producción (`https://jonathancavia.github.io/ciam/`); el comando local la reemplaza para servir el sitio en `localhost`.

## Publicar en GitHub Pages

El workflow de GitHub Actions compila el sitio con Hugo y publica el resultado en [https://jonathancavia.github.io/ciam/](https://jonathancavia.github.io/ciam/). Para habilitar la primera publicación, en el repositorio abrí **Settings → Pages → Build and deployment** y elegí **GitHub Actions** como fuente.

Después, cada push a `main` inicia una publicación. También podés iniciarla desde **Actions → Deploy Hugo site to GitHub Pages → Run workflow**. El estado y los errores de cada ejecución aparecen en esa sección de Actions.

## Actualizar jurisdicciones y recursos

La lista de provincias y CABA está en `data/jurisdicciones.yaml`. Cada fila tiene campos para el nombre del organismo (`autoridad`), teléfono (`telefono`), página oficial (`url_contacto`), norma local (`ley_local`) y su fuente oficial (`url_ley`). La guía muestra el organismo local de protección de derechos como punto de contacto y deriva a la Línea 102 cuando esté disponible en la localidad. Los campos están vacíos hasta verificar organismo, cobertura, horario y vigencia de cada fuente.

El plan se arma en el navegador y no manda ni guarda respuestas en un servidor. La página no usa analítica ni fuentes externas.

## Alcance del contenido

La información legal es general y no sustituye orientación legal o acompañamiento profesional. El marco nacional enlazado es la Ley 26.061; cada jurisdicción organiza sus autoridades y circuitos locales de protección.
