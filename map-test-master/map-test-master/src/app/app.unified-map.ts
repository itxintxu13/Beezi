// --- INTEGRACIÓN VISUAL Y DE INTERACCIÓN MAPBOX ---
addMapboxInteractions() {
  if (!this.map) return;
  // Popups en hotspots
  this.map.on('click', 'hotspots-demo-circles', (e: any) => {
    const props = e.features[0].properties;
    new (window as any).mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`<b>🌸 Hotspot de floración</b><br>NDVI: ${props.ndvi || '-'}<br>Fecha: ${props.date}`)
      .addTo(this.map);
  });
  // Popups en rutas
  this.map.on('click', 'bee-routes-demo-line', (e: any) => {
    new (window as any).mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML('🐝 <b>Ruta de polinizador</b>')
      .addTo(this.map);
  });
  // Cambia cursor sobre elementos interactivos
  this.map.on('mouseenter', 'hotspots-demo-circles', () => {
    this.map.getCanvas().style.cursor = 'pointer';
  });
  this.map.on('mouseleave', 'hotspots-demo-circles', () => {
    this.map.getCanvas().style.cursor = '';
  });
}

addRecommendationPanel() {
  // Panel lateral simple
  let panel = document.getElementById('beezi-recommend-panel') as HTMLDivElement;
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'beezi-recommend-panel';
    panel.style.position = 'fixed';
    panel.style.top = '80px';
    panel.style.right = '30px';
    panel.style.width = '320px';
    panel.style.background = 'rgba(255,255,255,0.95)';
    panel.style.borderRadius = '16px';
    panel.style.boxShadow = '0 4px 24px #0002';
    panel.style.padding = '24px';
    panel.style.zIndex = '1000';
    panel.innerHTML = `<h3>🌼 Recomendaciones</h3><ul><li>Plantar flores en zonas con NDVI bajo</li><li>Vigilar rutas con menos hotspots</li><li>Revisar alertas de escasez</li></ul>`;
    document.body.appendChild(panel);
  }
}

// Llama estas funciones tras cargar el mapa y los datos
ngAfterViewInit() {
  this.fetchAndLoadGeojson();
}
// --- MVP: Carga de datos satelitales/demo, slider temporal y animación de abejas ---
type Bee = { id: number; routeIndex: number; progress: number; speed: number; x: number; y: number };

currentDateIndex = 0;
demoDates: string[] = [];
beeAnimationFrameId: number | null = null;
bees: Bee[] = [];
hotspotsData: any = null;
habitatsData: any = null;
routesData: any = null;

ngAfterViewInit() {
  this.fetchAndLoadGeojson();
}

async fetchAndLoadGeojson() {
  // Cargar datos demo o reales
  const [hotspots, habitats, routes] = await Promise.all([
    fetch('public/data/hotspots_demo.geojson').then(r => r.json()),
    fetch('public/data/habitats_demo.geojson').then(r => r.json()),
    fetch('public/data/bee_routes_demo.geojson').then(r => r.json())
  ]);
  this.hotspotsData = hotspots;
  this.habitatsData = habitats;
  this.routesData = routes;
  this.demoDates = Array.from(new Set(hotspots.features.map((f: any) => f.properties.date)));
  this.currentDateIndex = 0;
  this.loadDemoLayers();
  this.setupBeeAnimation();
  this.addTimeSlider();
  this.addMapboxInteractions();
  this.addRecommendationPanel();
}

loadDemoLayers() {
  if (!this.map) return;
  // Hotspots
  if (this.map.getSource('hotspots-demo')) this.map.removeSource('hotspots-demo');
  this.map.addSource('hotspots-demo', {
    type: 'geojson',
    data: this.hotspotsData
  });
  if (this.map.getLayer('hotspots-demo-circles')) this.map.removeLayer('hotspots-demo-circles');
  this.map.addLayer({
    id: 'hotspots-demo-circles',
    type: 'circle',
    source: 'hotspots-demo',
    paint: {
      'circle-radius': 16,
      'circle-color': '#FFD600',
      'circle-opacity': 0.7,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#FF6F00'
    },
    filter: ['==', ['get', 'date'], this.demoDates[this.currentDateIndex]]
  });
  // Hábitats
  if (this.map.getSource('habitats-demo')) this.map.removeSource('habitats-demo');
  this.map.addSource('habitats-demo', {
    type: 'geojson',
    data: this.habitatsData
  });
  if (this.map.getLayer('habitats-demo-fill')) this.map.removeLayer('habitats-demo-fill');
  this.map.addLayer({
    id: 'habitats-demo-fill',
    type: 'fill',
    source: 'habitats-demo',
    paint: {
      'fill-color': '#81C784',
      'fill-opacity': 0.3
    }
  });
  // Rutas de abejas
  if (this.map.getSource('bee-routes-demo')) this.map.removeSource('bee-routes-demo');
  this.map.addSource('bee-routes-demo', {
    type: 'geojson',
    data: this.routesData
  });
  if (this.map.getLayer('bee-routes-demo-line')) this.map.removeLayer('bee-routes-demo-line');
  this.map.addLayer({
    id: 'bee-routes-demo-line',
    type: 'line',
    source: 'bee-routes-demo',
    paint: {
      'line-color': '#00B8D4',
      'line-width': 4,
      'line-opacity': 0.7,
      'line-dasharray': [2, 2]
    }
  });
}

addTimeSlider() {
  // Slider temporal en la UI
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '0';
  slider.max = (this.demoDates.length - 1).toString();
  slider.value = this.currentDateIndex.toString();
  slider.style.position = 'absolute';
  slider.style.bottom = '30px';
  slider.style.left = '50%';
  slider.style.transform = 'translateX(-50%)';
  slider.style.width = '300px';
  slider.id = 'beezi-timeline-slider';
  document.body.appendChild(slider);
  slider.addEventListener('input', (e) => {
    this.currentDateIndex = parseInt((e.target as HTMLInputElement).value);
    this.updateHotspotsByDate();
  });
}

updateHotspotsByDate() {
  if (this.map.getLayer('hotspots-demo-circles')) {
    this.map.setFilter('hotspots-demo-circles', ['==', ['get', 'date'], this.demoDates[this.currentDateIndex]]);
  }
}

setupBeeAnimation() {
  // Inicializar abejas en rutas demo
  this.bees = this.routesData.features.map((f: any, i: number) => ({
    id: i + 1,
    routeIndex: i,
    progress: 0,
    speed: 0.003 + Math.random() * 0.002,
    x: 0,
    y: 0
  }));
  this.animateBees();
}

animateBees() {
  if (!this.routesData) return;
  this.bees.forEach((bee, i) => {
    const route = this.routesData.features[bee.routeIndex].geometry.coordinates;
    const idx = Math.floor(bee.progress * (route.length - 1));
    const nextIdx = Math.min(idx + 1, route.length - 1);
    const t = (bee.progress * (route.length - 1)) % 1;
    const lng = route[idx][0] + (route[nextIdx][0] - route[idx][0]) * t;
    const lat = route[idx][1] + (route[nextIdx][1] - route[idx][1]) * t;
    // Dibuja marcador de abeja (puedes mejorar con sprite SVG)
    let el = document.getElementById('bee-marker-' + bee.id) as HTMLDivElement;
    if (!el) {
      el = document.createElement('div');
      el.id = 'bee-marker-' + bee.id;
      el.innerHTML = '🐝';
      el.style.position = 'absolute';
      el.style.fontSize = '2rem';
      el.style.pointerEvents = 'none';
      el.style.zIndex = '10';
      document.body.appendChild(el);
    }
    const point = this.map.project([lng, lat]);
    el.style.left = point.x + 'px';
    el.style.top = point.y + 'px';
    bee.progress += bee.speed;
    if (bee.progress > 1) bee.progress = 0;
  });
  this.beeAnimationFrameId = requestAnimationFrame(() => this.animateBees());
}
// --- FIN MVP ---
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as mapboxgl from 'mapbox-gl';
import { BeeziIaPanelComponent } from './map/mapa/beezi-ia-panel';

@Component({
  selector: 'app-unified-map',
  standalone: true,
  imports: [FormsModule, BeeziIaPanelComponent],
  template: `
    <div class="unified-map-container">
      <div #mapContainer class="mapbox-map"></div>
      <div class="landing-search-panel" *ngIf="!advancedMode">
        <h1>BEEZI</h1>
        <p>Sistema Satelital de Protección de Polinizadores</p>
        <div class="search-row">
          <input type="text" placeholder="Buscar región o país..." [(ngModel)]="query" (keydown.enter)="flyToQuery()" />
          <button (click)="flyToQuery()"><span style="font-size:1.2em;">🔍</span> Explorar</button>
        </div>
      </div>
      <div *ngIf="advancedMode">
        <div class="top-controls glassmorph">
          <button (click)="resetToGlobe()" class="back-to-space ux-btn" title="Volver al Espacio">🌍 <span class="hide-mobile">Volver al Espacio</span></button>
          <div class="region-info">
            <h2>📍 {{currentRegion}}</h2>
            <span class="region-status">{{regionStatus}}</span>
          </div>
          <div class="view-controls">
            <button (click)="toggleTimelapseMode()" class="control-btn ux-btn" title="Timelapse"><span class="btn-icon">⏯️</span> <span class="btn-label hide-mobile">Timelapse</span></button>
            <button (click)="togglePanel('ecosystem')" class="control-btn ux-btn" title="Ecosistema"><span class="btn-icon">📊</span> <span class="btn-label hide-mobile">Ecosistema</span></button>
            <button (click)="togglePanel('legend')" class="control-btn ux-btn" title="Leyenda"><span class="btn-icon">🗺️</span> <span class="btn-label hide-mobile">Leyenda</span></button>
            <button (click)="showEmergencyProtocol()" class="emergency-btn ux-btn" title="Protocolo Emergencia"><span class="btn-icon">🚨</span> <span class="btn-label hide-mobile">Emergencia</span></button>
          </div>
        </div>
        <beezi-ia-panel></beezi-ia-panel>
        <div *ngIf="panels.ecosystem" class="floating-panel ecosystem-panel glassmorph" [style.transform]="'translate(' + panelPositions.ecosystem.x + 'px, ' + panelPositions.ecosystem.y + 'px)'" (mousedown)="startDrag('ecosystem', $event)">
          <div class="panel-header">
            <span class="panel-title">📊 Estado del Ecosistema</span>
            <div class="panel-controls">
              <button (click)="minimizePanel('ecosystem')" class="minimize-btn ux-btn" title="Minimizar">{{panelStates.ecosystem.minimized ? '🔼' : '🔽'}}</button>
              <button (click)="closePanel('ecosystem')" class="close-btn ux-btn" title="Cerrar">✕</button>
            </div>
          </div>
          <div *ngIf="!panelStates.ecosystem.minimized" class="panel-content">
            <!-- Aquí puedes poner métricas y predicciones -->
            <div class="metrics-grid">
              <div class="metric-card"><div class="metric-icon">🐝</div><div class="metric-info"><span class="metric-value">157K</span><span class="metric-label">Polinizadores</span><span class="metric-trend positive">↗ +18%</span></div></div>
              <div class="metric-card"><div class="metric-icon">🌺</div><div class="metric-info"><span class="metric-value">12</span><span class="metric-label">Zonas Activas</span><span class="metric-trend positive">↗ +8%</span></div></div>
              <div class="metric-card"><div class="metric-icon">⚠️</div><div class="metric-info"><span class="metric-value">3</span><span class="metric-label">Alertas</span><span class="metric-trend negative">↘ -12%</span></div></div>
              <div class="metric-card"><div class="metric-icon">🎯</div><div class="metric-info"><span class="metric-value">89%</span><span class="metric-label">Eficiencia</span><span class="metric-trend positive">↗ +5%</span></div></div>
            </div>
            <div class="ai-predictions predictions-section">
              <h4>🤖 Predicciones IA</h4>
              <div class="prediction-item priority-high"><span class="prediction-icon">🌺</span><span class="prediction-text">Pico de floración en Andalucía en 15 días</span></div>
              <div class="prediction-item priority-medium"><span class="prediction-icon">🛣️</span><span class="prediction-text">Migración masiva detectada hacia el norte</span></div>
              <div class="prediction-item priority-low"><span class="prediction-icon">⚠️</span><span class="prediction-text">Escasez prevista en Castilla-La Mancha</span></div>
            </div>
          </div>
        </div>
        <div *ngIf="panels.legend" class="floating-panel legend-panel glassmorph" [style.transform]="'translate(' + panelPositions.legend.x + 'px, ' + panelPositions.legend.y + 'px)'" (mousedown)="startDrag('legend', $event)">
          <div class="panel-header"><span class="panel-title">🗺️ Leyenda del Mapa</span><div class="panel-controls"><button (click)="minimizePanel('legend')" class="minimize-btn ux-btn" title="Minimizar">{{panelStates.legend.minimized ? '🔼' : '🔽'}}</button><button (click)="closePanel('legend')" class="close-btn ux-btn" title="Cerrar">✕</button></div></div>
          <div *ngIf="!panelStates.legend.minimized" class="panel-content">
            <div class="legend-section"><h4>🌺 Intensidad de Floración</h4><div class="legend-item"><span class="legend-symbol high-intensity">🌹</span><span class="legend-text">Alta (&gt;70%)</span></div><div class="legend-item"><span class="legend-symbol medium-intensity">🌻</span><span class="legend-text">Media (40-70%)</span></div><div class="legend-item"><span class="legend-symbol low-intensity">🌼</span><span class="legend-text">Baja (&lt;40%)</span></div></div>
            <div class="legend-section"><h4>🛣️ Rutas de Migración</h4><div class="legend-item"><span class="legend-line active-route"></span><span class="legend-text">Rutas Activas</span></div><div class="legend-item"><span class="legend-symbol">🐝</span><span class="legend-text">Polinizadores en Movimiento</span></div></div>
            <div class="legend-section"><h4>📊 Estados del Sistema</h4><div class="legend-item"><span class="legend-dot optimal"></span><span class="legend-text">Óptimo</span></div><div class="legend-item"><span class="legend-dot warning"></span><span class="legend-text">Atención</span></div><div class="legend-item"><span class="legend-dot critical"></span><span class="legend-text">Crítico</span></div></div>
          </div>
        </div>
        <div *ngIf="showEmergency" class="emergency-modal glassmorph" (click)="hideEmergencyProtocol()">
          <div class="emergency-content" (click)="$event.stopPropagation()">
            <div class="emergency-header">
              <h2>🚨 PROTOCOLO DE EMERGENCIA ACTIVADO</h2>
              <button (click)="hideEmergencyProtocol()" class="close-btn ux-btn" title="Cerrar">✕</button>
            </div>
            <div class="emergency-body">
              <div class="alert-section">
                <h3>⚠️ SITUACIÓN CRÍTICA DETECTADA</h3>
                <p>Sistema autónomo ha identificado una amenaza inmediata a la población de polinizadores en la región.</p>
              </div>
              <div class="action-section">
                <h3>🎯 ACCIONES AUTOMÁTICAS INICIADAS</h3>
                <div class="action-item completed">✅ Alertas enviadas a 127 apicultores locales</div>
                <div class="action-item completed">✅ Redistribución de colmenas programada</div>
                <div class="action-item in-progress">🔄 Siembra de emergencia coordinada</div>
                <div class="action-item pending">⏳ Despliegue de polinizadores artificiales</div>
              </div>
              <div class="timeline-section">
                <h3>⏱️ CRONOLOGÍA DE RESPUESTA</h3>
                <div class="timeline-item">T+0min: Detección satelital automática</div>
                <div class="timeline-item">T+2min: Análisis IA completado</div>
                <div class="timeline-item">T+5min: Protocolo activado</div>
                <div class="timeline-item current">T+8min: Acciones en curso</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./landing-globe.component.scss']
})
export class UnifiedMapComponent implements AfterViewInit {
  panels = { ecosystem: true, legend: true };
  panelStates = { ecosystem: { minimized: false }, legend: { minimized: false } };
  panelPositions = { ecosystem: { x: 20, y: 100 }, legend: { x: window.innerWidth - 420, y: 100 } };
  dragging = { panel: '', startX: 0, startY: 0, startPosX: 0, startPosY: 0 };
  showEmergency = false;
  togglePanel(panel: 'ecosystem' | 'legend') {
    this.panels[panel] = !this.panels[panel];
  }
  closePanel(panel: 'ecosystem' | 'legend') {
    this.panels[panel] = false;
  }
  minimizePanel(panel: 'ecosystem' | 'legend') {
    this.panelStates[panel].minimized = !this.panelStates[panel].minimized;
  }
  startDrag(panel: 'ecosystem' | 'legend', event: MouseEvent) {
    event.preventDefault();
    this.dragging.panel = panel;
    this.dragging.startX = event.clientX;
    this.dragging.startY = event.clientY;
    this.dragging.startPosX = this.panelPositions[panel].x;
    this.dragging.startPosY = this.panelPositions[panel].y;
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }
  onMouseMove(event: MouseEvent) {
    if (!this.dragging.panel) return;
    const deltaX = event.clientX - this.dragging.startX;
    const deltaY = event.clientY - this.dragging.startY;
    const panel = this.dragging.panel as 'ecosystem' | 'legend';
    this.panelPositions[panel].x = this.dragging.startPosX + deltaX;
    this.panelPositions[panel].y = this.dragging.startPosY + deltaY;
    this.panelPositions[panel].x = Math.max(0, Math.min(window.innerWidth - 320, this.panelPositions[panel].x));
    this.panelPositions[panel].y = Math.max(70, Math.min(window.innerHeight - 200, this.panelPositions[panel].y));
  }
  onMouseUp() {
    this.dragging.panel = '';
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }
  toggleTimelapseMode() {/* lógica de timelapse aquí si se desea */}
  showEmergencyProtocol() { this.showEmergency = true; }
  hideEmergencyProtocol() { this.showEmergency = false; }
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef<HTMLDivElement>;
  map!: mapboxgl.Map;
  query: string = '';
  advancedMode = false;
  currentRegion = '';
  regionStatus = 'Monitoreo activo - Estado óptimo';

  beeRoutes: any[] = [];
  activeBees: any[] = [];
  animationFrameId?: number;

  ngAfterViewInit(): void {
    (mapboxgl as any).accessToken = 'pk.eyJ1Ijoic2FoaXZhIiwiYSI6ImNtZzl3cXFwaDBpOG8ybHNneGFwZ3ZqOTUifQ.UrldzEHRjHkw2CiMeAyR-Q';
    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [0, 20],
      zoom: 1.2,
      projection: 'globe',
      pitch: 0,
      bearing: 0,
      antialias: true
    });
    this.map.on('style.load', () => {
      this.map.setFog({
        'color': 'white',
        'horizon-blend': 0.5
      });
    });
  }

  async flyToQuery() {
    if (!this.query.trim()) return;
    const region = this.query.trim();
    let coords: [number, number] = [0, 20];
    try {
      const resp = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(region)}.json?access_token=pk.eyJ1Ijoic2FoaXZhIiwiYSI6ImNtZzl3cXFwaDBpOG8ybHNneGFwZ3ZqOTUifQ.UrldzEHRjHkw2CiMeAyR-Q`);
      const data = await resp.json();
      if (data.features && data.features.length > 0) {
        coords = data.features[0].center;
      }
    } catch {}
    this.currentRegion = region;
    this.regionStatus = 'Monitoreo activo - Estado óptimo';
    // Animar el globo y luego activar modo avanzado
    this.map.flyTo({
      center: coords,
      zoom: 6.5,
      speed: 1.2,
      curve: 1.8,
      essential: true,
      bearing: 20 + Math.random() * 40,
      pitch: 45
    });
    setTimeout(() => {
      this.advancedMode = true;
      this.addHotspots();
      this.addRoutes();
      this.setupBeeRoutes();
      this.startBeeAnimation();
    }, 1600);
  addHotspots() {
    const hotspots = [
      { coordinates: [-5.9842, 37.3891], intensity: 'high', flower: '🌹', name: 'Sevilla' },
      { coordinates: [-3.6032, 37.1760], intensity: 'high', flower: '🌺', name: 'Jaén' },
      { coordinates: [-4.4214, 36.7213], intensity: 'medium', flower: '🌻', name: 'Málaga' },
      { coordinates: [-1.1307, 37.9922], intensity: 'medium', flower: '🌼', name: 'Murcia' },
      { coordinates: [-0.3763, 39.4699], intensity: 'low', flower: '🌸', name: 'Valencia' },
      { coordinates: [2.1734, 41.3851], intensity: 'medium', flower: '🌷', name: 'Barcelona' },
      { coordinates: [-8.5460, 42.8805], intensity: 'high', flower: '🌹', name: 'A Coruña' },
      { coordinates: [-5.8447, 43.3614], intensity: 'medium', flower: '🌻', name: 'Oviedo' },
      { coordinates: [-2.9253, 43.2627], intensity: 'low', flower: '🌼', name: 'Bilbao' },
      { coordinates: [-3.7492, 40.4637], intensity: 'medium', flower: '🌺', name: 'Madrid' },
      { coordinates: [-15.4138, 28.0997], intensity: 'high', flower: '🌸', name: 'Las Palmas' },
      { coordinates: [-16.5004, 28.2916], intensity: 'medium', flower: '🌷', name: 'Tenerife' }
    ];
    this.map.addSource('hotspots', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: hotspots.map(hotspot => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: hotspot.coordinates
          },
          properties: {
            intensity: hotspot.intensity,
            flower: hotspot.flower,
            name: hotspot.name
          }
        }))
      }
    });
    // Aquí puedes añadir la capa de círculos pulsantes y popups si lo deseas
  }

  addRoutes() {
    const routes = [
      { from: [-5.9842, 37.3891], to: [-3.6032, 37.1760] },
      { from: [-3.6032, 37.1760], to: [-4.4214, 36.7213] },
      { from: [-4.4214, 36.7213], to: [-1.1307, 37.9922] },
      { from: [-1.1307, 37.9922], to: [-0.3763, 39.4699] },
      { from: [-0.3763, 39.4699], to: [2.1734, 41.3851] },
      { from: [2.1734, 41.3851], to: [-3.7492, 40.4637] },
      { from: [-3.7492, 40.4637], to: [-8.5460, 42.8805] }
    ];
    this.map.addSource('routes', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: routes.map(route => ({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [route.from, route.to]
          },
          properties: {}
        }))
      }
    });
    this.map.addLayer({
      id: 'routes-lines',
      type: 'line',
      source: 'routes',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#00d4ff',
        'line-width': 3,
        'line-opacity': 0.8,
        'line-dasharray': [2, 4]
      }
    });
    this.beeRoutes = routes;
  }

  setupBeeRoutes() {
    this.activeBees = [
      { id: 1, routeIndex: 0, progress: 0, speed: 3000, x: 0, y: 0 },
      { id: 2, routeIndex: 1, progress: 0.3, speed: 2500, x: 0, y: 0 },
      { id: 3, routeIndex: 2, progress: 0.6, speed: 3500, x: 0, y: 0 },
      { id: 4, routeIndex: 3, progress: 0.9, speed: 2800, x: 0, y: 0 }
    ];
  }

  startBeeAnimation() {
    if (!this.advancedMode || !this.map || this.beeRoutes.length === 0) return;
    const animateBees = () => {
      this.activeBees.forEach(bee => {
        if (bee.routeIndex >= this.beeRoutes.length) return;
        const route = this.beeRoutes[bee.routeIndex];
        const fromPoint = this.map.project(route.from);
        const toPoint = this.map.project(route.to);
        bee.x = fromPoint.x + (toPoint.x - fromPoint.x) * bee.progress;
        bee.y = fromPoint.y + (toPoint.y - fromPoint.y) * bee.progress;
        bee.progress += 0.005;
        if (bee.progress >= 1) {
          bee.progress = 0;
          bee.routeIndex = (bee.routeIndex + 1) % this.beeRoutes.length;
        }
      });
      if (this.advancedMode) {
        this.animationFrameId = requestAnimationFrame(animateBees);
      }
    };
    animateBees();
  }
  resetToGlobe() {
    this.advancedMode = false;
    this.query = '';
    this.currentRegion = '';
    this.regionStatus = 'Monitoreo activo - Estado óptimo';
    this.map.flyTo({
      center: [0, 20],
      zoom: 1.2,
      speed: 1.2,
      curve: 1.8,
      essential: true,
      bearing: 0,
      pitch: 0
    });
  }
  }
}
