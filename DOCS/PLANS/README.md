# Índice de planes

Los planes viven en `DOCS/PLANS/`, agrupados por conjunto de funcionalidades. Consulta el plan aplicable antes de implementar trabajo de producto. Usa la [plantilla de plan](TEMPLATE.md) para crear uno nuevo y asígnale el siguiente número secuencial disponible.

## Estados

- `Propuesto — pendiente de revisión y aprobación humana`: borrador; la implementación no está autorizada.
- `Aprobado`: una persona revisó y aprobó el alcance y el mapa de archivos.
- `En curso`: la implementación aprobada está en marcha; el plan se mantiene actualizado.
- `Implementado — pendiente de revisión humana`: la implementación terminó y espera revisión de una persona.
- `Revisado`: una persona revisó el resultado y el registro final.

Registra en el plan quién aprobó o revisó, la fecha, la decisión y cualquier observación pertinente. Si cambia el alcance o el mapa de archivos, vuelve el estado a `Propuesto — pendiente de revisión y aprobación humana` y solicita aprobación antes de continuar con los cambios afectados.

## Planes

| Plan | Estado | Alcance |
| --- | --- | --- |
| [0001 — Entorno local con Docker Compose para Hugo](0001-compose-desarrollo-hugo.md) | En curso | Servidor Hugo con hot reload, targets Make y lint/fix en contenedor. |
| [0002 — Publicación del sitio Hugo en GitHub Pages](0002-github-pages-hugo.md) | Implementado — pendiente de revisión humana | Compilar y publicar el sitio en GitHub Pages con GitHub Actions. |
