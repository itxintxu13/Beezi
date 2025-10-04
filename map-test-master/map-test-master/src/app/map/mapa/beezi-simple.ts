import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-beezi-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Beezi Demo - Sistema Satelital para Protección de Polinizadores -->
    <div class="beezi-container">
      <!-- Header con branding -->
      <div class="beezi-header">
        <div class="logo-section">
          <h1>🌍🐝 Beezi</h1>
          <p class="tagline">Sistema Satelital de Protección de Polinizadores</p>
        </div>
        <div class="status-indicator">
          <div class="pulse-dot"></div>
          <span>MONITOREO ACTIVO</span>
        </div>
      </div>

      <!-- Mapa principal -->
      <div #mapContainer class="main-map"></div>

      <!-- Panel de información flotante -->
      <div class="info-panel">
        <div class="panel-header">
          <h3>📊 Estado del Ecosistema - España</h3>
        </div>
        
        <div class="panel-content">
          <div class="metric-card">
            <div class="metric-icon">🌺</div>
            <div class="metric-info">
              <span class="metric-value">{{ activeHotspots }}</span>
              <span class="metric-label">Zonas en Floración</span>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">🐝</div>
            <div class="metric-info">
              <span class="metric-value">{{ totalPollinators.toLocaleString() }}</span>
              <span class="metric-label">Polinizadores Activos</span>
            </div>
          </div>
          
          <div class="metric-card warning">
            <div class="metric-icon">⚠️</div>
            <div class="metric-info">
              <span class="metric-value">{{ riskZones }}</span>
              <span class="metric-label">Zonas de Riesgo</span>
            </div>
          </div>

          <div class="predictions-section">
            <h4>🔮 Predicciones IA</h4>
            <div class="prediction-item">
              <span class="prediction-icon">🌸</span>
              <span>Pico de floración en Andalucía: 15 días</span>
            </div>
            <div class="prediction-item">
              <span class="prediction-icon">⚡</span>
              <span>Migración masiva detectada hacia el norte</span>
            </div>
            <div class="prediction-item warning">
              <span class="prediction-icon">🚨</span>
              <span>Escasez prevista en Castilla-La Mancha</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls flotantes -->
      <div class="floating-controls">
        <button class="control-btn" (click)="toggleAnimation()" [class.active]="isAnimating">
          <span class="btn-icon">{{ isAnimating ? '⏸️' : '▶️' }}</span>
          <span class="btn-label">{{ isAnimating ? 'Pausar' : 'Reproducir' }}</span>
        </button>
        
        <button class="control-btn" (click)="showTimelapseView()">
          <span class="btn-icon">⏱️</span>
          <span class="btn-label">Timelapse</span>
        </button>
        
        <button class="control-btn emergency" (click)="triggerEmergencyProtocol()">
          <span class="btn-icon">🚨</span>
          <span class="btn-label">Emergencia</span>
        </button>
      </div>

      <!-- Leyenda -->
      <div class="legend">
        <h4>🗺️ Leyenda</h4>
        <div class="legend-item">
          <div class="legend-color high-bloom"></div>
          <span>Alta Floración (>70%)</span>
        </div>
        <div class="legend-item">
          <div class="legend-color medium-bloom"></div>
          <span>Media Floración (40-70%)</span>
        </div>
        <div class="legend-item">
          <div class="legend-color low-bloom"></div>
          <span>Baja Floración (<40%)</span>
        </div>
        <div class="legend-item">
          <div class="legend-line pollinator-route"></div>
          <span>Rutas de Polinizadores</span>
        </div>
      </div>

      <!-- Overlay de carga inicial -->
      <div class="loading-overlay" [class.hidden]="!isLoading">
        <div class="loading-content">
          <div class="bee-animation">🐝</div>
          <h2>Inicializando Beezi...</h2>
          <p>Cargando datos satelitales y calculando rutas de polinización</p>
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="loadingProgress"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Beezi - Sistema Satelital para Protección de Polinizadores */
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
      background: linear-gradient(90deg, rgba(46, 125, 50, 0.95) 0%, rgba(67, 160, 71, 0.95) 100%);
      backdrop-filter: blur(10px);
      padding: 15px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
    }

    .logo-section h1 {
      margin: 0;
      font-size: 2.2rem;
      font-weight: 700;
      color: #ffffff;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    .tagline {
      margin: 0;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 300;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #ffffff;
      font-weight: 600;
    }

    .pulse-dot {
      width: 12px;
      height: 12px;
      background: #4CAF50;
      border-radius: 50%;
      animation: pulse 2s infinite;
      box-shadow: 0 0 10px rgba(76, 175, 80, 0.8);
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

    /* Panel de información flotante */
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
      top: 100px;
      right: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 1000;
    }

    .control-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      min-width: 140px;
    }

    .control-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .control-btn.active {
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
      color: white;
    }

    .control-btn.emergency {
      background: linear-gradient(135deg, #FF5722 0%, #e64a19 100%);
      color: white;
    }

    .control-btn.emergency:hover {
      background: linear-gradient(135deg, #d84315 0%, #bf360c 100%);
    }

    .btn-icon {
      font-size: 1.2rem;
    }

    .btn-label {
      font-weight: 600;
      font-size: 0.9rem;
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
  
  // Métricas estáticas para la demo
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

    // Capa principal de círculos
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
          'interpolate',
          ['linear'],
          ['get', 'intensity'],
          0, '#FFE135',
          0.5, '#FF6B35',
          1, '#FF1744'
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
            <p><strong>📊 Intensidad:</strong> ${(properties.intensity * 100).toFixed(0)}%</p>
            <p><strong>🐝 Estado:</strong> ${properties.intensity > 0.7 ? 'Óptimo' : 'Moderado'}</p>
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
    // Simular vista rápida de diferentes estaciones
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
            <li>🌱 Siembra urgente de especies melíferas</li>
            <li>🚛 Redistribución de colmenas móviles</li>
            <li>📞 Alerta a apicultores locales</li>
            <li>🔬 Monitoreo intensivo durante 30 días</li>
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