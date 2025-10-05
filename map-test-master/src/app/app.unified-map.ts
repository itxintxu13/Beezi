
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import mapboxgl from 'mapbox-gl';
import { MapCleanupService } from './core/map-cleanup.service';
import { TimelapseService } from './core/timelapse.service';

@Component({
  selector: 'app-unified-map',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="unified-map-container" style="display:flex;flex-direction:row;height:100vh;width:100vw;overflow:hidden;">
      <div style="flex:1;position:relative;height:100vh;min-width:0;">
       <div class="satellite-icon" *ngIf="!advancedMode">🛰️</div>
        <div #mapContainer class="mapbox-map"></div>
        <div class="landing-search-panel" *ngIf="!advancedMode" style="max-width: 300px; padding: 12px;">
        <h1 style="margin:0;font-size:1.4rem;">BEEZI</h1>
        <p style="margin:4px 0 10px 0;font-size:0.9rem;">Satellite Explorer</p>
        <div class="search-row">
          <input id="regionQueryInput" name="regionQuery" type="text" placeholder="Search region or country..." [(ngModel)]="query" (keydown.enter)="flyToQuery()" />
          <button (click)="flyToQuery()"><span style="font-size:1.6em;">🐝</span> Explore</button>
        </div>
      </div>
        <div *ngIf="advancedMode">
        <div class="top-controls glassmorph">
          <button (click)="resetToGlobe()" class="back-to-space " title="Back to Globe">🌍 <span class="hide-mobile">Back to Globe</span></button>
          <div class="region-info">
            <h2>📍 {{currentRegion}}</h2>
            <span class="region-status">{{regionStatus}}</span>
          </div>
          <div class="view-controls" style="position:relative;">
            <button (click)="toggleTimelapseMode()" class="control-btn " title="Timelapse"><span class="btn-icon">⏯️</span> <span class="btn-label hide-mobile">Timelapse</span></button>
            <button (click)="togglePanel('ecosystem')" class="control-btn " title="Ecosystem"><span class="btn-icon">📊</span> <span class="btn-label hide-mobile">Ecosystem</span></button>
            <button (click)="togglePanel('legend')" class="control-btn " title="Legend"><span class="btn-icon">🗺️</span> <span class="btn-label hide-mobile">Legend</span></button>
            <button (click)="showEmergencyProtocol()" class="emergency-btn " title="Emergency Protocol"><span class="btn-icon">🚨</span> <span class="btn-label hide-mobile">Emergency</span></button>
          </div>
        </div>
      </div>
      <!-- Panel IA lateral derecho, hermano directo del mapa, nunca sobre el mapa -->

  // Beezi AI methods and properties removed
        // ...existing code...
          
        </div>
        <div *ngIf="panels.legend" class="floating-panel legend-panel glassmorph" [style.transform]="'translate(' + panelPositions.legend.x + 'px, ' + panelPositions.legend.y + 'px)'" (mousedown)="startDrag('legend', $event)">
          <div class="panel-header"><span class="panel-title">🗺️ Map Legend</span><div class="panel-controls"><button (click)="minimizePanel('legend')" class="minimize-btn " title="Minimize">{{panelStates.legend.minimized ? '🔼' : '🔽'}}</button><button (click)="closePanel('legend')" class="close-btn " title="Close">✕</button></div></div>
          <div *ngIf="!panelStates.legend.minimized" class="panel-content">
            <div class="legend-section"><h4>🌺 Blooming Intensity</h4><div class="legend-item"><span class="legend-symbol high-intensity">🌹</span><span class="legend-text">High (&gt;70%)</span></div><div class="legend-item"><span class="legend-symbol medium-intensity">🌻</span><span class="legend-text">Medium (40-70%)</span></div><div class="legend-item"><span class="legend-symbol low-intensity">🌼</span><span class="legend-text">Low (&lt;40%)</span></div></div>
            <div class="legend-section"><h4>🛣️ Migration Routes</h4><div class="legend-item"><span class="legend-line active-route"></span><span class="legend-text">Active Routes</span></div><div class="legend-item"><span class="legend-symbol">🐝</span><span class="legend-text">Pollinators in Motion</span></div></div>
            <div class="legend-section"><h4>📊 System Status</h4><div class="legend-item"><span class="legend-dot optimal"></span><span class="legend-text">Optimal</span></div><div class="legend-item"><span class="legend-dot warning"></span><span class="legend-text">Warning</span></div><div class="legend-item"><span class="legend-dot critical"></span><span class="legend-text">Critical</span></div></div>
          </div>
        </div>
        <div *ngIf="showEmergency" class="emergency-modal glassmorph" (click)="hideEmergencyProtocol()">
          <div class="emergency-content" (click)="$event.stopPropagation()">
            <div class="emergency-header">
              <h2>🚨 EMERGENCY PROTOCOL ACTIVATED</h2>
              <button (click)="hideEmergencyProtocol()" class="close-btn " title="Close">✕</button>
            </div>
            <div class="emergency-body">
              <div class="alert-section">
                <h3>⚠️ CRITICAL SITUATION DETECTED</h3>
                <p>The autonomous system has identified an immediate threat to the pollinator population in the region.</p>
              </div>
              <div class="action-section">
                <h3>🎯 AUTOMATIC ACTIONS INITIATED</h3>
                <div class="action-item completed">✅ Alerts sent to 127 local beekeepers</div>
                <div class="action-item completed">✅ Hive redistribution scheduled</div>
                <div class="action-item in-progress">🔄 Emergency sowing coordinated</div>
                <div class="action-item pending">⏳ Deployment of artificial pollinators</div>
              </div>
              <div class="timeline-section">
                <h3>⏱️ RESPONSE TIMELINE</h3>
                <div class="timeline-item">T+0min: Automatic satellite detection</div>
                <div class="timeline-item">T+2min: AI analysis completed</div>
                <div class="timeline-item">T+5min: Protocol activated</div>
                <div class="timeline-item current">T+8min: Actions in progress</div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
   
  `,
  styleUrls: ['./landing-globe.component.scss']
})
export class UnifiedMapComponent implements AfterViewInit {
  panels = { ecosystem: false, legend: false };
  panelStates = { ecosystem: { minimized: false }, legend: { minimized: false } };
  panelPositions = { ecosystem: { x: 20, y: 100 }, legend: { x: window.innerWidth - 420, y: 100 } };
  dragging = { panel: '', startX: 0, startY: 0, startPosX: 0, startPosY: 0 };
  showEmergency = false;


  
  togglePanel(panel: 'ecosystem' | 'legend') {
    const newState = !this.panels[panel];
    this.panels[panel] = newState;

    // When opening a panel, ensure it's positioned on-screen (fix cases where initial x could be off-screen)
    if (newState) {
      if (panel === 'legend') {
        const defaultX = Math.max(10, (window.innerWidth || 800) - 420);
        const defaultY = 100;
        this.panelPositions.legend.x = Math.max(0, Math.min((window.innerWidth || 800) - 320, this.panelPositions.legend.x ?? defaultX));
        this.panelPositions.legend.y = Math.max(70, Math.min((window.innerHeight || 600) - 200, this.panelPositions.legend.y ?? defaultY));
      } else {
        const defaultX = 20;
        const defaultY = 100;
        this.panelPositions.ecosystem.x = Math.max(0, Math.min((window.innerWidth || 800) - 320, this.panelPositions.ecosystem.x ?? defaultX));
        this.panelPositions.ecosystem.y = Math.max(70, Math.min((window.innerHeight || 600) - 200, this.panelPositions.ecosystem.y ?? defaultY));
      }
      // small timeout to allow Angular to render then ensure panel is visible
      setTimeout(() => {
        const selector = panel === 'legend' ? '.legend-panel' : '.ecosystem-panel';
        const panelEl = document.querySelector(selector);
        if (panelEl && panelEl instanceof HTMLElement) {
          panelEl.style.visibility = 'visible';
        }
      }, 50);
    }
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
  

  toggleTimelapseMode() { try { this.timelapseService.toggle(); } catch (e) { console.debug('toggleTimelapse error', e); } }
  showEmergencyProtocol() { this.showEmergency = true; }
  hideEmergencyProtocol() { this.showEmergency = false; }


  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef<HTMLDivElement>;
  map!: mapboxgl.Map;
  query: string = '';
  advancedMode = false;
  currentRegion = '';
  regionStatus = 'Active monitoring - Optimal status';

  // ...existing code...

  beeRoutes: any[] = [];
  activeBees: any[] = [];
  animationFrameId?: number;

  activeHotspots: number = 12;
  totalPollinators: number = 156834;
  riskZones: number = 3;
  isAnimating: boolean = false;
  isLoading: boolean = true;
  timelapseRunning: boolean = false;
  private timelapseTimeouts: number[] = [];
  constructor(private readonly mapCleanup: MapCleanupService, private readonly timelapseService: TimelapseService) {
    // Suscribirse a comandos globales de timelapse para que el botón global funcione
    try {
      this.timelapseService.commands$.subscribe(cmd => {
        try {
          if (cmd === 'toggle') {
            if (this.timelapseRunning) this.stopTimelapse(); else this.startTimelapse();
          } else if (cmd === 'start') {
            this.startTimelapse();
          } else if (cmd === 'stop') {
            this.stopTimelapse();
          }
        } catch (e) { console.debug('unified timelapse command handling error', e); }
      });
    } catch (e) { console.debug('subscribe timelapseService error', e); }
  }
  
  ngAfterViewInit(): void {
     (mapboxgl as any).accessToken = 'pk.eyJ1Ijoic2FoaXZhIiwiYSI6ImNtZ2N5cTZqdjFjeXoyaXM3dXA4Nml6cGMifQ.ZHAn_JfNhaL3SAn_68fx8Q';
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

    this.simulateLoading();
  }
  loadingProgress: number = 0;

  private simulateLoading(): void {
    const loadingSteps = [20, 40, 60, 80, 100];
    let currentStep = 0;
    
    const loadingInterval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        this.loadingProgress = loadingSteps[currentStep];
        currentStep++;
      } else {
        clearInterval(loadingInterval);
        setTimeout(() => {
          this.isLoading = false;
          this.isAnimating = true; // Iniciar automáticamente las animaciones
        }, 500);
      }
    }, 1000);
  }

  // current month used by the timelapse UI sync
  currentMonth: number = 5;

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
  this.regionStatus = 'Active monitoring - Optimal status';
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
      
      
      this.addBloomingHotspots();
      this.addPollinatorRoutes();
      this.startAnimations();
      this.addRoutes();
      this.setupBeeRoutes();
      this.startBeeAnimation();
    }, 1600);
  }

  // ...existing code...
  
  addHotspots() {
    const hotspots = [
      { coordinates: [-5.9842, 37.3891], intensity: 'high', flower: '🌹', name: 'Seville' },
      { coordinates: [-3.6032, 37.1760], intensity: 'high', flower: '🌺', name: 'Jaen' },
      { coordinates: [-4.4214, 36.7213], intensity: 'medium', flower: '🌻', name: 'Malaga' },
      { coordinates: [-1.1307, 37.9922], intensity: 'medium', flower: '🌼', name: 'Murcia' },
      { coordinates: [-0.3763, 39.4699], intensity: 'low', flower: '🌸', name: 'Valencia' },
      { coordinates: [2.1734, 41.3851], intensity: 'medium', flower: '🌷', name: 'Barcelona' },
      { coordinates: [-8.5460, 42.8805], intensity: 'high', flower: '🌹', name: 'A Coruna' },
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
    // Disparar limpieza centralizada
    try { this.mapCleanup.triggerClear(); } catch (e) { console.debug('triggerClear error', e); }
  }

   private addBloomingHotspots(): void {
    const hotspots = [
      { lat: 37.1773, lon: -3.5985, intensity: 0.95, name: "Jaen Fields", flower: "🌺" },
      { lat: 41.6561, lon: -0.8773, intensity: 0.88, name: "Ebro Valley", flower: "🌻" },
      { lat: 40.4637, lon: -3.7492, intensity: 0.72, name: "Madrid Mountains", flower: "🌼" },
      { lat: 43.3614, lon: -5.8593, intensity: 0.65, name: "Asturias", flower: "🌸" },
      { lat: 42.3601, lon: -7.5593, intensity: 0.91, name: "Galicia", flower: "🌺" },
      { lat: 36.7213, lon: -4.4214, intensity: 0.79, name: "Malaga", flower: "🌻" },
      { lat: 28.1248, lon: -15.4300, intensity: 0.58, name: "Gran Canaria", flower: "🌼" },
      { lat: 27.7648, lon: -17.9077, intensity: 0.63, name: "La Palma", flower: "🌸" },
      { lat: 39.8628, lon: 4.2599, intensity: 0.84, name: "Ibiza", flower: "🌺" },
      { lat: 37.3886, lon: -5.9823, intensity: 0.77, name: "Seville", flower: "🌻" },
      { lat: 41.3851, lon: 2.1734, intensity: 0.69, name: "Barcelona", flower: "🌼" },
      { lat: 43.2630, lon: -2.9350, intensity: 0.73, name: "Bilbao", flower: "🌸" },
      // Examples with status for color testing
      { lat: 37.3875, lon: -5.9962, intensity: 0.15, name: "Critical Example Zone", flower: "🚨", status: 'critical' },
      { lat: 40.4168, lon: -3.7038, intensity: 0.45, name: "Madrid - Moderate", flower: "🏙️", status: 'moderate' }
    ];

    const geojson = {
      type: "FeatureCollection",
      features: hotspots.map(hotspot => ({
        type: "Feature",
        geometry: { 
          type: "Point", 
          coordinates: [hotspot.lon, hotspot.lat] 
        },
        properties: { 
          name: hotspot.name,
          intensity: hotspot.intensity,
          flower: hotspot.flower,
          status: (hotspot as any).status
        }
      }))
    };

    this.map.addSource('blooming-hotspots', { 
      type: 'geojson', 
      data: geojson as any
    });

    // Mapa de calor mejorado
    this.map.addLayer({
      id: 'blooming-heatmap',
      type: 'heatmap',
      source: 'blooming-hotspots',
      maxzoom: 9,
      paint: {
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'intensity'],
          0, 0,
          1, 1
        ],
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 1,
          9, 4
        ],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(16, 185, 129, 0)',
          0.2, 'rgba(16, 185, 129, 0.2)',
          0.4, 'rgba(245, 158, 11, 0.4)',
          0.6, 'rgba(239, 68, 68, 0.6)',
          0.8, 'rgba(220, 38, 38, 0.8)'
        ],
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 3,
          9, 25
        ],
        'heatmap-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          7, 1,
          9, 0
        ]
      }
    });

    // Circles with pulsing flowers
    this.map.addLayer({
      id: 'blooming-circles',
      type: 'circle',
      source: 'blooming-hotspots',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'intensity'],
          0, 15,
          1, 50
        ],
        'circle-color': [
          'case',
          ['==', ['get', 'status'], 'critical'], '#FF1744',
          ['==', ['get', 'status'], 'moderate'], '#FF6B35',
          ['==', ['get', 'status'], 'low'], '#FFE135',
          ['interpolate', ['linear'], ['get', 'intensity'], 0, '#fbbf24', 0.5, '#f59e0b', 1, '#059669']
        ],
        'circle-opacity': 0.6,
        'circle-stroke-width': 3,
        'circle-stroke-color': '#ffffff',
        'circle-stroke-opacity': 0.9
      }
    }, 'blooming-heatmap');

    // Popups mejorados
    this.map.on('click', 'blooming-circles', (e: any) => {
      const properties = e.features[0].properties;
      const coordinates = e.features[0].geometry.coordinates.slice();

      new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        className: 'modern-popup'
      })
        .setLngLat(coordinates)
        .setHTML(`
          <div style="padding: 16px; max-width: 280px; background: linear-gradient(135deg, #0f172a, #1e293b); border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.3);">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
              <span style="font-size: 2rem;">${properties.flower}</span>
              <h3 style="margin: 0; color: #f1f5f9; font-size: 1.1rem; font-weight: 600;">${properties.name}</h3>
            </div>
            <div style="display: grid; gap: 8px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #94a3b8; font-size: 0.9rem;">Intensity:</span>
                <span style="color: #10b981; font-weight: 600;">${(properties.intensity * 100).toFixed(0)}%</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #94a3b8; font-size: 0.9rem;">Status:</span>
                <span style="color: ${properties.intensity > 0.7 ? '#10b981' : '#f59e0b'}; font-weight: 600;">
                  ${properties.intensity > 0.7 ? 'Optimal' : 'Moderate'}
                </span>
              </div>
              <div style="margin-top: 8px; padding: 8px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; border-left: 3px solid #10b981;">
                <span style="color: #e2e8f0; font-size: 0.85rem;">🐝 Active pollinators in the area</span>
              </div>
            </div>
          </div>
        `)
        .addTo(this.map);
    });
  }

  private addPollinatorRoutes(): void {
    const routes = [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [-3.7038, 40.4168], // Madrid
            [-2.9350, 43.2630], // Bilbao
            [-5.8593, 43.3614], // Asturias
            [-7.5593, 42.3601]  // Galicia
          ]
        },
        properties: { name: "Ruta Norte" }
      },
      {
        type: "Feature", 
        geometry: {
          type: "LineString",
          coordinates: [
            [-3.5985, 37.1773], // Jaén
            [-4.4214, 36.7213], // Málaga
            [-5.9845, 37.3891], // Sevilla
            [-0.8773, 41.6561]  // Zaragoza
          ]
        },
        properties: { name: "Ruta Sur" }
      }
    ];

    routes.forEach((route, index) => {
      this.map.addSource(`pollinator-route-${index}`, {
        type: 'geojson',
        data: route as any
      });

      this.map.addLayer({
        id: `pollinator-path-${index}`,
        type: 'line',
        source: `pollinator-route-${index}`,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#10b981',
          'line-width': 6,
          'line-opacity': 0.8,
          'line-dasharray': [3, 3]
        }
      });
    });
  }

  private startAnimations(): void {
    this.animateCircles();
  }

  private animateCircles(): void {
    let pulseScale = 1;
    let growing = true;

    const animate = () => {
      if (growing) {
        pulseScale += 0.015;
        if (pulseScale >= 1.4) growing = false;
      } else {
        pulseScale -= 0.015;
        if (pulseScale <= 1) growing = true;
      }

      this.map.setPaintProperty('blooming-circles', 'circle-radius', [
        'interpolate',
        ['linear'],
        ['get', 'intensity'],
        0, 15 * pulseScale,
        1, 50 * pulseScale
      ]);

      if (this.isAnimating) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  toggleAnimation(): void {
    this.isAnimating = !this.isAnimating;
    if (this.isAnimating) {
      this.animateCircles();
    }
  }

  // Timelapse: mejorada — secuencia indexada, cancelable y sincronizable con UI
  private readonly timelapseSteps = [
    { center: [-3.5985, 37.1773], zoom: 8, duration: 1400, month: 4 }, // Jaén - Primavera (Abril)
    { center: [-7.5593, 42.3601], zoom: 8, duration: 1400, month: 7 }, // Galicia - Verano (Julio)
    { center: [-4.4214, 36.7213], zoom: 8, duration: 1400, month: 10 }, // Málaga - Otoño (Octubre)
    { center: [-15.4300, 28.1248], zoom: 8, duration: 1400, month: 1 }, // Canarias - Invierno (Enero)
    { center: [-3.7038, 40.4168], zoom: 6, duration: 1800, month: 6 }  // España completa (Junio)
  ];
  private timelapseIndex: number = 0;
  timelapseLoop: boolean = false; // si true, repite la secuencia al final

  private getMonthName(m: number): string {
    const names = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return names[Math.max(0, Math.min(11, m - 1))] || '';
  }

  // Ejecuta el paso actual y programa el siguiente (cancelable)
  private runTimelapseStep(): void {
    if (!this.timelapseRunning) return;
    const step = this.timelapseSteps[this.timelapseIndex];
    if (!step) { this.stopTimelapse(); return; }

    try {
      this.map.flyTo({ center: step.center as [number, number], zoom: step.zoom, speed: 1.4, curve: 1.6, essential: true });
    } catch (e) { console.debug('timelapse flyTo error', e); }

    // Sincronizar UI (slider/etiqueta de mes) si existen
    try {
      if (typeof step.month === 'number') {
        this.currentMonth = step.month;
        const slider = document.getElementById('monthSlider') as HTMLInputElement | null;
        const monthDisplay = document.getElementById('currentMonth');
        if (slider) slider.value = String(this.currentMonth);
        if (monthDisplay) monthDisplay.textContent = this.getMonthName(this.currentMonth);
      }
  } catch (e) { console.debug('timelapse ui sync error', e); }

    // Programar siguiente paso
    const t = window.setTimeout(() => {
      this.timelapseIndex++;
      if (this.timelapseIndex >= this.timelapseSteps.length) {
        if (this.timelapseLoop) {
          this.timelapseIndex = 0;
          this.runTimelapseStep();
        } else {
          this.stopTimelapse();
        }
      } else {
        this.runTimelapseStep();
      }
    }, step.duration);
    this.timelapseTimeouts.push(t as any);
  }

  // Alternador simple desde la UI
  showTimelapseView(): void {
    if (this.timelapseRunning) this.stopTimelapse(); else this.startTimelapse();
  }

  startTimelapse(): void {
    if (this.timelapseRunning) return;
    this.timelapseRunning = true;
    // limpiar timeouts previos
    this.timelapseTimeouts.forEach(id => clearTimeout(id as any));
    this.timelapseTimeouts = [];
    this.timelapseIndex = 0;
    // comenzar inmediatamente
    this.runTimelapseStep();
  }

  stopTimelapse(): void {
    if (!this.timelapseRunning) return;
    this.timelapseRunning = false;
    this.timelapseTimeouts.forEach(id => clearTimeout(id as any));
    this.timelapseTimeouts = [];
  }

  triggerEmergencyProtocol(): void {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      background: rgba(0,0,0,0.9); display: flex; justify-content: center; 
      align-items: center; z-index: 10000; backdrop-filter: blur(10px);
    `;
    
    modal.innerHTML = `
      <div style="background: linear-gradient(135deg, #0f172a, #1e293b); padding: 40px; border-radius: 20px; max-width: 600px; text-align: center; border: 1px solid rgba(239, 68, 68, 0.3); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);">
        <div style="font-size: 4rem; margin-bottom: 20px;">🚨</div>
        <h2 style="color: #ef4444; margin-bottom: 20px; font-size: 1.8rem; font-weight: 700;">PROTOCOLO DE EMERGENCIA ACTIVADO</h2>
        <p style="margin-bottom: 30px; color: #e2e8f0; font-size: 1.1rem;">Detectada escasez crítica de recursos florales en ${this.riskZones} zonas de España.</p>
        <div style="text-align: left; margin: 30px 0; background: rgba(15, 23, 42, 0.8); padding: 24px; border-radius: 12px; border-left: 4px solid #ef4444;">
          <h4 style="color: #f1f5f9; margin-bottom: 16px; font-size: 1.2rem;">⚡ Acciones Inmediatas:</h4>
          <div style="display: grid; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; color: #e2e8f0;">
              <span style="font-size: 1.5rem;">🌱</span>
              <span>Siembra urgente de especies melíferas en zonas críticas</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; color: #e2e8f0;">
              <span style="font-size: 1.5rem;">🚛</span>
              <span>Redistribución inmediata de colmenas móviles</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; color: #e2e8f0;">
              <span style="font-size: 1.5rem;">📞</span>
              <span>Alerta automática a apicultores locales y autoridades</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; color: #e2e8f0;">
              <span style="font-size: 1.5rem;">🔬</span>
              <span>Monitoreo intensivo satelital durante 30 días</span>
            </div>
          </div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="padding: 14px 28px; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 1rem; transition: all 0.3s ease;">
          PROTOCOLO ACTIVADO
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  }
