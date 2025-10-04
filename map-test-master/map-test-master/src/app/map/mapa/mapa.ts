    type: "LineString";
    coordinates: number[][];
  };
  properties: {
    name: string;
    species: string;
    active: boolean;
  };
}

@Component({
  selector: 'app-beezi-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.scss'] 
})
export class Mapa implements AfterViewInit {
  cityQuery: string = '';
  private readonly cityCoords: { [key: string]: [number, number] } = {
    'madrid': [-3.7038, 40.4168],
    'bilbao': [-2.935, 43.263],
    'sevilla': [-5.9845, 37.3891],
    'zaragoza': [-0.8773, 41.6561],
    'malaga': [-4.4214, 36.7213],
    'jaen': [-3.5985, 37.1773],
    'asturias': [-5.8593, 43.3614],
    'galicia': [-7.5593, 42.3601],
    'gran canaria': [-15.43, 28.1248],
    'la palma': [-17.9077, 27.7648]
  };

  goToCity(): void {
    if (!this.cityQuery) return;
    const city = this.cityQuery.trim().toLowerCase();
    if (this.cityCoords[city]) {
      this.map.flyTo({ center: this.cityCoords[city], zoom: 11, speed: 1.2 });
    }
    this.cityQuery = '';
  }
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef<HTMLDivElement>;

  map!: mapboxgl.Map;
  currentMonth: number = 5; // Mayo por defecto
  isAnimating: boolean = false;
  bloomingData: BloomingHotspot[] = [];
  pollinatorRoutes: PollinatorRoute[] = [];
  panelCollapsed: boolean = false;
  isLoading: boolean = true;
  loadingProgress: number = 0;

  // Datos simulados de floración para España
  private readonly bloomingHotspots: BloomingHotspot[] = [
    // Primavera (Abril-Junio)
    { lat: 37.1773, lon: -3.5985, intensity: 0.9, name: "Campos de Jaén", bloomPeriod: "Abril-Mayo", species: ["Olivo", "Romero", "Tomillo"], pollinatorCount: 15000 },
    { lat: 41.6561, lon: -0.8773, intensity: 0.8, name: "Valle del Ebro", bloomPeriod: "Mayo-Junio", species: ["Almendro", "Lavanda"], pollinatorCount: 12000 },
    { lat: 40.4637, lon: -3.7492, intensity: 0.7, name: "Sierra de Madrid", bloomPeriod: "Abril-Junio", species: ["Jara", "Retama"], pollinatorCount: 8000 },
    
    // Verano (Julio-Agosto) 
    { lat: 43.3614, lon: -5.8593, intensity: 0.6, name: "Asturias", bloomPeriod: "Julio-Agosto", species: ["Brezo", "Castaño"], pollinatorCount: 10000 },
    { lat: 42.3601, lon: -7.5593, intensity: 0.8, name: "Galicia", bloomPeriod: "Julio-Septiembre", species: ["Eucalipto", "Mimosa"], pollinatorCount: 14000 },
    
    // Otoño (Septiembre-Octubre)
    { lat: 36.7213, lon: -4.4214, intensity: 0.7, name: "Málaga", bloomPeriod: "Septiembre-Octubre", species: ["Azahar tardío", "Madroño"], pollinatorCount: 9000 },
    
    // Invierno (Noviembre-Febrero)
    { lat: 28.1248, lon: -15.4300, intensity: 0.5, name: "Gran Canaria", bloomPeriod: "Diciembre-Febrero", species: ["Buganvilla", "Tajinaste"], pollinatorCount: 6000 },
    { lat: 27.7648, lon: -17.9077, intensity: 0.6, name: "La Palma", bloomPeriod: "Enero-Marzo", species: ["Flor de almendro"], pollinatorCount: 7000 }
  ];

  ngAfterViewInit(): void {
    // Iniciar simulación de carga
    this.simulateLoading();

    // Continuar con la inicialización del mapa después de la carga
    setTimeout(() => {
      this.initializeMap();
    }, 5500); // Esperar a que termine la animación de carga
  }

  private initializeMap(): void {
    (mapboxgl as any).accessToken = 'pk.eyJ1Ijoic2FoaXZhIiwiYSI6ImNtZzl3cXFwaDBpOG8ybHNneGFwZ3ZqOTUifQ.UrldzEHRjHkw2CiMeAyR-Q';

    // Efecto entrada espacial: inicia muy lejos y con giro
    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [0, 30], // Vista global
      zoom: 1.5,
      pitch: 75,
      bearing: 120,
      antialias: true
    });

    this.map.on('style.load', () => {
      // Añadir niebla atmosférica para efecto dramático
      this.map.setFog({
        'range': [0.8, 8],
        'color': '#f8f0e3',
        'horizon-blend': 0.5
      });

      // Animar a la vista de España con zoom y giro
      setTimeout(() => {
        this.map.flyTo({
          center: [-3.7038, 40.4168],
          zoom: 6,
          pitch: 45,
          bearing: 0,
          speed: 0.7,
          curve: 1.8,
          essential: true
        });
      }, 1200);

      this.initializeBeeziDemo();
    });
  }

  initializeBeeziDemo(): void {
    // Cargar datos de floración actuales
    this.updateBloomingData();
    
    // Crear rutas de polinizadores
    this.createPollinatorRoutes();
    
    // Añadir capas de visualización
    this.addBloomingLayer();
    this.addPollinatorLayer();
    this.addHeatmapLayer();
    
    // Iniciar animación del "pulso de vida"
    this.startBloomPulseAnimation();
    
    // Añadir controles interactivos
    this.addCustomControls();
  }

  updateBloomingData(): void {
    // Filtrar datos según el mes actual
    this.bloomingData = this.bloomingHotspots.filter(hotspot => {
      const bloomMonths = this.getBloomMonths(hotspot.bloomPeriod);
      return bloomMonths.includes(this.currentMonth);
    });
  }

  getBloomMonths(period: string): number[] {
    const monthMap: {[key: string]: number} = {
      'Enero': 1, 'Febrero': 2, 'Marzo': 3, 'Abril': 4, 'Mayo': 5, 'Junio': 6,
      'Julio': 7, 'Agosto': 8, 'Septiembre': 9, 'Octubre': 10, 'Noviembre': 11, 'Diciembre': 12
    };
    
    const months: number[] = [];
    const parts = period.split('-');
    if (parts.length === 2) {
      const start = monthMap[parts[0]];
      const end = monthMap[parts[1]];
      
      for (let i = start; i <= end; i++) {
        months.push(i);
      }
    }
    return months;
  }

  createPollinatorRoutes(): void {
    this.pollinatorRoutes = [
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
        properties: { name: "Ruta Norte", species: "Apis mellifera", active: true }
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
        properties: { name: "Ruta Sur", species: "Apis mellifera", active: true }
      }
    ];
  }

  addBloomingLayer(): void {
    const geojson: FeatureCollection<Point, GeoJsonProperties> = {
      type: "FeatureCollection",
      features: this.bloomingData.map(hotspot => ({
        type: "Feature",
        geometry: { 
          type: "Point", 
          coordinates: [hotspot.lon, hotspot.lat] 
        },
        properties: { 
          name: hotspot.name,
          intensity: hotspot.intensity,
          species: hotspot.species.join(', '),
          pollinatorCount: hotspot.pollinatorCount,
          bloomPeriod: hotspot.bloomPeriod
        }
      }))
    };

    this.map.addSource('blooming-hotspots', { 
      type: 'geojson', 
      data: geojson 
    });

    // Capa principal de hotspots con efecto pulsante
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
          0, '#FFE135', // Amarillo suave
          0.5, '#FF6B35', // Naranja
          1, '#FF1744'   // Rojo intenso
        ],
        'circle-opacity': 0.7,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FFFFFF',
        'circle-stroke-opacity': 0.8
      }
    });

    // Añadir popups informativos
    this.map.on('click', 'blooming-circles', (e) => {
      const properties = e.features![0].properties!;
      const coordinates = (e.features![0].geometry as any).coordinates.slice();

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`
          <div style="padding: 10px; max-width: 250px;">
            <h3 style="margin: 0 0 10px 0; color: #2E7D32;">🌺 ${properties['name']}</h3>
            <p><strong>🌸 Período:</strong> ${properties['bloomPeriod']}</p>
            <p><strong>🌼 Especies:</strong> ${properties['species']}</p>
            <p><strong>🐝 Polinizadores:</strong> ${properties['pollinatorCount'].toLocaleString()}</p>
            <p><strong>📊 Intensidad:</strong> ${(properties['intensity'] * 100).toFixed(0)}%</p>
          </div>
        `)
        .addTo(this.map);
    });
  }

  addPollinatorLayer(): void {
    this.pollinatorRoutes.forEach((route, index) => {
      this.map.addSource(`pollinator-route-${index}`, {
        type: 'geojson',
        data: route
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
          'line-dasharray': [2, 2] // Línea discontinua para simular movimiento
        }
      });

      // Añadir puntos animados que se mueven por las rutas
      this.animatePollinatorMovement(route, index);
    });
  }

  addHeatmapLayer(): void {
    // Crear mapa de calor para mostrar concentración de actividad
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
    }, 'blooming-circles');
  }

  startBloomPulseAnimation(): void {
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

    this.isAnimating = true;
    animate();
  }

  animatePollinatorMovement(route: PollinatorRoute, routeIndex: number): void {
    const coordinates = route.geometry.coordinates;
    let currentPoint = 0;
    let progress = 0;

    const moveIcon = () => {
      if (currentPoint >= coordinates.length - 1) {
        currentPoint = 0;
        progress = 0;
      }

      const startCoord = coordinates[currentPoint];
      const endCoord = coordinates[currentPoint + 1];
      
      if (endCoord) {
        const currentCoord = [
          startCoord[0] + (endCoord[0] - startCoord[0]) * progress,
          startCoord[1] + (endCoord[1] - startCoord[1]) * progress
        ];

        // Crear o actualizar el marcador de abeja
        const beeIcon = document.createElement('div');
        beeIcon.className = 'bee-marker';
        beeIcon.innerHTML = '🐝';
        beeIcon.style.fontSize = '20px';
        beeIcon.style.textShadow = '1px 1px 2px rgba(0,0,0,0.7)';

        if (!this.map.getSource(`bee-${routeIndex}`)) {
          this.map.addSource(`bee-${routeIndex}`, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: currentCoord
              },
              properties: {}
            }
          });

          new mapboxgl.Marker(beeIcon)
            .setLngLat(currentCoord as [number, number])
            .addTo(this.map);
        } else {
          (this.map.getSource(`bee-${routeIndex}`) as mapboxgl.GeoJSONSource).setData({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: currentCoord
            },
            properties: {}
          });
        }

        progress += 0.01;
        if (progress >= 1) {
          currentPoint++;
          progress = 0;
        }
      }

      if (this.isAnimating) {
        setTimeout(moveIcon, 50); // Velocidad de animación
      }
    };

    moveIcon();
  }

  addCustomControls(): void {
    // Control de slider temporal
    const timeControl = document.createElement('div');
    timeControl.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    timeControl.innerHTML = `
      <div style="padding: 10px; background: white; border-radius: 4px; min-width: 200px;">
        <h4 style="margin: 0 0 10px 0; color: #2E7D32;">🕐 Control Temporal</h4>
        <input type="range" min="1" max="12" value="${this.currentMonth}" 
               style="width: 100%;" id="monthSlider">
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-top: 5px;">
          <span>Ene</span><span>Dic</span>
        </div>
        <div id="currentMonth" style="text-align: center; font-weight: bold; margin-top: 5px;">
          ${this.getMonthName(this.currentMonth)}
        </div>
      </div>
    `;

    // Panel de estadísticas
    const statsPanel = document.createElement('div');
    statsPanel.className = 'mapboxgl-ctrl';
    statsPanel.innerHTML = `
      <div style="padding: 15px; background: rgba(255,255,255,0.95); border-radius: 8px; min-width: 250px; backdrop-filter: blur(10px);">
        <h3 style="margin: 0 0 15px 0; color: #2E7D32; text-align: center;">🌍 Beezi Dashboard</h3>
        <div id="stats-content">
          <div style="margin-bottom: 10px;">
            <strong>🌺 Hotspots Activos:</strong> <span id="active-hotspots">${this.bloomingData.length}</span>
          </div>
          <div style="margin-bottom: 10px;">
            <strong>🐝 Polinizadores Totales:</strong> <span id="total-pollinators">${this.getTotalPollinators().toLocaleString()}</span>
          </div>
          <div style="margin-bottom: 10px;">
            <strong>⚠️ Zonas de Riesgo:</strong> <span id="risk-zones">${this.getRiskZones()}</span>
          </div>
          <div style="margin-bottom: 15px;">
            <strong>📈 Estado General:</strong> <span id="general-status" style="color: #4CAF50;">ESTABLE</span>
          </div>
          <button id="emergency-btn" style="width: 100%; padding: 8px; background: #FF5722; color: white; border: none; border-radius: 4px; cursor: pointer;">
            🚨 Protocolo Emergencia
          </button>
        </div>
      </div>
    `;

    this.map.addControl({
      onAdd: () => timeControl,
      onRemove: () => {}
    } as any, 'top-left');

    this.map.addControl({
      onAdd: () => statsPanel,
      onRemove: () => {}
    } as any, 'top-right');

    // Event listeners
    setTimeout(() => {
      const slider = document.getElementById('monthSlider') as HTMLInputElement;
      const monthDisplay = document.getElementById('currentMonth')!;
      const emergencyBtn = document.getElementById('emergency-btn')!;

      slider?.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        this.currentMonth = parseInt(target.value);
        monthDisplay.textContent = this.getMonthName(this.currentMonth);
        this.updateVisualization();
      });

      emergencyBtn?.addEventListener('click', () => {
        this.triggerEmergencyProtocol();
      });
    }, 1000);
  }

  updateVisualization(): void {
    this.updateBloomingData();
    
    const geojson: FeatureCollection<Point, GeoJsonProperties> = {
      type: "FeatureCollection",
      features: this.bloomingData.map(hotspot => ({
        type: "Feature",
        geometry: { 
          type: "Point", 
          coordinates: [hotspot.lon, hotspot.lat] 
        },
        properties: { 
          name: hotspot.name,
          intensity: hotspot.intensity,
          species: hotspot.species.join(', '),
          pollinatorCount: hotspot.pollinatorCount,
          bloomPeriod: hotspot.bloomPeriod
        }
      }))
    };

    (this.map.getSource('blooming-hotspots') as mapboxgl.GeoJSONSource)?.setData(geojson);
    
    // Actualizar estadísticas
    setTimeout(() => {
      const activeHotspotsEl = document.getElementById('active-hotspots');
      const totalPollinatorsEl = document.getElementById('total-pollinators');
      const riskZonesEl = document.getElementById('risk-zones');
      
      if (activeHotspotsEl) activeHotspotsEl.textContent = this.bloomingData.length.toString();
      if (totalPollinatorsEl) totalPollinatorsEl.textContent = this.getTotalPollinators().toLocaleString();
      if (riskZonesEl) riskZonesEl.textContent = this.getRiskZones().toString();
    }, 100);
  }

  getTotalPollinators(): number {
    return this.bloomingData.reduce((total, hotspot) => total + hotspot.pollinatorCount, 0);
  }

  getRiskZones(): number {
    return this.bloomingData.filter(hotspot => hotspot.intensity < 0.4).length;
  }

  getMonthName(month: number): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month - 1];
  }

  triggerEmergencyProtocol(): void {
    // Simular protocolo de emergencia
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      background: rgba(0,0,0,0.8); display: flex; justify-content: center; 
      align-items: center; z-index: 10000;
    `;
    
    modal.innerHTML = `
      <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; text-align: center;">
        <h2 style="color: #FF5722; margin-bottom: 20px;">🚨 PROTOCOLO DE EMERGENCIA ACTIVADO</h2>
        <p style="margin-bottom: 20px;">Detectada escasez crítica de recursos florales en ${this.getRiskZones()} zonas.</p>
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

  togglePanel(): void {
    this.panelCollapsed = !this.panelCollapsed;
  }

  toggleAnimation(): void {
    this.isAnimating = !this.isAnimating;
    if (this.isAnimating) {
      this.startBloomPulseAnimation();
    }
  }

  showTimelapseView(): void {
    // Simular vista de timelapse acelerada
    let month = 1;
    const timelapseInterval = setInterval(() => {
      this.currentMonth = month;
      this.updateVisualization();
      month++;
      
      if (month > 12) {
        clearInterval(timelapseInterval);
        this.currentMonth = 5; // Volver a mayo
        this.updateVisualization();
      }
    }, 800);
  }

  private simulateLoading(): void {
    // Simular proceso de carga
    const loadingSteps = [
      { progress: 20, message: "Conectando con satélites..." },
      { progress: 40, message: "Procesando imágenes MODIS..." },
      { progress: 60, message: "Analizando datos de floración..." },
      { progress: 80, message: "Calculando rutas de polinizadores..." },
      { progress: 100, message: "¡Demo lista!" }
    ];

    let currentStep = 0;
    const loadingInterval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        this.loadingProgress = loadingSteps[currentStep].progress;
        currentStep++;
      } else {
        clearInterval(loadingInterval);
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      }
    }, 1000);
  }

  // Función que llama a la API de Mapbox para geocodificar y volar al lugar  
  async flyToRegion(name: string) {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(name)}.json?access_token=pk.eyJ1Ijoic2FoaXZhIiwiYSI6ImNtZzl3cXFwaDBpOG8ybHNneGFwZ3ZqOTUifQ.UrldzEHRjHkw2CiMeAyR-Q`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        this.map.flyTo({
          center: [lng, lat],
          zoom: 8,
          speed: 0.8,
          curve: 1.5
        });
      } else {
        alert('No se encontró la región');
      }
    } catch (error) {
      console.error('Error geocodificando la región:', error);
      alert('Error buscando la región');
    }
  }
}
