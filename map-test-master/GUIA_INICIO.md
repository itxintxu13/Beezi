# 🚀 Guía Rápida de Inicio - Beezi

## 📋 Tabla de Contenidos
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Guías de Desarrollo](#guías-de-desarrollo)
- [Troubleshooting](#troubleshooting)

---

## ✅ Requisitos Previos

### Software Necesario

```bash
# Node.js (v18 o superior)
node --version  # v20.19.6 recomendado

# npm (v9 o superior)
npm --version   # v10.8.2 recomendado

# Python (v3.9 o superior) - OPCIONAL para backend
python --version  # v3.11+ recomendado

# Git
git --version
```

### Cuentas y Tokens (Opcional para desarrollo)

1. **Mapbox** (para producción)
   - Crear cuenta: https://account.mapbox.com/
   - Generar token: https://account.mapbox.com/access-tokens/
   - Nota: En desarrollo, el token demo funciona con limitaciones

2. **NASA LAADS** (para datos satelitales reales)
   - Registro: https://ladsweb.modaps.eosdis.nasa.gov/
   - Generar token: https://ladsweb.modaps.eosdis.nasa.gov/profile/

---

## 📥 Instalación

### Paso 1: Clonar el Repositorio

```bash
# Clonar
git clone https://github.com/itxintxu13/Beezi.git

# Entrar al directorio del proyecto
cd Beezi/map-test-master
```

### Paso 2: Instalar Dependencias

```bash
# Instalar dependencias de Node.js
npm install

# Esto instalará:
# - Angular 20 y dependencias
# - Mapbox GL JS
# - Deck.gl
# - Express (para mock backend)
# - Y todas las devDependencies
```

**Tiempo estimado:** 2-5 minutos dependiendo de tu conexión

### Paso 3: Configurar Variables de Entorno (Opcional)

```bash
# Copiar ejemplo de .env
cp .env.example .env

# Editar .env con tu editor favorito
nano .env  # o vim, code, etc.
```

Contenido de `.env`:
```bash
# Mapbox (opcional para desarrollo)
MAPBOX_ACCESS_TOKEN=pk.eyJ1...tu_token_aquí...

# Backend
API_URL=http://localhost:8000

# Para producción
# MAPBOX_ACCESS_TOKEN=pk.eyJ1...tu_token_producción...
```

---

## 🚀 Ejecución

### Opción 1: Solo Frontend (Recomendado para empezar)

```bash
# Iniciar servidor de desarrollo Angular
npm start

# Espera el mensaje:
# ✔ Browser application bundle generation complete.
# ✔ Built at: 2026-01-09...
```

**Abrir navegador:** http://localhost:4200

**Características disponibles:**
- ✅ Mapa 3D interactivo
- ✅ Visualización de hotspots
- ✅ Búsqueda de regiones
- ✅ Animaciones y efectos
- ❌ Predicciones AI (requiere backend)

### Opción 2: Frontend + Mock Backend (Demo completo)

```bash
# Terminal 1: Iniciar mock backend
npm run start:mock

# Terminal 2: Iniciar frontend
npm start

# O en una sola terminal:
npm run dev  # Usa concurrently
```

**Características adicionales:**
- ✅ Todas las del frontend
- ✅ Predicciones simuladas
- ✅ Chat AI simulado
- ✅ Análisis de imágenes (mock)

### Opción 3: Frontend + Backend Python (IA Real)

**Paso 1: Instalar dependencias Python**
```bash
# Crear entorno virtual (recomendado)
python -m venv venv

# Activar
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate     # Windows

# Instalar dependencias
pip install -r requirements-beezi.txt
```

**Paso 2: Configurar LM Studio (para IA local)**
```bash
# 1. Descargar LM Studio
# https://lmstudio.ai/

# 2. Instalar y abrir
# 3. Descargar modelo (ej: Llama 3 8B)
# 4. Iniciar servidor local → Server → Start Server
# 5. Verificar: http://localhost:1234/v1/models
```

**Paso 3: Ejecutar backend**
```bash
# Terminal 1: Backend Python
uvicorn beezi_api:app --reload

# Terminal 2: Frontend
npm start
```

**Características completas:**
- ✅ Todas las anteriores
- ✅ IA real con Llama 3
- ✅ Razonamiento avanzado
- ✅ Chat contextual

---

## 📁 Estructura del Proyecto

### Archivos Clave

```
map-test-master/
├── src/                          # Código fuente Angular
│   ├── app/
│   │   ├── app.ts                # Componente raíz
│   │   ├── app.unified-map.ts    # Mapa principal (780 líneas)
│   │   ├── map/
│   │   │   ├── mapa/
│   │   │   │   ├── beezi-ultimate.ts  # Versión completa (1223 líneas)
│   │   │   │   ├── beezi-modern.ts    # Versión moderna (395 líneas)
│   │   │   │   └── beezi-simple.ts    # Versión simple
│   │   │   ├── hotspot.model.ts       # Modelo de datos
│   │   │   └── hotspot-service.ts     # Servicio de datos
│   │   └── core/
│   │       ├── map-cleanup.service.ts
│   │       └── timelapse.service.ts
│   ├── index.html                # HTML principal
│   └── styles.scss               # Estilos globales
├── public/
│   └── data/                     # Datos GeoJSON
│       ├── hotspots.json         # 12 hotspots España
│       ├── bee_routes_demo.geojson
│       └── spain.geojson
├── server/
│   └── mock-backend.js           # Backend Node.js simulado
├── beezi_api.py                  # Backend Python con IA
├── satellite_api_fetcher.py      # Fetcher de datos satelitales
├── package.json                  # Dependencias Node.js
├── angular.json                  # Configuración Angular
└── README.md                     # Documentación principal
```

### Componentes Principales

1. **UnifiedMapComponent** → Orquestador principal
2. **BeeziUltimate** → Versión con todas las features
3. **BeeziModern** → Versión simplificada
4. **LandingGlobe** → Vista inicial tipo espacial

---

## 🎨 Guías de Desarrollo

### Añadir un Nuevo Hotspot

```typescript
// public/data/hotspots.json
{
  "id": 13,  // Incrementar ID
  "name": "Nombre del Lugar",
  "location": [longitude, latitude],  // ej: [-3.7, 40.4]
  "species": ["Especie 1", "Especie 2"],
  "bloomingPeriod": [4, 5, 6],  // Meses (1-12)
  "pollinatorCount": 10000,
  "intensity": 0.75,  // 0.0-1.0
  "riskLevel": "medium"  // low, medium, high
}
```

### Personalizar Estilos del Mapa

```typescript
// src/app/app.unified-map.ts

ngAfterViewInit() {
  this.map = new mapboxgl.Map({
    container: this.mapContainer.nativeElement,
    style: 'mapbox://styles/mapbox/satellite-v9',  // Cambiar estilo
    center: [-3.7038, 40.4168],  // Centro España
    zoom: 6,
    pitch: 60,  // Ángulo de vista
    bearing: 0   // Rotación
  });
}
```

**Estilos disponibles:**
- `satellite-v9` - Vista satelital (actual)
- `streets-v12` - Calles
- `outdoors-v12` - Terreno
- `light-v11` - Claro
- `dark-v11` - Oscuro

### Crear un Nuevo Componente

```bash
# Generar componente standalone
ng generate component nueva-feature --standalone

# Ejemplo: Panel de estadísticas
ng generate component map/stats-panel --standalone
```

### Añadir una Nueva Ruta

```typescript
// src/app/app.routes.ts
export const routes: Routes = [
  { path: '', component: UnifiedMapComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];
```

---

## 🔧 Troubleshooting

### Error: "Cannot find module '@angular/core'"

**Solución:**
```bash
# Limpiar caché de npm
npm cache clean --force

# Borrar node_modules
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

### Error: "Mapbox token no válido"

**Causa:** Token de Mapbox caducado o inválido

**Soluciones:**
1. **Usar token demo (limitado):** La app viene con un token demo
2. **Crear tu propio token:**
   ```bash
   # 1. Ir a https://account.mapbox.com/
   # 2. Crear cuenta gratis
   # 3. Generar token
   # 4. Añadir a .env
   ```

### Error: Puerto 4200 ya en uso

**Solución:**
```bash
# Opción 1: Matar proceso
lsof -ti:4200 | xargs kill -9  # Mac/Linux
# o
netstat -ano | findstr :4200   # Windows
taskkill /PID <PID> /F

# Opción 2: Usar otro puerto
ng serve --port 4201
```

### Error: Backend no responde

**Diagnóstico:**
```bash
# Verificar que el backend esté corriendo
curl http://localhost:8000/predict

# Debería retornar JSON con predicciones
```

**Soluciones:**
1. Verificar que el backend esté iniciado
2. Revisar logs del backend
3. Verificar CORS configurado correctamente

### Problemas de Rendimiento

**Síntomas:** Mapa lento, animaciones tartamudean

**Soluciones:**

1. **Reducir número de hotspots visibles**
   ```typescript
   // Filtrar solo hotspots del mes actual
   const visibleHotspots = allHotspots.filter(h => 
     h.bloomingPeriod.includes(currentMonth)
   );
   ```

2. **Deshabilitar animaciones**
   ```typescript
   // En beezi-ultimate.ts
   const ENABLE_ANIMATIONS = false;
   ```

3. **Usar versión simplificada**
   ```typescript
   // En app.ts
   imports: [BeeziSimple]  // En lugar de BeeziUltimate
   ```

### Error: "Memory leak detected"

**Causa:** Mapa no se limpia correctamente

**Solución:**
```typescript
ngOnDestroy() {
  // Limpiar listeners
  this.map.off('click', this.clickHandler);
  
  // Remover capas
  this.map.removeLayer('hotspots');
  
  // Limpiar mapa
  this.mapCleanupService.cleanup(this.map);
  this.map.remove();
}
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Unit tests
npm test

# Con cobertura
npm test -- --code-coverage

# Abrir reporte de cobertura
open coverage/index.html
```

### Escribir un Test

```typescript
// src/app/map/hotspot-service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HotspotService } from './hotspot-service';

describe('HotspotService', () => {
  let service: HotspotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotspotService);
  });

  it('should filter hotspots by month', () => {
    const hotspots = service.getHotspotsForMonth(4);
    expect(hotspots.length).toBeGreaterThan(0);
    hotspots.forEach(h => {
      expect(h.bloomingPeriod).toContain(4);
    });
  });
});
```

---

## 🏗️ Build para Producción

```bash
# Build optimizado
npm run build

# Output en: dist/map-test/browser/

# Build para Vercel
npm run vercel-build
```

**Optimizaciones automáticas:**
- Minificación
- Tree shaking
- AOT compilation
- Bundle optimization

**Tamaño bundle:**
- Initial: ~1.5MB
- Lazy loaded: ~500KB chunks

---

## 📚 Recursos Adicionales

### Documentación

- **Angular:** https://angular.dev/
- **Mapbox GL JS:** https://docs.mapbox.com/mapbox-gl-js/
- **Deck.gl:** https://deck.gl/docs
- **FastAPI:** https://fastapi.tiangolo.com/
- **TypeScript:** https://www.typescriptlang.org/

### Tutoriales

1. **Mapbox 3D:** https://docs.mapbox.com/mapbox-gl-js/example/
2. **Angular Signals:** https://angular.dev/guide/signals
3. **GeoJSON:** https://geojson.org/

### Comunidad

- **GitHub Issues:** https://github.com/itxintxu13/Beezi/issues
- **Discusiones:** (Pendiente)
- **Discord:** (Pendiente)

---

## 🎯 Próximos Pasos Recomendados

### Para Desarrolladores

1. **Familiarizarse con el código:**
   - Leer `app.unified-map.ts`
   - Explorar `beezi-ultimate.ts`
   - Entender modelos de datos

2. **Experimentar:**
   - Añadir un hotspot nuevo
   - Cambiar estilos del mapa
   - Crear una nueva animación

3. **Contribuir:**
   - Implementar tests
   - Mejorar documentación
   - Optimizar rendimiento

### Para Evaluadores/Jurado

1. **Demo rápida:**
   ```bash
   npm install
   npm run dev
   # Abrir http://localhost:4200
   ```

2. **Explorar features:**
   - Buscar "Madrid"
   - Click en hotspots
   - Probar timelapse
   - Activar protocolo emergencia

3. **Revisar documentación:**
   - `BEEZI_DEMO.md` - Presentación hackathon
   - `PITCH_DECK.md` - Business plan
   - `ANALISIS_PROYECTO.md` - Análisis completo

---

## ❓ FAQ

**P: ¿Necesito un token de Mapbox para desarrollo?**  
R: No es obligatorio. Hay un token demo incluido con limitaciones razonables para desarrollo.

**P: ¿Puedo usar esto sin backend?**  
R: Sí, el frontend funciona completamente standalone. El backend solo añade predicciones AI.

**P: ¿Los datos satelitales son reales?**  
R: Actualmente son simulados para el MVP. La integración real está en desarrollo.

**P: ¿Cómo deploy a producción?**  
R: Recomendamos Vercel para frontend (gratis) y AWS/Heroku para backend.

**P: ¿Puedo usar esto comercialmente?**  
R: Revisar licencia del repositorio. Algunos componentes tienen sus propias licencias.

---

## 📞 Soporte

**¿Necesitas ayuda?**

1. Revisar esta guía y `README.md`
2. Buscar en Issues: https://github.com/itxintxu13/Beezi/issues
3. Crear un nuevo issue si es necesario

---

**¡Feliz coding! 🐝🌍**

*Guía actualizada: Enero 2026*
