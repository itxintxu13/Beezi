import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-beezi-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Beezi Demo - Satellite Monitoring for Pollinator Protection -->
    <div class="beezi-container">
      <!-- branding -->
      <div class="beezi-header">
        <div class="logo-section">
          <h1>🌍🐝 Beezi</h1>
          <p class="tagline">Satellite Monitoring for Pollinator Protection</p>
        </div>
        <div class="status-indicator">
          <div class="pulse-dot"></div>
          <span>Online</span>
        </div>
      </div>

      <!-- rincipal map -->
      <div #mapContainer class="main-map"></div>

      <!-- info panel -->
      <div class="info-panel">
        <div class="panel-header">
          <h3>📊 Ecosystem Status</h3>
        </div>
        
        <div class="panel-content">
          <div class="metric-card">
            <div class="metric-icon">🌺</div>
            <div class="metric-info">
              <span class="metric-value">{{ activeHotspots }}</span>
              <span class="metric-label">Blooming area</span>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">🐝</div>
            <div class="metric-info">
              <span class="metric-value">{{ totalPollinators.toLocaleString() }}</span>
              <span class="metric-label">Active Pollinators</span>
            </div>
          </div>
          
          <div class="metric-card warning">
            <div class="metric-icon">⚠️</div>
            <div class="metric-info">
              <span class="metric-value">{{ riskZones }}</span>
              <span class="metric-label">Risk Zones</span>
            </div>
          </div>

          <div class="predictions-section">
            <h4>🔮 AI Predictions</h4>
            <div class="prediction-item">
              <span class="prediction-icon">🌸</span>
              <span>Peak bloom in Andalucía: 15 days</span>
            </div>
            <div class="prediction-item">
              <span class="prediction-icon">⚡</span>
              <span>Mass migration detected to the north</span>
            </div>
            <div class="prediction-item warning">
              <span class="prediction-icon">🚨</span>
              <span>Shortage expected in Castilla-La Mancha</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Overlay controls -->
      <div class="floating-controls">
        <button class="control-btn" (click)="toggleAnimation()" [class.active]="isAnimating">
          <span class="btn-icon">{{ isAnimating ? '⏸️' : '▶️' }}</span>
          <span class="btn-label">{{ isAnimating ? 'Stop' : 'Run' }}</span>
        </button>
        
        <button class="control-btn" (click)="showTimelapseView()">
          <span class="btn-icon">⏱️</span>
          <span class="btn-label">Timelapse</span>
        </button>
        
        <button class="control-btn emergency" (click)="triggerEmergencyProtocol()">
          <span class="btn-icon">🚨</span>
          <span class="btn-label">Emergency</span>
        </button>
      </div>

      <!-- Legend -->
      <div class="legend">
        <h4>🗺️ Legend</h4>
        <div class="legend-item">
          <div class="legend-color high-bloom"></div>
          <span>High Bloom (>70%)</span>
        </div>
        <div class="legend-item">
          <div class="legend-color medium-bloom"></div>
          <span>Medium Bloom (40-70%)</span>
        </div>
        <div class="legend-item">
          <div class="legend-color low-bloom"></div>
          <span>Low Bloom (<40%)</span>
        </div>
        <div class="legend-item">
          <div class="legend-line pollinator-route"></div>
          <span>Pollinator Routes</span>
        </div>
      </div>

      <!-- Overlay de carga inicial -->
      <div class="loading-overlay" [class.hidden]="!isLoading">
        <div class="loading-content">
          <div class="bee-animation">🐝</div>
          <h2>Initializing Beezi...</h2>
          <p>Loading satellite data and calculating pollinator routes</p>
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="loadingProgress"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
  /* Beezi - Satellite System for Pollinator Protection */
    .beezi-container {
      position: relative;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      background: linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%);
    }

    /* Header con branding */
    .beezi-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: rgba(26, 26, 46, 0.85);
      backdrop-filter: blur(14px) saturate(1.2);
      padding: 10px 28px 10px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 3px 16px 0 rgba(0,255,136,0.08), 0 1px 0 0 #00ff88;
      min-height: 48px;
      border-radius: 0 0 18px 18px;
      font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
    }

    .logo-section h1 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #00ff88;
      background: linear-gradient(135deg, #00d4ff, #00ff88);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 10px rgba(0, 212, 255, 0.2);
      letter-spacing: 0.01em;
    }

    .tagline {
      margin: 0;
      font-size: 0.85rem;
      color: #e0e0e0;
      font-weight: 400;
      opacity: 0.7;
      text-shadow: none;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #00ff88;
      font-weight: 600;
      font-size: 0.95rem;
      text-shadow: none;
    }

    .pulse-dot {
      width: 10px;
      height: 10px;
      background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
      border-radius: 50%;
      animation: pulse 1.2s infinite;
      box-shadow: 0 0 6px #00ff88cc, 0 0 3px #00d4ff99;
      border: 1.5px solid #fff;
    }

    /* Mapa principal */
    .main-map {
      position: absolute;
      top: 80px;
      bottom: 0;
      width: 100%;
      border-radius: 20px 20px 0 0;
      overflow: hidden;
      box-shadow: 0 -5px 30px rgba(0, 0, 0, 0.3);
    }

  /* Floating information panel */
    .info-panel {
      position: absolute;
      bottom: 20px;
      left: 20px;
      width: 320px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(15px);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      z-index: 1000;
    }

    .panel-header {
      padding: 15px 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .panel-header h3 {
      margin: 0;
      color: #2E7D32;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .panel-content {
      padding: 20px;
    }

    .metric-card {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 12px;
      border-left: 4px solid #4CAF50;
      transition: all 0.3s ease;
    }

    .metric-card:hover {
      transform: translateX(5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .metric-card.warning {
      border-left-color: #FF5722;
      background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
    }

    .metric-icon {
      font-size: 2rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 12px;
    }

    .metric-info {
      display: flex;
      flex-direction: column;
    }

    .metric-value {
      font-size: 1.8rem;
      font-weight: 700;
      color: #2E7D32;
      line-height: 1;
    }

    .metric-label {
      font-size: 0.9rem;
      color: #666;
      font-weight: 500;
    }

    .predictions-section {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    .predictions-section h4 {
      margin: 0 0 15px 0;
      color: #2E7D32;
      font-size: 1rem;
      font-weight: 600;
    }

    .prediction-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      margin-bottom: 8px;
      background: rgba(76, 175, 80, 0.1);
      border-radius: 8px;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }

    .prediction-item:hover {
      background: rgba(76, 175, 80, 0.2);
    }

    .prediction-item.warning {
      background: rgba(255, 87, 34, 0.1);
      color: #d84315;
    }

    .prediction-item.warning:hover {
      background: rgba(255, 87, 34, 0.2);
    }

    .prediction-icon {
      font-size: 1.2rem;
    }

    /* Controles flotantes */
    .floating-controls {
      position: absolute;
      top: 90px;
      right: 18px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: 1000;
    }

    .control-btn {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 7px 16px;
      background: linear-gradient(90deg, #00ff88 0%, #00d4ff 100%);
      color: #181828;
      font-size: 0.98rem;
      font-weight: 600;
      border: none;
      border-radius: 10px;
      box-shadow: 0 2px 8px 0 rgba(0,255,136,0.08);
      transition: all 0.18s cubic-bezier(.4,2,.6,1);
      cursor: pointer;
      outline: none;
      letter-spacing: 0.01em;
      min-width: 90px;
      position: relative;
      overflow: hidden;
    }
    .control-btn .btn-icon {
      font-size: 1.1rem;
      filter: drop-shadow(0 0 2px #00ff88cc);
      transition: filter 0.2s;
    }
    .control-btn:hover, .control-btn.active {
      background: linear-gradient(90deg, #00d4ff 0%, #00ff88 100%);
      color: #222;
      box-shadow: 0 4px 16px 0 rgba(0,255,136,0.12);
      transform: translateY(-1.5px) scale(1.03);
    }
    .control-btn:hover .btn-icon, .control-btn.active .btn-icon {
      filter: drop-shadow(0 0 4px #00d4ffcc) brightness(1.1);
    }
    .control-btn.emergency {
      background: linear-gradient(90deg, #ff4444 0%, #ff6666 100%);
      color: #fff;
      font-weight: 600;
      box-shadow: 0 2px 8px 0 rgba(255,68,68,0.10);
      animation: emergencyPulse 1.5s infinite;
    }
    .control-btn.emergency .btn-icon {
      filter: drop-shadow(0 0 3px #ff4444cc);
    }
    .control-btn.emergency:hover {
      background: linear-gradient(90deg, #ff6666 0%, #ff4444 100%);
      color: #fff;
      box-shadow: 0 4px 16px 0 rgba(255,68,68,0.14);
      transform: translateY(-1.5px) scale(1.03);
    }
    .control-btn.emergency:hover .btn-icon {
      filter: drop-shadow(0 0 6px #ff4444cc) brightness(1.1);
    }
    .btn-label {
      font-weight: 600;
      font-size: 0.92rem;
      letter-spacing: 0.005em;
    }

    @keyframes emergencyPulse {
      0%, 100% { box-shadow: 0 0 12px rgba(255, 68, 68, 0.7); }
      50% { box-shadow: 0 0 32px rgba(255, 68, 68, 1); }
    }

    /* Leyenda */
    .legend {
      position: absolute;
      bottom: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(15px);
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      z-index: 1000;
      min-width: 220px;
    }

    .legend h4 {
      margin: 0 0 15px 0;
      color: #2E7D32;
      font-size: 1rem;
      font-weight: 600;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
      font-size: 0.9rem;
      color: #333;
    }

    .legend-color {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .legend-color.high-bloom {
      background: linear-gradient(135deg, #FF1744 0%, #d32f2f 100%);
    }

    .legend-color.medium-bloom {
      background: linear-gradient(135deg, #FF6B35 0%, #f57c00 100%);
    }

    .legend-color.low-bloom {
      background: linear-gradient(135deg, #FFE135 0%, #fdd835 100%);
    }

    .legend-line {
      width: 30px;
      height: 4px;
      background: #4CAF50;
      border-radius: 2px;
    }

    .legend-line.pollinator-route {
      background: repeating-linear-gradient(
        90deg,
        #4CAF50 0px,
        #4CAF50 6px,
        transparent 6px,
        transparent 12px
      );
    }

    /* Overlay de carga */
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(26, 35, 126, 0.95) 0%, rgba(40, 53, 147, 0.95) 100%);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      transition: opacity 0.5s ease, visibility 0.5s ease;
    }

    .loading-overlay.hidden {
      opacity: 0;
      visibility: hidden;
    }

    .loading-content {
      text-align: center;
      color: white;
    }

    .bee-animation {
      font-size: 4rem;
      margin-bottom: 20px;
      animation: float 3s ease-in-out infinite;
    }

    .loading-content h2 {
      margin: 0 0 10px 0;
      font-size: 2rem;
      font-weight: 300;
    }

    .loading-content p {
      margin: 0 0 30px 0;
      opacity: 0.8;
      font-size: 1.1rem;
    }

    .progress-bar {
      width: 300px;
      height: 4px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
      overflow: hidden;
      margin: 0 auto;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%);
      transition: width 0.3s ease;
      border-radius: 2px;
    }

    /* Animaciones */
    @keyframes pulse {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.7;
        transform: scale(1.2);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .beezi-header {
        padding: 10px 15px;
      }

      .logo-section h1 {
        font-size: 1.6rem;
      }

      .info-panel {
        width: calc(100% - 40px);
        left: 20px;
        right: 20px;
      }

      .floating-controls {
        top: 90px;
        right: 10px;
      }

      .control-btn {
        min-width: 120px;
        padding: 10px 12px;
      }

      .legend {
        bottom: 10px;
        right: 10px;
        left: 10px;
        width: auto;
      }
    }
  `]
})
export class BeeziSimple implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef<HTMLDivElement>;

  map!: mapboxgl.Map;
  isAnimating: boolean = false;
  isLoading: boolean = true;
  loadingProgress: number = 0;
  
  // Static metrics for the demo
  activeHotspots: number = 12;
  totalPollinators: number = 156834;
  riskZones: number = 3;

  ngAfterViewInit(): void {
    this.simulateLoading();

    setTimeout(() => {
      this.initializeMap();
    }, 5500);
  }

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
        }, 500);
      }
    }, 1000);
  }

  private initializeMap(): void {
    (mapboxgl as any).accessToken = 'pk.eyJ1Ijoic2FoaXZhIiwiYSI6ImNtZzl3cXFwaDBpOG8ybHNneGFwZ3ZqOTUifQ.UrldzEHRjHkw2CiMeAyR-Q';

    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-3.7038, 40.4168], // Centro de España
      zoom: 6,
      pitch: 45,
      bearing: 0,
      antialias: true
    });

    this.map.on('style.load', () => {
      this.map.setFog({
        'range': [0.8, 8],
        'color': '#f8f0e3',
        'horizon-blend': 0.5
      });
      
      this.addBloomingHotspots();
      this.addPollinatorRoutes();
      this.startAnimations();
    });
  }

  private addBloomingHotspots(): void {
    const hotspots = [
      { lat: 37.1773, lon: -3.5985, intensity: 0.95, name: "Campos de Jaén" },
      { lat: 41.6561, lon: -0.8773, intensity: 0.88, name: "Valle del Ebro" },
      { lat: 40.4637, lon: -3.7492, intensity: 0.72, name: "Sierra de Madrid" },
      { lat: 43.3614, lon: -5.8593, intensity: 0.65, name: "Asturias" },
      { lat: 42.3601, lon: -7.5593, intensity: 0.91, name: "Galicia" },
      { lat: 36.7213, lon: -4.4214, intensity: 0.79, name: "Málaga" },
      { lat: 28.1248, lon: -15.4300, intensity: 0.58, name: "Gran Canaria" },
      { lat: 27.7648, lon: -17.9077, intensity: 0.63, name: "La Palma" },
      { lat: 39.8628, lon: 4.2599, intensity: 0.84, name: "Ibiza" },
      { lat: 37.3886, lon: -5.9823, intensity: 0.77, name: "Sevilla" },
      { lat: 41.3851, lon: 2.1734, intensity: 0.69, name: "Barcelona" },
      { lat: 43.2630, lon: -2.9350, intensity: 0.73, name: "Bilbao" }
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
          intensity: hotspot.intensity
          , status: (hotspot as any).status
        }
      }))
    };

    this.map.addSource('blooming-hotspots', { 
      type: 'geojson', 
      data: geojson as any
    });

    // Capa de mapa de calor
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
          9, 3
        ],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(255, 225, 53, 0)',
          0.2, 'rgba(255, 225, 53, 0.2)',
          0.4, 'rgba(255, 107, 53, 0.4)',
          0.6, 'rgba(255, 23, 68, 0.6)',
          0.8, 'rgba(183, 28, 28, 0.8)'
        ],
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 2,
          9, 20
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

  // Main circles layer
    this.map.addLayer({
      id: 'blooming-circles',
      type: 'circle',
      source: 'blooming-hotspots',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'intensity'],
          0, 10,
          1, 40
        ],
        'circle-color': [
          'case',
          ['==', ['get', 'status'], 'critico'], '#FF1744',
          ['==', ['get', 'status'], 'moderado'], '#FF6B35',
          ['==', ['get', 'status'], 'bajo'], '#FFE135',
          ['interpolate', ['linear'], ['get', 'intensity'], 0, '#FFE135', 0.5, '#FF6B35', 1, '#FF1744']
        ],
        'circle-opacity': 0.7,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FFFFFF',
        'circle-stroke-opacity': 0.8
      }
    }, 'blooming-heatmap');

    // Popups
    this.map.on('click', 'blooming-circles', (e: any) => {
      const properties = e.features[0].properties;
      const coordinates = e.features[0].geometry.coordinates.slice();

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`
          <div style="padding: 10px; max-width: 250px;">
            <h3 style="margin: 0 0 10px 0; color: #2E7D32;">🌺 ${properties.name}</h3>
            <p><strong>📊 Intensity:</strong> ${(properties.intensity * 100).toFixed(0)}%</p>
            <p><strong>🐝 Status:</strong> ${properties.intensity > 0.7 ? 'Óptimo' : 'Moderado'}</p>
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
        properties: { name: "North Route" }
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
        properties: { name: "South Route" }
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
          'line-color': '#4CAF50',
          'line-width': 4,
          'line-opacity': 0.8,
          'line-dasharray': [2, 2]
        }
      });
    });
  }

  private startAnimations(): void {
    this.isAnimating = true;
    this.animateCircles();
  }

  private animateCircles(): void {
    let pulseScale = 1;
    let growing = true;

    const animate = () => {
      if (growing) {
        pulseScale += 0.02;
        if (pulseScale >= 1.3) growing = false;
      } else {
        pulseScale -= 0.02;
        if (pulseScale <= 1) growing = true;
      }

      this.map.setPaintProperty('blooming-circles', 'circle-radius', [
        'interpolate',
        ['linear'],
        ['get', 'intensity'],
        0, 10 * pulseScale,
        1, 40 * pulseScale
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

  showTimelapseView(): void {
  // Simulate quick view of different seasons
    const timelapseSteps = [
      { center: [-3.5985, 37.1773], zoom: 8, duration: 1000 }, // Jaén - Primavera
      { center: [-7.5593, 42.3601], zoom: 8, duration: 1000 }, // Galicia - Verano
      { center: [-4.4214, 36.7213], zoom: 8, duration: 1000 }, // Málaga - Otoño
      { center: [-15.4300, 28.1248], zoom: 8, duration: 1000 }, // Canarias - Invierno
      { center: [-3.7038, 40.4168], zoom: 6, duration: 1500 }  // Volver a España completa
    ];

    let currentStep = 0;
    const executeStep = () => {
      if (currentStep < timelapseSteps.length) {
        const step = timelapseSteps[currentStep];
        this.map.flyTo({
          center: step.center as [number, number],
          zoom: step.zoom,
          speed: 1.2,
          curve: 1.5
        });
        
        setTimeout(() => {
          currentStep++;
          executeStep();
        }, step.duration);
      }
    };

    executeStep();
  }

  triggerEmergencyProtocol(): void {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      background: rgba(0,0,0,0.8); display: flex; justify-content: center; 
      align-items: center; z-index: 10000;
    `;
    
    modal.innerHTML = `
      <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; text-align: center;">
        <h2 style="color: #FF5722; margin-bottom: 20px;">🚨 PROTOCOLO DE EMERGENCIA ACTIVADO</h2>
        <p style="margin-bottom: 20px;">Detectada escasez crítica de recursos florales en ${this.riskZones} zonas.</p>
        <div style="text-align: left; margin: 20px 0;">
          <h4>Acciones Recomendadas:</h4>
          <ul>
            <li>🌱 Urgent planting of nectar-producing species</li>
            <li>🚛 Redistribution of mobile hives</li>
            <li>📞 Alert local beekeepers</li>
            <li>🔬 Intensive monitoring for 30 days</li>
          </ul>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
          ACEPTAR
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
}