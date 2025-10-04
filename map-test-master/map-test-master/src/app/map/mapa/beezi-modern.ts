
          
          <div class="metric-item risk">
            <div class="metric-header">
              <span class="metric-icon">⚠️</span>
              <span class="metric-title">Alertas</span>
            </div>
            <div class="metric-value">{{ riskZones }}</div>
            <div class="metric-subtitle">zonas críticas</div>
            <div class="metric-trend negative">↗ Requiere atención</div>
          </div>
        </div>

        <div class="ai-insights">
          <div class="insights-header">
            <span class="ai-icon">🤖</span>
            <span>Predicciones IA</span>
          </div>
          <div class="insight-item high-priority">
            <div class="insight-icon">🌸</div>
            <div class="insight-content">
              <div class="insight-text">Pico de floración en Andalucía</div>
              <div class="insight-time">en 15 días</div>
            </div>
          </div>
          <div class="insight-item medium-priority">
            <div class="insight-icon">⚡</div>
            <div class="insight-content">
              <div class="insight-text">Migración masiva hacia el norte</div>
              <div class="insight-time">detectada</div>
            </div>
          </div>
          <div class="insight-item critical">
            <div class="insight-icon">🚨</div>
            <div class="insight-content">
              <div class="insight-text">Escasez en Castilla-La Mancha</div>
              <div class="insight-time">prevista</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls flotantes - DISEÑO MODERNO -->
      <div class="control-panel">
        <div class="control-group">
          <button class="control-btn primary" (click)="toggleAnimation()" [class.active]="isAnimating">
            <div class="btn-content">
              <span class="btn-icon">{{ isAnimating ? '⏸️' : '▶️' }}</span>
              <span class="btn-label">{{ isAnimating ? 'Pausar' : 'Iniciar' }}</span>
            </div>
          </button>
          
          <button class="control-btn secondary" (click)="showTimelapseView()">
            <div class="btn-content">
              <span class="btn-icon">⏱️</span>
              <span class="btn-label">Timelapse</span>
            </div>
          </button>
          
          <button class="control-btn emergency" (click)="triggerEmergencyProtocol()">
            <div class="btn-content">
              <span class="btn-icon">🚨</span>
              <span class="btn-label">Emergencia</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Leyenda moderna -->
      <div class="legend-panel">
        <div class="legend-header">
          <span class="legend-icon">🗺️</span>
          <span class="legend-title">Leyenda del Mapa</span>
        </div>
        
        <div class="legend-grid">
          <div class="legend-category">
            <div class="category-title">Intensidad de Floración</div>
            <div class="legend-items">
              <div class="legend-item">
                <div class="legend-symbol">
                  <div class="flower-symbol high">🌺</div>
                </div>
                <span class="legend-text">Alta (>70%)</span>
              </div>
              <div class="legend-item">
                <div class="legend-symbol">
                  <div class="flower-symbol medium">🌼</div>
                </div>
                <span class="legend-text">Media (40-70%)</span>
              </div>
              <div class="legend-item">
                <div class="legend-symbol">
                  <div class="flower-symbol low">🌻</div>
                </div>
                <span class="legend-text">Baja (<40%)</span>
              </div>
            </div>
          </div>
          
          <div class="legend-category">
            <div class="category-title">Rutas de Migración</div>
            <div class="legend-items">
              <div class="legend-item">
                <div class="legend-symbol">
                  <div class="route-line active"></div>
                </div>
                <span class="legend-text">Rutas Activas</span>
              </div>
              <div class="legend-item">
                <div class="legend-symbol">
                  <div class="bee-symbol">🐝</div>
                </div>
                <span class="legend-text">Polinizadores</span>
              </div>
            </div>
          </div>
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

      <!-- Abejas voladoras animadas -->
      <div class="flying-bees" *ngIf="!isLoading">
        <div class="bee-sprite bee-1" [class.flying]="isAnimating">🐝</div>
        <div class="bee-sprite bee-2" [class.flying]="isAnimating">🐝</div>
        <div class="bee-sprite bee-3" [class.flying]="isAnimating">🐝</div>
        <div class="bee-sprite bee-4" [class.flying]="isAnimating">🐝</div>
      </div>
    </div>
  `,
  styles: [`
    /* Beezi - Sistema Satelital Moderno para Protección de Polinizadores */
    
    .beezi-container {
      position: relative;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    }

    /* Header mejorado */
    .beezi-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: linear-gradient(90deg, 
        rgba(16, 185, 129, 0.95) 0%, 
        rgba(5, 150, 105, 0.95) 50%, 
        rgba(4, 120, 87, 0.95) 100%);
      backdrop-filter: blur(20px);
      padding: 20px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 32px rgba(0, 0, 0, 0.3);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo-section h1 {
      margin: 0;
      font-size: 2.5rem;
      font-weight: 800;
      color: #ffffff;
      text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
      letter-spacing: -0.025em;
    }

    .tagline {
      margin: 0;
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 400;
      letter-spacing: 0.025em;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #ffffff;
      font-weight: 600;
      font-size: 0.9rem;
      background: rgba(255, 255, 255, 0.1);
      padding: 8px 16px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .pulse-dot {
      width: 12px;
      height: 12px;
      background: #10b981;
      border-radius: 50%;
      animation: pulse-modern 2s infinite;
      box-shadow: 0 0 15px rgba(16, 185, 129, 0.8);
    }

    /* Mapa principal */
    .main-map {
      position: absolute;
      top: 90px;
      bottom: 0;
      width: 100%;
      border-radius: 24px 24px 0 0;
      overflow: hidden;
      box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.4);
    }

    /* Panel del Ecosistema - Diseño Moderno */
    .ecosystem-panel {
      position: absolute;
      bottom: 30px;
      left: 30px;
      width: 380px;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      border: 1px solid rgba(148, 163, 184, 0.2);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      z-index: 1000;
      overflow: hidden;
    }

    .panel-header {
      padding: 24px 28px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      border-bottom: 1px solid rgba(148, 163, 184, 0.1);
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05));
    }

    .header-icon {
      font-size: 2rem;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }

    .header-content h3 {
      margin: 0;
      color: #f1f5f9;
      font-size: 1.3rem;
      font-weight: 700;
      letter-spacing: -0.025em;
    }

    .location {
      font-size: 0.85rem;
      color: #94a3b8;
      font-weight: 500;
    }

    .status-badge {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      animation: pulse-modern 2s infinite;
    }

    /* Grid de métricas moderno */
    .metrics-grid {
      padding: 24px 28px;
      display: grid;
      gap: 16px;
    }

    .metric-item {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6));
      border-radius: 16px;
      padding: 20px;
      border: 1px solid rgba(148, 163, 184, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .metric-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #10b981, #059669);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .metric-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
      border-color: rgba(16, 185, 129, 0.3);
    }

    .metric-item:hover::before {
      opacity: 1;
    }

    .metric-item.risk::before {
      background: linear-gradient(90deg, #f59e0b, #d97706);
    }

    .metric-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .metric-icon {
      font-size: 1.5rem;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }

    .metric-title {
      color: #cbd5e1;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .metric-value {
      color: #f1f5f9;
      font-size: 2.2rem;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 4px;
    }

    .metric-subtitle {
      color: #94a3b8;
      font-size: 0.85rem;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .metric-trend {
      font-size: 0.8rem;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 8px;
      display: inline-block;
    }

    .metric-trend.positive {
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
    }

    .metric-trend.negative {
      background: rgba(245, 158, 11, 0.2);
      color: #f59e0b;
    }

    /* Insights de IA modernos */
    .ai-insights {
      padding: 0 28px 24px;
    }

    .insights-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      color: #cbd5e1;
      font-weight: 600;
      font-size: 0.95rem;
    }

    .ai-icon {
      font-size: 1.2rem;
    }

    .insight-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      margin-bottom: 8px;
      background: rgba(30, 41, 59, 0.6);
      border-radius: 12px;
      border-left: 3px solid #10b981;
      transition: all 0.3s ease;
    }

    .insight-item:hover {
      background: rgba(30, 41, 59, 0.8);
      transform: translateX(4px);
    }

    .insight-item.critical {
      border-left-color: #f59e0b;
    }

    .insight-icon {
      font-size: 1.3rem;
    }

    .insight-content {
      flex: 1;
    }

    .insight-text {
      color: #f1f5f9;
      font-size: 0.9rem;
      font-weight: 500;
      line-height: 1.4;
    }

    .insight-time {
      color: #94a3b8;
      font-size: 0.8rem;
      font-weight: 500;
    }

    /* Panel de controles moderno */
    .control-panel {
      position: absolute;
      top: 120px;
      right: 30px;
      z-index: 1000;
    }

    .control-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .control-btn {
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 16px;
      padding: 0;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      min-width: 150px;
      overflow: hidden;
    }

    .control-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      border-color: rgba(16, 185, 129, 0.4);
    }

    .control-btn.primary {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1));
    }

    .control-btn.primary.active {
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .control-btn.emergency {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1));
    }

    .control-btn.emergency:hover {
      border-color: rgba(239, 68, 68, 0.4);
    }

    .btn-content {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
    }

    .btn-icon {
      font-size: 1.3rem;
    }

    .btn-label {
      color: #f1f5f9;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .control-btn.primary.active .btn-label {
      color: #ffffff;
    }

    /* Leyenda moderna */
    .legend-panel {
      position: absolute;
      bottom: 30px;
      right: 30px;
      width: 280px;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      border: 1px solid rgba(148, 163, 184, 0.2);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      z-index: 1000;
      overflow: hidden;
    }

    .legend-header {
      padding: 20px 24px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid rgba(148, 163, 184, 0.1);
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05));
    }

    .legend-icon {
      font-size: 1.5rem;
    }

    .legend-title {
      color: #f1f5f9;
      font-weight: 700;
      font-size: 1.1rem;
    }

    .legend-grid {
      padding: 20px 24px;
    }

    .legend-category {
      margin-bottom: 20px;
    }

    .legend-category:last-child {
      margin-bottom: 0;
    }

    .category-title {
      color: #cbd5e1;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .legend-items {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      border-radius: 10px;
      transition: all 0.3s ease;
    }

    .legend-item:hover {
      background: rgba(30, 41, 59, 0.6);
    }

    .legend-symbol {
      width: 32px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .flower-symbol {
      font-size: 1.3rem;
      animation: flower-pulse 3s ease-in-out infinite;
    }

    .flower-symbol.high {
      animation-delay: 0s;
    }

    .flower-symbol.medium {
      animation-delay: 0.5s;
    }

    .flower-symbol.low {
      animation-delay: 1s;
    }

    .route-line {
      width: 24px;
      height: 3px;
      background: linear-gradient(90deg, #10b981, #059669);
      border-radius: 2px;
      position: relative;
    }

    .route-line.active::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, #ffffff, transparent);
      animation: route-flow 2s ease-in-out infinite;
    }

    .bee-symbol {
      font-size: 1.2rem;
      animation: bee-hover 2s ease-in-out infinite;
    }

    .legend-text {
      color: #e2e8f0;
      font-size: 0.85rem;
      font-weight: 500;
    }

    /* Abejas voladoras mejoradas */
    .flying-bees {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 500;
    }

    .bee-sprite {
      position: absolute;
      font-size: 1.5rem;
      opacity: 0;
      transition: opacity 0.5s ease;
      filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));
    }

    .bee-sprite.flying {
      opacity: 1;
      animation: bee-flight 15s linear infinite;
    }

    .bee-1 {
      top: 20%;
      left: -50px;
      animation-delay: 0s;
    }

    .bee-2 {
      top: 40%;
      left: -50px;
      animation-delay: 5s;
    }

    .bee-3 {
      top: 60%;
      left: -50px;
      animation-delay: 10s;
    }

    .bee-4 {
      top: 80%;
      left: -50px;
      animation-delay: 7.5s;
    }

    /* Overlay de carga mejorado */
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, 
        rgba(15, 23, 42, 0.98) 0%, 
        rgba(30, 41, 59, 0.98) 50%, 
        rgba(51, 65, 85, 0.98) 100%);
      backdrop-filter: blur(20px);
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
      font-size: 5rem;
      margin-bottom: 30px;
      animation: bee-loading 3s ease-in-out infinite;
    }

    .loading-content h2 {
      margin: 0 0 15px 0;
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(45deg, #10b981, #059669);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .loading-content p {
      margin: 0 0 40px 0;
      opacity: 0.9;
      font-size: 1.2rem;
      font-weight: 400;
    }

    .progress-bar {
      width: 400px;
      height: 6px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
      overflow: hidden;
      margin: 0 auto;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981 0%, #059669 50%, #047857 100%);
      transition: width 0.5s ease;
      border-radius: 3px;
      box-shadow: 0 0 15px rgba(16, 185, 129, 0.6);
    }

    /* Animaciones modernas */
    @keyframes pulse-modern {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.7;
        transform: scale(1.3);
      }
    }

    @keyframes flower-pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.2);
      }
    }

    @keyframes route-flow {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }

    @keyframes bee-hover {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-3px);
      }
    }

    @keyframes bee-flight {
      0% {
        transform: translateX(-50px) translateY(0px);
      }
      25% {
        transform: translateX(25vw) translateY(-20px);
      }
      50% {
        transform: translateX(50vw) translateY(10px);
      }
      75% {
        transform: translateX(75vw) translateY(-15px);
      }
      100% {
        transform: translateX(calc(100vw + 50px)) translateY(5px);
      }
    }

    @keyframes bee-loading {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
      }
      25% {
        transform: translateY(-30px) rotate(-5deg);
      }
      50% {
        transform: translateY(-20px) rotate(0deg);
      }
      75% {
        transform: translateY(-40px) rotate(5deg);
      }
    }

    /* Responsive design */
    @media (max-width: 1200px) {
      .ecosystem-panel,
      .legend-panel {
        width: 300px;
      }
    }

    @media (max-width: 768px) {
      .beezi-header {
        padding: 15px 20px;
      }

      .logo-section h1 {
        font-size: 2rem;
      }

      .ecosystem-panel {
        width: calc(100% - 40px);
        left: 20px;
        right: 20px;
      }

      .control-panel {
        top: 110px;
        right: 20px;
      }

      .control-btn {
        min-width: 130px;
      }

      .legend-panel {
        bottom: 20px;
        right: 20px;
        left: 20px;
        width: auto;
      }
    }
  `]
})
export class BeeziModern implements AfterViewInit {
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
          this.isAnimating = true; // Iniciar automáticamente las animaciones
        }, 500);
      }
    }, 1000);
  }

  private initializeMap(): void {
    (mapboxgl as any).accessToken = 'pk.eyJ1Ijoic2FoaXZhIiwiYSI6ImNtZzl3cXFwaDBpOG8ybHNneGFwZ3ZqOTUifQ.UrldzEHRjHkw2CiMeAyR-Q';

    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-3.7038, 40.4168],
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
      { lat: 37.1773, lon: -3.5985, intensity: 0.95, name: "Campos de Jaén", flower: "🌺" },
      { lat: 41.6561, lon: -0.8773, intensity: 0.88, name: "Valle del Ebro", flower: "🌻" },
      { lat: 40.4637, lon: -3.7492, intensity: 0.72, name: "Sierra de Madrid", flower: "🌼" },
      { lat: 43.3614, lon: -5.8593, intensity: 0.65, name: "Asturias", flower: "🌸" },
      { lat: 42.3601, lon: -7.5593, intensity: 0.91, name: "Galicia", flower: "🌺" },
      { lat: 36.7213, lon: -4.4214, intensity: 0.79, name: "Málaga", flower: "🌻" },
      { lat: 28.1248, lon: -15.4300, intensity: 0.58, name: "Gran Canaria", flower: "🌼" },
      { lat: 27.7648, lon: -17.9077, intensity: 0.63, name: "La Palma", flower: "🌸" },
      { lat: 39.8628, lon: 4.2599, intensity: 0.84, name: "Ibiza", flower: "🌺" },
      { lat: 37.3886, lon: -5.9823, intensity: 0.77, name: "Sevilla", flower: "🌻" },
      { lat: 41.3851, lon: 2.1734, intensity: 0.69, name: "Barcelona", flower: "🌼" },
      { lat: 43.2630, lon: -2.9350, intensity: 0.73, name: "Bilbao", flower: "🌸" }
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
          flower: hotspot.flower
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

    // Círculos con flores pulsantes
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
          'interpolate',
          ['linear'],
          ['get', 'intensity'],
          0, '#fbbf24',
          0.5, '#f59e0b',
          0.8, '#10b981',
          1, '#059669'
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
                <span style="color: #94a3b8; font-size: 0.9rem;">Intensidad:</span>
                <span style="color: #10b981; font-weight: 600;">${(properties.intensity * 100).toFixed(0)}%</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #94a3b8; font-size: 0.9rem;">Estado:</span>
                <span style="color: ${properties.intensity > 0.7 ? '#10b981' : '#f59e0b'}; font-weight: 600;">
                  ${properties.intensity > 0.7 ? 'Óptimo' : 'Moderado'}
                </span>
              </div>
              <div style="margin-top: 8px; padding: 8px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; border-left: 3px solid #10b981;">
                <span style="color: #e2e8f0; font-size: 0.85rem;">🐝 Polinizadores activos en la zona</span>
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

  showTimelapseView(): void {
    const timelapseSteps = [
      { center: [-3.5985, 37.1773], zoom: 8, duration: 1200 }, // Jaén - Primavera
      { center: [-7.5593, 42.3601], zoom: 8, duration: 1200 }, // Galicia - Verano
      { center: [-4.4214, 36.7213], zoom: 8, duration: 1200 }, // Málaga - Otoño
      { center: [-15.4300, 28.1248], zoom: 8, duration: 1200 }, // Canarias - Invierno
      { center: [-3.7038, 40.4168], zoom: 6, duration: 1800 }  // Volver a España completa
    ];

    let currentStep = 0;
    const executeStep = () => {
      if (currentStep < timelapseSteps.length) {
        const step = timelapseSteps[currentStep];
        this.map.flyTo({
          center: step.center as [number, number],
          zoom: step.zoom,
          speed: 1.5,
          curve: 1.8
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