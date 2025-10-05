# Copilot Instructions for map-test-master

## Arquitectura y componentes principales
- Proyecto Angular (CLI v20.3.3) con estructura estándar: `src/app/` contiene la lógica principal.
- El componente principal es `app/`, con un submódulo de mapas en `app/map/mapa/`.
- Los datos geográficos y de hotspots se encuentran en `public/data/` (`spain.geojson`, `hotspots.json`).
- `hotspot-service.ts` gestiona la lógica de acceso a datos de hotspots.

## Flujos de trabajo críticos
- **Desarrollo local:**
  - Iniciar servidor: `ng serve` (http://localhost:4200/)
  - Recarga automática al guardar cambios.
- **Build:**
  - `ng build` genera artefactos en `dist/`.
- **Tests:**
  - Unitarios: `ng test` (Karma)
  - E2E: `ng e2e` (requiere configuración adicional)
- **Scaffolding:**
  - Generar componentes: `ng generate component <nombre>`

## Convenciones y patrones específicos
- **Servicios:**
  - Los servicios Angular (ej: `hotspot-service.ts`) se usan para lógica de negocio y acceso a datos.
- **Modelos:**
  - Definidos en `hotspot.model.ts` para tipado fuerte de datos.
- **Componentes:**
  - Estructura de componentes en subcarpetas (`app/map/mapa/`).
  - Archivos `.ts`, `.html`, `.scss` por componente.
- **Estilos:**
  - SCSS global en `src/styles.scss` y específicos por componente.
- **Datos estáticos:**
  - Acceso a archivos JSON/GeoJSON desde `public/data/`.

## Integraciones y dependencias
- Angular CLI y dependencias estándar Angular.
- No se detectan integraciones externas personalizadas ni configuración avanzada en el README.

## Ejemplos de patrones clave
- Servicio de hotspots: ver `src/app/map/hotspot-service.ts`.
- Modelo de datos: ver `src/app/map/hotspot.model.ts`.
- Componente de mapa: ver `src/app/map/mapa/mapa.ts` y asociados.

## Recomendaciones para agentes AI
- Priorizar el uso de servicios para lógica de negocio y acceso a datos.
- Mantener la estructura de carpetas y archivos por componente.
- Usar modelos TypeScript para tipado de datos.
- Seguir los flujos de build/test descritos arriba.
- Consultar el README para comandos CLI y recursos adicionales.
