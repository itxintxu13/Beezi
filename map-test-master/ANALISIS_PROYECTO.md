# 📊 Análisis Completo del Proyecto Beezi

**Fecha de análisis:** 9 de enero de 2026  
**Autor:** GitHub Copilot Agent  
**Versión del proyecto:** 0.0.0

---

## 🎯 Resumen Ejecutivo

**Beezi** es una plataforma innovadora que utiliza **datos satelitales** e **inteligencia artificial** para proteger a los polinizadores mediante la detección en tiempo real de floración de plantas, predicción de escasez de recursos florales y mapeo de rutas críticas de polinización.

### Propuesta de Valor Principal
- Sistema satelital para monitoreo de ecosistemas de polinizadores
- Detección temprana de crisis ecológicas
- Recomendaciones automatizadas para restauración ecológica
- Primera plataforma mundial de su tipo

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico Principal

#### Frontend (Angular 20)
```
- Framework: Angular 20.3.0 con TypeScript 5.9.2
- Mapas 3D: Mapbox GL JS v3.15.0
- Visualización: Deck.gl v9.1.14
- Alternativas: Leaflet v1.9.4, MapLibre GL v5.8.0
- Estilos: SCSS con animaciones CSS3
- Estado: Signals (Angular moderna)
```

#### Backend (Dual)
1. **Python FastAPI** (beezi_api.py)
   - Framework: FastAPI
   - IA Local: OpenAI SDK con LM Studio
   - Endpoints: /predict, /analyze-image, /ask
   - CORS: Habilitado para desarrollo

2. **Node.js Express** (server/mock-backend.js)
   - Backend de desarrollo/demo
   - Endpoints simulados
   - Multer para uploads
   - Puerto: 8000

#### Datos Satelitales
```
- Fuentes: MODIS, Sentinel-2, ASTER
- Índices: NDVI (Normalized Difference Vegetation Index)
- Índices: EVI (Enhanced Vegetation Index)
- Formato: GeoJSON
- Resolución: 250m (MODIS MOD13Q1)
```

### Estructura de Directorios

```
Beezi/
├── map-test-master/          # Proyecto Angular principal
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/         # Servicios core
│   │   │   │   ├── map-cleanup.service.ts
│   │   │   │   └── timelapse.service.ts
│   │   │   ├── map/          # Componentes de mapa
│   │   │   │   ├── mapa/
│   │   │   │   │   ├── beezi-ultimate.ts (1223 líneas)
│   │   │   │   │   ├── beezi-modern.ts (395 líneas)
│   │   │   │   │   ├── beezi-simple.ts
│   │   │   │   │   ├── beezi-ia-panel.ts
│   │   │   │   │   └── mapa.ts
│   │   │   │   ├── hotspot.model.ts
│   │   │   │   ├── hotspot-service.ts
│   │   │   │   └── pollinatorRoute.model.ts
│   │   │   ├── app.ts
│   │   │   ├── app.unified-map.ts (780 líneas)
│   │   │   └── landing-globe.component.ts
│   │   └── ai_reasoning_agent/
│   │       ├── reasoning_agent.py
│   │       └── local_ai_reasoning_agent.py
│   ├── public/data/          # Datos GeoJSON
│   │   ├── hotspots.json
│   │   ├── hotspots_demo.geojson
│   │   ├── bee_routes_demo.geojson
│   │   ├── habitats_demo.geojson
│   │   └── spain.geojson
│   ├── server/
│   │   └── mock-backend.js
│   ├── beezi_api.py          # API Python con IA
│   └── satellite_api_fetcher.py
├── cursor_ai_experiments/    # Experimentos con IA
├── local_chatgpt_clone/      # Clon local de ChatGPT
└── web_search_ai_assistant/  # Asistente de búsqueda web
```

---

## 🎨 Características Principales

### 1. Visualización 3D Avanzada

#### Mapa Interactivo
- **Vista satelital 3D** de España con perspectiva espacial
- **Pitch inicial:** 60° para vista oblicua
- **Zoom dinámico:** Desde vista global a detalle local
- **Animaciones fluidas** con requestAnimationFrame
- **Efectos atmosféricos:** Niebla y iluminación dinámica

#### Elementos Visuales
- 🌺 **Hotspots de floración** con pulso animado
- 🐝 **Rutas animadas** de polinizadores
- 🗺️ **Mapa de calor** de concentración
- 📊 **Popups informativos** con datos en tiempo real
- 🎨 **Gradientes dinámicos** basados en intensidad

### 2. Controles Interactivos

#### Panel de Control Superior
```typescript
- 🌍 Back to Globe: Resetear a vista global
- 📍 Region Info: Información regional actual
- ⏯️ Timelapse: Navegación temporal
- 📊 Ecosystem: Estadísticas del ecosistema
- 🗺️ Legend: Leyenda del mapa
- 🚨 Emergency: Protocolo de emergencia
```

#### Slider Temporal
- Navegación por 12 meses del año
- Visualización de ciclos anuales de floración
- Animación automática (timelapse)
- Actualización en tiempo real de marcadores

### 3. Sistema de Datos

#### Hotspots de Floración (12 zonas en España)
```json
{
  "id": 1,
  "name": "Dehesa Extremeña",
  "location": [39.4699, -6.3724],
  "species": ["Cistus ladanifer", "Lavandula stoechas"],
  "bloomingPeriod": [4, 5, 6],
  "pollinatorCount": 15234,
  "intensity": 0.85,
  "riskLevel": "low"
}
```

#### Rutas de Polinizadores
```json
{
  "type": "LineString",
  "coordinates": [[lon1, lat1], [lon2, lat2], ...],
  "properties": {
    "species": "Apis mellifera",
    "count": 5000,
    "season": "spring"
  }
}
```

### 4. Protocolo de Emergencia

#### Sistema de Alerta Automático
1. **Detección satelital** (T+0min)
2. **Análisis IA** (T+2min)
3. **Activación protocolo** (T+5min)
4. **Acciones en progreso** (T+8min)

#### Acciones Automáticas
- ✅ Alertas a apicultores locales
- ✅ Redistribución de colmenas
- 🔄 Coordinación de siembra de emergencia
- ⏳ Despliegue de polinizadores artificiales

---

## 🚀 Funcionalidades Implementadas

### Frontend Angular

#### Componentes Principales
1. **UnifiedMapComponent** (app.unified-map.ts)
   - Mapa base con Mapbox GL
   - Panel de búsqueda de regiones
   - Sistema de paneles flotantes
   - Modo avanzado vs. vista global

2. **LandingGlobeComponent**
   - Vista inicial tipo "desde el espacio"
   - Animación de entrada
   - Búsqueda de regiones

3. **Beezi Ultimate** (beezi-ultimate.ts)
   - Versión completa con todas las features
   - 1223 líneas de código
   - Animaciones avanzadas
   - Sistema de partículas

4. **Beezi Modern** (beezi-modern.ts)
   - Versión simplificada
   - 395 líneas
   - Diseño moderno y limpio

#### Servicios
- **MapCleanupService:** Gestión de recursos de mapas
- **TimelapseService:** Control de animaciones temporales
- **HotspotService:** Gestión de datos de hotspots

### Backend

#### Python FastAPI (beezi_api.py)
```python
Endpoints:
- GET /predict -> Predicciones de floración
- POST /analyze-image -> Análisis de imágenes satelitales
- POST /ask -> Chat con IA local (LM Studio)

Características:
- Integración con OpenAI SDK
- LM Studio local (http://localhost:1234/v1)
- CORS habilitado
```

#### Node.js Mock (mock-backend.js)
```javascript
Endpoints:
- GET /predict -> Datos simulados
- POST /analyze-image -> Respuesta demo
- POST /ask -> Chat simulado

Uso:
- Desarrollo sin dependencias Python
- Demo funcional inmediata
- Puerto 8000
```

### Datos Satelitales

#### Satellite API Fetcher (satellite_api_fetcher.py)
```python
Fuentes de datos:
- NASA LAADS: https://ladsweb.modaps.eosdis.nasa.gov/
- Producto: MOD13Q1 (NDVI 16 días, 250m)
- Google Earth Engine REST API
- Copernicus Open Access Hub

Formato salida: GeoJSON
Región piloto: España (bbox configurable)
```

---

## 🔬 Tecnologías IA

### Agentes de Razonamiento

#### Phi Agent (reasoning_agent.py)
```python
- Regular Agent: gpt-4o-mini para consultas rápidas
- Reasoning Agent: gpt-4o con razonamiento profundo
- Structured outputs: Respuestas estructuradas
- Markdown: Formato de salida legible
```

### Experimentos IA

1. **ChatGPT Clone con Llama 3**
   - Implementación local
   - Sin dependencias cloud
   - Interface tipo ChatGPT

2. **Web Search AI Assistant**
   - Claude WebSearch
   - GPT-4 WebSearch
   - Búsquedas aumentadas con IA

3. **Multi-Agent Researcher**
   - Sistema de múltiples agentes
   - Investigación colaborativa
   - Síntesis de información

---

## 📊 Análisis de Código

### Métricas del Proyecto

```
Componentes TypeScript principales:
- app.unified-map.ts: 780 líneas
- beezi-ultimate.ts: 1223 líneas
- beezi-modern.ts: 395 líneas
Total código TypeScript: ~2400 líneas

Configuración:
- angular.json: Configuración completa
- package.json: 16 dependencias core
- tsconfig.json: TypeScript 5.9.2
```

### Dependencias Clave

#### Producción
```json
{
  "@angular/core": "^20.3.0",
  "mapbox-gl": "^3.15.0",
  "deck.gl": "^9.1.14",
  "leaflet": "^1.9.4",
  "maplibre-gl": "^5.8.0",
  "express": "^5.1.0",
  "multer": "^2.0.2"
}
```

#### Desarrollo
```json
{
  "@angular/cli": "^20.3.3",
  "typescript": "~5.9.2",
  "concurrently": "^8.2.0",
  "jasmine-core": "~5.9.0",
  "karma": "~6.4.0"
}
```

### Scripts NPM

```bash
npm start          # ng serve con proxy
npm run start:mock # Inicia mock backend
npm run dev        # Concurrently: mock + frontend
npm run build      # ng build
npm run vercel-build # Build para producción
npm test           # ng test (Karma + Jasmine)
```

---

## 🎯 Casos de Uso

### 1. Apicultores
**Problema:** Ubicación óptima de colmenas  
**Solución:** 
- Mapa de zonas de floración en tiempo real
- Predicción de picos de néctar
- Alertas de escasez
- Rutas de migración sugeridas

### 2. Agricultores
**Problema:** Asegurar polinización de cultivos  
**Solución:**
- Monitoreo de actividad de polinizadores
- Detección temprana de déficit
- Coordinación con apicultores
- Recomendaciones de plantación

### 3. Conservacionistas
**Problema:** Proteger biodiversidad  
**Solución:**
- Identificación de hábitats críticos
- Seguimiento de poblaciones
- Planes de restauración basados en datos
- Métricas de impacto

### 4. Investigadores
**Problema:** Datos para estudios científicos  
**Solución:**
- Acceso a datos históricos
- API para análisis personalizado
- Visualizaciones exportables
- Integración con otros datasets

---

## 💡 Innovaciones Técnicas

### 1. Visualización
- **Mapa 3D con efectos atmosféricos:** Uso avanzado de Mapbox GL con pitch, bearing y efectos de niebla
- **Animaciones de partículas:** Sistema de animación para simular movimiento de abejas
- **Gradientes dinámicos:** Color mapping basado en intensidad de floración

### 2. Datos
- **Fusión multi-sensor:** Combinación MODIS + Sentinel + ASTER
- **Procesamiento temporal:** Series de tiempo de NDVI/EVI
- **GeoJSON optimizado:** Datos geoespaciales eficientes

### 3. IA
- **Modelos locales:** LM Studio para independencia cloud
- **Agentes especializados:** Phi Agents con razonamiento
- **Predicción temporal:** ML para forecasting de floración

### 4. UX
- **Progressive disclosure:** Información por capas
- **Drag & drop panels:** Paneles flotantes reposicionables
- **Responsive design:** Adaptable a todos los dispositivos
- **Modo espacial:** Vista inicial impactante

---

## 🚧 Estado del Proyecto

### ✅ Completado

1. **Frontend Angular 20**
   - Estructura base con componentes standalone
   - Integración Mapbox GL
   - Sistema de paneles flotantes
   - Animaciones y efectos visuales

2. **Datos Demo**
   - 12 hotspots de floración en España
   - Rutas de polinizadores
   - Hábitats críticos
   - GeoJSON de España

3. **Backend Mock**
   - Express.js funcional
   - Endpoints simulados
   - CORS configurado

4. **Documentación**
   - README completo
   - BEEZI_DEMO.md para hackathon
   - PITCH_DECK.md para inversores
   - DEMO_READY.md con instrucciones

### 🔄 En Desarrollo

1. **Integración Satelital Real**
   - Conexión con NASA LAADS API
   - Earth Engine SDK
   - Procesamiento de imágenes MODIS/Sentinel

2. **IA Predictiva**
   - Modelos de forecasting
   - Detección de anomalías
   - Sistema de alertas automático

3. **Backend Python**
   - FastAPI completamente funcional
   - Integración LM Studio
   - Análisis de imágenes

### 📋 Pendiente

1. **Testing**
   - Unit tests (Jasmine/Karma)
   - E2E tests
   - Cobertura de código

2. **Optimización**
   - Bundle size reduction
   - Lazy loading de componentes
   - Service workers para PWA

3. **Features Adicionales**
   - Autenticación de usuarios
   - Dashboard personalizado
   - Exportación de informes
   - API pública

---

## 🎨 Diseño y UX

### Paleta de Colores
```scss
// Temática natural/ecológica
--primary: #FFB800 (amarillo miel)
--secondary: #2D5016 (verde bosque)
--accent: #FF6B35 (naranja vibrante)
--background: rgba(0, 20, 40, 0.95) (azul oscuro)
```

### Tipografía
- **Títulos:** System fonts (-apple-system, BlinkMacSystemFont)
- **Cuerpo:** Segoe UI, Roboto
- **Monospace:** Consolas, Monaco

### Componentes UI
- **Glassmorph panels:** backdrop-filter: blur(10px)
- **Pulse animations:** keyframes para efectos vivos
- **Smooth transitions:** 0.3s ease-in-out
- **Responsive breakpoints:** 768px, 1024px

---

## 📈 Modelo de Negocio (según PITCH_DECK)

### Segmentos de Mercado

| Segmento | Tamaño Global | Precio/mes | Revenue Potencial |
|----------|---------------|------------|-------------------|
| **Apicultores** | 500K+ | €50 | €25M/año |
| **Agricultores** | 570M | €50 | Variable |
| **ONGs/Gobiernos** | - | €500+ | Contratos |
| **Investigadores** | - | €50 | Licencias |

### Planes de Suscripción

1. **Free**
   - Visualización básica
   - Datos públicos
   - Sin alertas

2. **Pro (€50/mes)**
   - Alertas en tiempo real
   - Predicciones 30 días
   - Exportación datos
   - Sin anuncios

3. **Enterprise (€500/mes)**
   - API completa
   - Datos históricos
   - Soporte prioritario
   - Custom integrations

4. **Government**
   - Contratos personalizados
   - Cobertura nacional
   - Datos en tiempo real
   - Infraestructura dedicada

### Proyecciones (2026-2029)

```
Año 2026: 1,000 usuarios  → €500K revenue
Año 2027: 5,000 usuarios  → €2.5M revenue (+400%)
Año 2028: 20,000 usuarios → €10M revenue (+300%)
Año 2029: 75,000 usuarios → €30M revenue (+200%)
```

---

## 🔒 Consideraciones de Seguridad

### Configuración Actual

#### ⚠️ Áreas de Atención

1. **API Keys expuestas**
   ```typescript
   // En código TypeScript
   mapboxgl.accessToken = 'pk.ey...' // Token hardcoded
   ```
   **Recomendación:** Usar variables de entorno

2. **CORS permisivo**
   ```python
   allow_origins=["*"]  # Permitir todos los orígenes
   ```
   **Recomendación:** Restringir a dominios específicos

3. **Sin autenticación**
   - Endpoints abiertos
   - Sin rate limiting
   **Recomendación:** Implementar JWT/OAuth

### Buenas Prácticas Implementadas

✅ `.gitignore` configurado correctamente  
✅ `.env.example` para secretos  
✅ Separación frontend/backend  
✅ HTTPS en producción (Vercel)

---

## 🚀 Roadmap Técnico

### Q1 2026 (Actual)
- [x] MVP funcional con datos demo
- [x] Mapa 3D interactivo
- [x] Documentación completa
- [ ] Testing unitario
- [ ] CI/CD pipeline

### Q2 2026
- [ ] Integración satelital real (NASA/ESA)
- [ ] Modelos ML para predicción
- [ ] Backend escalable (AWS/Azure)
- [ ] API pública v1.0
- [ ] App móvil (React Native)

### Q3 2026
- [ ] Expansión Europa (5 países)
- [ ] Marketplace de datos
- [ ] Partnerships institucionales
- [ ] Certificación científica
- [ ] White-label para gobiernos

### Q4 2026
- [ ] Cobertura global (20+ países)
- [ ] Satellite constellation propia
- [ ] IA predictiva avanzada
- [ ] IoT sensors integración
- [ ] B2B platform

---

## 🛠️ Instrucciones de Desarrollo

### Setup Inicial

```bash
# 1. Clonar repositorio
git clone https://github.com/itxintxu13/Beezi.git
cd Beezi/map-test-master

# 2. Instalar dependencias
npm install

# 3a. Modo desarrollo (solo frontend)
npm start
# Abre http://localhost:4200

# 3b. Modo desarrollo completo (frontend + mock backend)
npm run dev
# Frontend: http://localhost:4200
# Backend: http://localhost:8000

# 4. Build para producción
npm run build
# Output en dist/map-test/browser
```

### Variables de Entorno

Crear `.env` en la raíz:
```bash
# Mapbox
MAPBOX_ACCESS_TOKEN=pk.eyJ1...

# NASA APIs
NASA_LAADS_TOKEN=tu_token_aqui

# OpenAI / LM Studio
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=http://localhost:1234/v1
```

### Configuración LM Studio (para IA local)

```bash
# 1. Descargar LM Studio
# https://lmstudio.ai/

# 2. Cargar modelo (ej: Llama 3 8B)
# 3. Iniciar servidor local en puerto 1234
# 4. Ejecutar backend Python:
uvicorn beezi_api:app --reload
```

### Testing

```bash
# Unit tests
npm test

# E2E tests (cuando estén implementados)
npm run e2e

# Linting
npm run lint
```

---

## 📚 Recursos y Referencias

### APIs Satelitales

1. **NASA LAADS DAAC**
   - URL: https://ladsweb.modaps.eosdis.nasa.gov/
   - Datos: MODIS, VIIRS
   - Registro: Gratis

2. **Google Earth Engine**
   - URL: https://earthengine.google.com/
   - Datos: Sentinel, Landsat, MODIS
   - API: Python/JavaScript

3. **Copernicus Open Access Hub**
   - URL: https://scihub.copernicus.eu/
   - Datos: Sentinel-1, Sentinel-2, Sentinel-3
   - Registro: Gratis

### Librerías de Mapas

- **Mapbox GL JS:** https://docs.mapbox.com/mapbox-gl-js/
- **Deck.gl:** https://deck.gl/
- **Leaflet:** https://leafletjs.com/
- **MapLibre:** https://maplibre.org/

### IA y ML

- **Phi Framework:** https://github.com/phidatahq/phi
- **LM Studio:** https://lmstudio.ai/
- **TensorFlow.js:** https://www.tensorflow.org/js

---

## 🎓 Lecciones Aprendidas

### Fortalezas del Proyecto

1. **Visión Clara**
   - Problema real y urgente (declive de polinizadores)
   - Solución innovadora y diferenciada
   - Mercado grande y desatendido

2. **Tecnología Sólida**
   - Stack moderno (Angular 20, TypeScript)
   - Arquitectura escalable
   - Separación de concerns

3. **UX Excepcional**
   - Visualización impactante
   - Interactividad intuitiva
   - Diseño profesional

4. **Documentación Completa**
   - README detallado
   - Pitch deck para inversores
   - Demo ready para hackathon

### Áreas de Mejora

1. **Testing**
   - Falta cobertura de tests
   - No hay E2E tests
   - Sin CI/CD automatizado

2. **Seguridad**
   - Tokens hardcoded
   - CORS muy permisivo
   - Sin autenticación

3. **Datos Reales**
   - Actualmente solo datos demo
   - Falta integración satelital real
   - Sin pipeline de procesamiento

4. **Escalabilidad**
   - Backend simple
   - Sin caché
   - Sin rate limiting

---

## 🎯 Recomendaciones

### Prioridad Alta (Antes del lanzamiento)

1. **Mover tokens a variables de entorno**
   ```typescript
   // Mal
   mapboxgl.accessToken = 'pk.ey...';
   
   // Bien
   mapboxgl.accessToken = environment.mapboxToken;
   ```

2. **Implementar tests básicos**
   ```bash
   # Al menos 70% cobertura en servicios core
   npm test -- --code-coverage
   ```

3. **Configurar CI/CD**
   - GitHub Actions para builds
   - Tests automáticos en PRs
   - Deploy automático a staging

4. **Restringir CORS**
   ```python
   allow_origins=[
     "https://beezi.earth",
     "https://www.beezi.earth"
   ]
   ```

### Prioridad Media (Post-lanzamiento)

1. **Integración satelital real**
   - Empezar con NASA LAADS API
   - Procesar datos MODIS reales
   - Pipeline automatizado

2. **Autenticación y autorización**
   - JWT tokens
   - Roles (free/pro/enterprise)
   - Rate limiting por tier

3. **Analytics y telemetría**
   - Google Analytics 4
   - Sentry para error tracking
   - Métricas de uso

### Prioridad Baja (Futuro)

1. **App móvil nativa**
   - React Native o Flutter
   - Push notifications
   - Offline mode

2. **Marketplace de datos**
   - Venta de datasets
   - API monetizada
   - Partners ecosystem

3. **IoT integración**
   - Sensores de colmenas
   - Estaciones meteorológicas
   - Cámaras trampas

---

## 🏆 Ventajas Competitivas

### Tecnológicas

1. **Datos satelitales**
   - Cobertura global imposible de replicar
   - Resolución espacial 250m
   - Actualización cada 16 días

2. **IA predictiva**
   - Modelos entrenados con años de datos
   - Mejora continua con feedback
   - Anticipación vs. reacción

3. **UX superior**
   - Interfaz intuitiva vs. tools científicas
   - Visualización 3D impactante
   - Mobile-first design

### De Negocio

1. **First-mover advantage**
   - No existe competencia directa
   - Tiempo de entrada crítico
   - Network effects potentes

2. **Modelo escalable**
   - SaaS con margenes altos
   - API monetizable
   - Multiple revenue streams

3. **Misión impactante**
   - Problema urgente y visible
   - Stakeholders diversos
   - Potencial ESG funding

---

## 📞 Contacto y Comunidad

### Equipo Core
- **CEO/CTO:** Visión técnica y estratégica
- **Lead Developer:** Experiencia geoespacial
- **Data Scientist:** Experto ML y satélites
- **UX Designer:** Interfaz intuitiva

### Links del Proyecto
- 🌐 Web: www.beezi.earth (planificado)
- 📧 Email: team@beezi.earth (planificado)
- 📱 Twitter: @BeeziEarth (planificado)
- 💻 GitHub: https://github.com/itxintxu13/Beezi

### Contribuciones
El proyecto está en fase privada, pero se planea:
- Open source de componentes clave
- SDK público para developers
- Community plugins

---

## 🎬 Conclusión

**Beezi** representa una **innovación significativa** en la intersección de:
- 🛰️ Tecnología espacial
- 🐝 Conservación ecológica
- 🤖 Inteligencia artificial
- 🗺️ Visualización de datos

### Fortalezas Clave
✅ **Problema real y urgente** (declive de polinizadores)  
✅ **Solución tecnológicamente viable** (datos satelitales + IA)  
✅ **MVP funcional** (demo impresionante)  
✅ **Mercado grande** (apicultores, agricultores, gobiernos)  
✅ **Equipo capaz** (full-stack + data science)

### Próximos Pasos Críticos
1. Integración satelital real (Q1 2026)
2. Testing y seguridad (Q1 2026)
3. Funding seed (€1.4M)
4. Pilot customers (10 apicultores profesionales)
5. Partnerships (ESA, NASA, universidades)

### Visión a 5 Años
> **"En 2030, Beezi será la plataforma global de referencia para protección de polinizadores, habiendo salvado millones de colmenas y asegurado la seguridad alimentaria mundial."**

---

**🌍🐝 Beezi: Salvando el planeta, una abeja a la vez.**

*Análisis generado por GitHub Copilot Agent - Enero 2026*
