# 🏗️ Arquitectura Técnica - Beezi

## 📋 Índice
1. [Diagrama de Arquitectura](#diagrama-de-arquitectura)
2. [Flujo de Datos](#flujo-de-datos)
3. [Componentes del Sistema](#componentes-del-sistema)
4. [Integraciones Externas](#integraciones-externas)
5. [Seguridad](#seguridad)
6. [Escalabilidad](#escalabilidad)

---

## 🎨 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIO FINAL                            │
│                    (Navegador Web / Mobile)                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Angular 20)                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   App Root   │  │  Unified Map │  │ Landing Globe│          │
│  │   Component  │  │  Component   │  │  Component   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Beezi      │  │   Beezi      │  │   Beezi      │          │
│  │   Ultimate   │  │   Modern     │  │   Simple     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐        │
│  │              SERVICIOS CORE                          │        │
│  │  • MapCleanupService                                 │        │
│  │  • TimelapseService                                  │        │
│  │  • HotspotService                                    │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐        │
│  │           LIBRERÍAS DE VISUALIZACIÓN                 │        │
│  │  • Mapbox GL JS (Mapa 3D)                           │        │
│  │  • Deck.gl (Capas avanzadas)                        │        │
│  │  • Leaflet (Alternativa)                            │        │
│  │  • MapLibre GL (Open source)                        │        │
│  └─────────────────────────────────────────────────────┘        │
└────────────────┬────────────────────────────────┬───────────────┘
                 │                                │
                 │ REST API                       │ WebSocket
                 ▼                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
├──────────────────────────┬──────────────────────────────────────┤
│   Python FastAPI         │      Node.js Express                 │
│   (Producción)           │      (Mock/Dev)                      │
├──────────────────────────┼──────────────────────────────────────┤
│                          │                                      │
│  Endpoints:              │  Endpoints:                          │
│  • GET /predict          │  • GET /predict                      │
│  • POST /analyze-image   │  • POST /analyze-image               │
│  • POST /ask             │  • POST /ask                         │
│                          │                                      │
│  Servicios:              │  Middleware:                         │
│  • Satellite Fetcher     │  • CORS                              │
│  • AI Reasoning Agent    │  • Multer (uploads)                  │
│  • ML Prediction         │  • Express JSON                      │
│                          │                                      │
└──────────────┬───────────┴──────────────────────────────────────┘
               │
               │
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CAPA DE DATOS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │  GeoJSON Files   │  │  JSON Configs    │                    │
│  │  • hotspots      │  │  • settings      │                    │
│  │  • routes        │  │  • metadata      │                    │
│  │  • habitats      │  │                  │                    │
│  └──────────────────┘  └──────────────────┘                    │
│                                                                  │
└──────────────┬──────────────────────────────────────────────────┘
               │
               │
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                  INTEGRACIONES EXTERNAS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  NASA LAADS  │  │   Sentinel   │  │  Earth Eng.  │          │
│  │  (MODIS)     │  │  (Copernicus)│  │   (Google)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  LM Studio   │  │   OpenAI     │  │   Mapbox     │          │
│  │  (Local IA)  │  │   (Cloud IA) │  │   (Tiles)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos

### 1. Carga Inicial de la Aplicación

```
┌──────────┐
│ Usuario  │
│ accede   │
│ a la app │
└────┬─────┘
     │
     ▼
┌─────────────────────┐
│  Landing Page       │
│  (Globe View)       │
│  • Splash screen    │
│  • Animación 🐝     │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  Cargar Mapa Base   │
│  • Mapbox GL init   │
│  • Style: satellite │
│  • Pitch: 60°       │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  Fetch GeoJSON      │
│  • hotspots.json    │
│  • routes.geojson   │
│  • habitats.geojson │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  Renderizar Capas   │
│  • Hotspots (🌺)    │
│  • Routes (🐝)      │
│  • Heatmap          │
└─────────────────────┘
```

### 2. Búsqueda de Región

```
Usuario escribe "Madrid"
         │
         ▼
Autocomplete local (países/regiones hardcoded)
         │
         ▼
Click en "Explore" / Enter
         │
         ▼
┌─────────────────────┐
│ flyTo() animation   │
│ • Zoom: 6 → 10      │
│ • Duration: 2s      │
│ • Easing: easeInOut │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ Activar Modo        │
│ Avanzado            │
│ • Mostrar controles │
│ • Cargar hotspots   │
│ • Activar timeline  │
└─────────────────────┘
```

### 3. Predicción de Floración

```
Usuario hace click en hotspot
         │
         ▼
┌─────────────────────┐
│ Mostrar popup con   │
│ info básica         │
│ • Nombre            │
│ • Especies          │
│ • Período floración │
└────┬────────────────┘
     │
     ▼
Click en "Predict"
     │
     ▼
┌─────────────────────┐
│ HTTP GET /predict   │
│ Backend (FastAPI)   │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ AI Processing       │
│ • Modelos ML        │
│ • Datos históricos  │
│ • Clima actual      │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ Response JSON       │
│ {                   │
│   predictions: [    │
│     "Pico en 12d",  │
│     "Riesgo alto"   │
│   ]                 │
│ }                   │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ Actualizar UI       │
│ • Panel lateral     │
│ • Gráficos          │
│ • Alertas           │
└─────────────────────┘
```

### 4. Análisis de Imagen Satelital

```
Usuario sube imagen .tif
         │
         ▼
┌─────────────────────┐
│ POST /analyze-image │
│ • FormData          │
│ • file: blob        │
│ • task: "detect"    │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ Backend recibe      │
│ • Multer guarda tmp │
│ • Valida formato    │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ Procesamiento       │
│ • NDVI calculation  │
│ • Object detection  │
│ • Segmentation      │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ Response            │
│ {                   │
│   ndvi: 0.75,       │
│   blooming: true,   │
│   coverage: 0.85    │
│ }                   │
└────┬────────────────┘
     │
     ▼
Mostrar overlay en mapa
```

### 5. Chat con IA

```
Usuario escribe pregunta
"¿Cuándo florecerá la lavanda?"
         │
         ▼
┌─────────────────────┐
│ POST /ask           │
│ {                   │
│   question: "..."   │
│ }                   │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ LM Studio local     │
│ • Model: Llama 3    │
│ • Context: Beezi    │
│ • Temperature: 0.7  │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ Reasoning Agent     │
│ • Phi framework     │
│ • Structured output │
│ • Citations         │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ Response streaming  │
│ (WebSocket/SSE)     │
│ • Chunk by chunk    │
│ • Markdown format   │
└────┬────────────────┘
     │
     ▼
Renderizar en panel chat
```

---

## 🧩 Componentes del Sistema

### Frontend (Angular)

#### 1. App Root Component
```typescript
// app.ts
@Component({
  selector: 'app-root',
  imports: [UnifiedMapComponent]
})
export class App {
  title = 'map-test';
}
```
**Responsabilidad:** Entry point, bootstrapping

#### 2. Unified Map Component
```typescript
// app.unified-map.ts (780 líneas)
@Component({
  selector: 'app-unified-map',
  standalone: true
})
export class UnifiedMapComponent {
  // Estados
  advancedMode = false;
  panels = { ecosystem: false, legend: false };
  
  // Mapa
  map: mapboxgl.Map;
  
  // Métodos clave
  ngAfterViewInit() { /* Inicializar mapa */ }
  flyToQuery() { /* Búsqueda región */ }
  toggleTimelapseMode() { /* Animación temporal */ }
  showEmergencyProtocol() { /* Alertas */ }
}
```
**Responsabilidad:** 
- Renderizado del mapa
- Gestión de estado global
- Coordinación de paneles

#### 3. Beezi Ultimate
```typescript
// map/mapa/beezi-ultimate.ts (1223 líneas)
@Component({
  selector: 'app-beezi-ultimate',
  standalone: true
})
export class BeeziUltimate {
  // Datos
  hotspots: BloomingHotspot[];
  routes: PollinatorRoute[];
  
  // Animaciones
  animationFrame: number;
  timeProgress = 0;
  
  // Métodos clave
  initializeMap() { /* Setup Mapbox */ }
  addHotspotMarkers() { /* Render markers */ }
  animateRoutes() { /* Animate bees */ }
  updateHeatmap() { /* Update intensity */ }
}
```
**Responsabilidad:**
- Versión completa con todas las features
- Animaciones avanzadas
- Sistema de partículas
- Efectos visuales

#### 4. Servicios Core

**MapCleanupService**
```typescript
@Injectable({ providedIn: 'root' })
export class MapCleanupService {
  cleanup(map: mapboxgl.Map) {
    // Limpiar listeners
    // Liberar recursos
    // Prevent memory leaks
  }
}
```

**TimelapseService**
```typescript
@Injectable({ providedIn: 'root' })
export class TimelapseService {
  private animationFrame: number;
  
  start(callback: (month: number) => void) {
    // Animar por 12 meses
  }
  
  stop() {
    cancelAnimationFrame(this.animationFrame);
  }
}
```

**HotspotService**
```typescript
@Injectable({ providedIn: 'root' })
export class HotspotService {
  getHotspots(): Observable<BloomingHotspot[]> {
    return this.http.get<BloomingHotspot[]>('/data/hotspots.json');
  }
  
  getHotspotsForMonth(month: number): BloomingHotspot[] {
    return this.hotspots.filter(h => 
      h.bloomingPeriod.includes(month)
    );
  }
}
```

### Backend (Python)

#### FastAPI App
```python
# beezi_api.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

app = FastAPI()

# Cliente IA local (LM Studio)
client = OpenAI(
    base_url="http://localhost:1234/v1",
    api_key="lm-studio"
)

@app.get("/predict")
def predict():
    # Lógica de predicción ML
    return {"predictions": [...]}

@app.post("/analyze-image")
async def analyze_image(file: UploadFile):
    # Procesamiento imagen satelital
    # NDVI calculation
    # Object detection
    return {"result": {...}}

@app.post("/ask")
async def ask_ia(req: AskRequest):
    # Chat con modelo local
    messages = [{"role": "user", "content": req.question}]
    response = client.chat.completions.create(
        model="local-model",
        messages=messages
    )
    return {"answer": response.choices[0].message.content}
```

### Backend (Node.js)

#### Express Mock
```javascript
// server/mock-backend.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/predict', (req, res) => {
  res.json({
    predictions: [
      'Pico de floración en Andalucía en 12 días',
      'Riesgo de escasez en Castilla-La Mancha'
    ]
  });
});

app.listen(8000, () => {
  console.log('Mock backend en http://localhost:8000');
});
```

---

## 🔌 Integraciones Externas

### 1. NASA LAADS DAAC

**Propósito:** Datos MODIS (NDVI/EVI)

```python
# satellite_api_fetcher.py
NASA_LAADS_URL = "https://ladsweb.modaps.eosdis.nasa.gov/api/v1"
PRODUCT = "MOD13Q1"  # NDVI 16 días, 250m

def fetch_modis_ndvi(bbox, start_date, end_date, token):
    # Llamada API
    # Procesar respuesta
    # Convertir a GeoJSON
    return geojson_data
```

**Configuración:**
- Registro: https://ladsweb.modaps.eosdis.nasa.gov/
- Token: Gratis
- Rate limit: Razonable para desarrollo

### 2. Google Earth Engine

**Propósito:** Sentinel-2, procesamiento avanzado

```python
import ee

ee.Initialize()

# Ejemplo: Sentinel-2 NDVI
def get_sentinel_ndvi(bbox, date_range):
    collection = ee.ImageCollection('COPERNICUS/S2') \
        .filterBounds(bbox) \
        .filterDate(date_range[0], date_range[1])
    
    ndvi = collection.map(lambda img: 
        img.normalizedDifference(['B8', 'B4'])
    )
    
    return ndvi.getInfo()
```

### 3. Mapbox

**Propósito:** Tiles del mapa, geocoding

```typescript
// Frontend
mapboxgl.accessToken = environment.mapboxToken;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/satellite-v9',
  center: [-3.7038, 40.4168],
  zoom: 6,
  pitch: 60
});
```

### 4. LM Studio (Local AI)

**Propósito:** Chat y razonamiento sin cloud

```python
client = OpenAI(
    base_url="http://localhost:1234/v1",
    api_key="lm-studio"
)

response = client.chat.completions.create(
    model="llama-3-8b",
    messages=[{"role": "user", "content": question}]
)
```

---

## 🔒 Seguridad

### Autenticación (Pendiente)

```typescript
// Recomendado: JWT
interface User {
  id: string;
  email: string;
  tier: 'free' | 'pro' | 'enterprise';
}

@Injectable()
export class AuthService {
  login(email: string, password: string): Observable<Token> {
    return this.http.post<Token>('/auth/login', {email, password});
  }
  
  getToken(): string {
    return localStorage.getItem('access_token');
  }
}
```

### Autorización

```python
# Backend
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer

security = HTTPBearer()

def verify_token(credentials = Depends(security)):
    token = credentials.credentials
    # Verificar JWT
    # Decodificar payload
    # Verificar tier
    return user

@app.get("/predict")
def predict(user = Depends(verify_token)):
    if user.tier == 'free':
        raise HTTPException(403, "Upgrade to Pro")
    # ...
```

### Variables de Entorno

```bash
# .env (NO COMMITEAR)
MAPBOX_ACCESS_TOKEN=pk.eyJ1...
NASA_LAADS_TOKEN=abc123...
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://...
JWT_SECRET=supersecret...
```

```typescript
// environment.ts
export const environment = {
  production: false,
  mapboxToken: process.env['MAPBOX_ACCESS_TOKEN'],
  apiUrl: 'http://localhost:8000'
};
```

### CORS Restrictivo

```python
# Producción
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://beezi.earth",
        "https://www.beezi.earth"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"]
)
```

---

## 📈 Escalabilidad

### Frontend

**CDN para Assets**
```
# Vercel automático
Static files → Edge network
GeoJSON → CDN cache
Images → Optimización automática
```

**Code Splitting**
```typescript
// Lazy loading de componentes
const routes: Routes = [
  {
    path: 'map',
    loadComponent: () => import('./map/beezi-ultimate')
  }
];
```

**Service Workers**
```typescript
// Angular PWA
ng add @angular/pwa

// Cachear GeoJSON
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/data/')) {
    event.respondWith(caches.match(event.request));
  }
});
```

### Backend

**Horizontal Scaling**
```
┌────────┐      ┌────────────┐      ┌────────────┐
│  Load  │──────│  FastAPI   │      │  FastAPI   │
│ Balancer│     │  Instance 1│      │  Instance 2│
└────────┘      └────────────┘      └────────────┘
                       │                    │
                       └──────┬─────────────┘
                              │
                      ┌───────▼────────┐
                      │   PostgreSQL   │
                      │   (Primary)    │
                      └────────────────┘
```

**Caching**
```python
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend

@app.on_event("startup")
async def startup():
    redis = aioredis.from_url("redis://localhost")
    FastAPICache.init(RedisBackend(redis), prefix="beezi")

@app.get("/predict")
@cache(expire=3600)  # 1 hora
async def predict():
    # ...
```

**Rate Limiting**
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.get("/predict")
@limiter.limit("10/minute")
async def predict(request: Request):
    # Free tier: 10 requests/min
```

### Base de Datos

**Schema PostgreSQL**
```sql
-- Usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    tier VARCHAR(20),
    created_at TIMESTAMP
);

-- Hotspots (cache)
CREATE TABLE hotspots (
    id SERIAL PRIMARY KEY,
    geom GEOMETRY(Point, 4326),
    properties JSONB,
    month INT,
    INDEX idx_geom USING GIST(geom),
    INDEX idx_month (month)
);

-- Predicciones
CREATE TABLE predictions (
    id UUID PRIMARY KEY,
    hotspot_id INT REFERENCES hotspots(id),
    predicted_bloom_date DATE,
    confidence FLOAT,
    created_at TIMESTAMP
);
```

**PostGIS para queries espaciales**
```sql
-- Hotspots cerca de un punto
SELECT * FROM hotspots
WHERE ST_DWithin(
    geom::geography,
    ST_MakePoint(-3.7, 40.4)::geography,
    50000  -- 50km
);
```

### Monitoreo

**Sentry (Error tracking)**
```typescript
import * as Sentry from "@sentry/angular";

Sentry.init({
  dsn: "https://...",
  environment: "production"
});
```

**Datadog (APM)**
```python
from ddtrace import patch_all
patch_all()

# Auto-instrumentación
# Métricas automáticas
# Traces distribuidos
```

---

## 🚀 Deployment

### Vercel (Frontend)

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/map-test/browser"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### AWS (Backend)

**Opción 1: ECS Fargate**
```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
```

**Opción 2: Lambda + API Gateway**
```python
# Usar Mangum adapter
from mangum import Mangum

handler = Mangum(app)
```

---

## 📊 Métricas y Observabilidad

### KPIs Técnicos

```typescript
// Frontend
- Tiempo carga inicial (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1

// Backend
- Response time p95: < 200ms
- Uptime: > 99.9%
- Error rate: < 0.1%
```

### Logging

```python
import structlog

logger = structlog.get_logger()

@app.get("/predict")
async def predict():
    logger.info("prediction_requested", 
                user_id=user.id, 
                region="spain")
    # ...
    logger.info("prediction_completed", 
                duration_ms=123)
```

---

**Documento generado automáticamente - Enero 2026**
