import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import * as mapboxgl from 'mapbox-gl';
import { BeeziIaPanelComponent } from './beezi-ia-panel';

@Component({
  selector: 'app-beezi-ultimate',
  standalone: true,
  imports: [CommonModule, FormsModule, BeeziIaPanelComponent],
  template: `
    <div class="space-view beezi-ux" style="position:relative;width:100vw;height:100vh;overflow:hidden;">
      <div #spaceGlobeMap id="space-globe-map" style="width:100vw;height:100vh;position:absolute;left:0;top:0;z-index:1;"></div>
      <div class="top-controls glassmorph">
        <button (click)="goToLanding()" class="back-to-space ux-btn" title="Volver al Espacio">🌍 <span class="hide-mobile">Volver al Espacio</span></button>
        <div class="region-info">
          <h2>📍 {{currentRegion}}</h2>
          <span class="region-status">{{regionStatus}}</span>
        </div>
        <div class="view-controls">
          <button (click)="toggleTimelapseMode()" [class.active]="timelapseMode" class="control-btn ux-btn" title="Timelapse">
            <span class="btn-icon">⏯️</span> <span class="btn-label hide-mobile">{{timelapseMode ? 'Pausar' : 'Timelapse'}}</span>
          </button>
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
          <div class="metrics-grid">
            <div class="metric-card"><div class="metric-icon">🐝</div><div class="metric-info"><span class="metric-value">{{stats.pollinators}}</span><span class="metric-label">Polinizadores</span><span class="metric-trend positive">↗ +{{stats.pollinatorsTrend}}%</span></div></div>
            <div class="metric-card"><div class="metric-icon">🌺</div><div class="metric-info"><span class="metric-value">{{stats.activeZones}}</span><span class="metric-label">Zonas Activas</span><span class="metric-trend positive">↗ +{{stats.zonesTrend}}%</span></div></div>
            <div class="metric-card"><div class="metric-icon">⚠️</div><div class="metric-info"><span class="metric-value">{{stats.alerts}}</span><span class="metric-label">Alertas</span><span class="metric-trend negative">↘ -{{stats.alertsTrend}}%</span></div></div>
            <div class="metric-card"><div class="metric-icon">🎯</div><div class="metric-info"><span class="metric-value">{{stats.efficiency}}%</span><span class="metric-label">Eficiencia</span><span class="metric-trend positive">↗ +{{stats.efficiencyTrend}}%</span></div></div>
          </div>
          <div class="ai-predictions predictions-section">
            <h4>🤖 Predicciones IA</h4>
            <div class="prediction-item priority-high"><span class="prediction-icon">🌺</span><span class="prediction-text"> 
            Peak bloom in Andalucía: 15 days</span></div><div class="prediction-item priority-medium"><span class="prediction-icon">⚡</span><span class="prediction-text">Risk of shortage in Castilla-La Mancha</span></div>
            <div class="prediction-item priority-medium"><span class="prediction-icon">🛣️</span><span class="prediction-text">Massive migration </span></div>
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
      <div class="bee-layer">
        <div *ngFor="let bee of activeBees; trackBy: trackBee" class="bee-follower bee-marker" [style.transform]="'translate(' + bee.x + 'px, ' + bee.y + 'px)'"
 [style.transition]="'transform ' + bee.speed + 'ms linear'" title="Abeja en ruta">🐝</div>
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
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    /* VISTA DEL ESPACIO */
    .space-view {
      height: 100vh;
      background: radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f0f 100%);
      position: relative;
      overflow: hidden;
    }

    .earth-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      height: 400px;
    }

    .earth-sphere {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      position: relative;
      overflow: hidden;
      box-shadow: 
        0 0 50px rgba(100, 200, 255, 0.3),
        inset -20px -20px 50px rgba(0, 0, 0, 0.5);
    }

    .earth-sphere.spinning {
      animation: earthRotation 20s linear infinite;
    }

    @keyframes earthRotation {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .earth-surface {
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, 
        #2E8B57 0%, #228B22 25%, #8FBC8F 50%, #4682B4 75%, #1E90FF 100%);
      background-size: 200% 200%;
      animation: earthSurface 30s ease-in-out infinite;
    }

    @keyframes earthSurface {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .clouds {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="30" r="8" fill="rgba(255,255,255,0.3)"/><circle cx="40" cy="20" r="12" fill="rgba(255,255,255,0.2)"/><circle cx="70" cy="40" r="10" fill="rgba(255,255,255,0.25)"/></svg>');
      animation: cloudMovement 40s linear infinite;
    }

    @keyframes cloudMovement {
      from { transform: translateX(-100%); }
      to { transform: translateX(100%); }
    }

    .space-ui {
      position: absolute;
      top: 50px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      color: white;
      z-index: 10;
    }

    .beezi-logo h1 {
      font-size: 3rem;
      margin: 0;
      background: linear-gradient(135deg, #00d4ff, #00ff88);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
    }

    .beezi-logo p {
      font-size: 1.2rem;
      margin: 10px 0 40px;
      opacity: 0.8;
    }

    .search-container {
      margin: 40px 0;
    }

    .search-box {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      justify-content: center;
    }

    .region-search {
      padding: 15px 20px;
      font-size: 1.1rem;
      border: none;
      border-radius: 25px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      backdrop-filter: blur(10px);
      width: 300px;
      outline: none;
      transition: all 0.3s ease;
    }

    .region-search:focus {
      background: rgba(255, 255, 255, 0.2);
      box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
    }

    .region-search::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    .search-btn {
      padding: 15px 25px;
      background: linear-gradient(135deg, #00d4ff, #00ff88);
      border: none;
      border-radius: 25px;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .search-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 5px 15px rgba(0, 212, 255, 0.4);
    }

    .quick-regions {
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .quick-region-btn {
      padding: 10px 15px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(5px);
    }

    .quick-region-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .space-stats {
      display: flex;
      gap: 30px;
      justify-content: center;
      margin-top: 50px;
    }

    .stat-item {
      text-align: center;
      background: rgba(255, 255, 255, 0.1);
      padding: 20px;
      border-radius: 15px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .stat-number {
      display: block;
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .stat-label {
      font-size: 0.9rem;
      opacity: 0.8;
    }

    /* VISTA DEL MAPA */
    .map-view {
      height: 100vh;
      position: relative;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }

    .top-controls {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      background: rgba(26, 26, 46, 0.9);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 100;
    }

    .back-to-space {
      padding: 10px 20px;
      background: linear-gradient(135deg, #00d4ff, #00ff88);
      border: none;
      border-radius: 20px;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .back-to-space:hover {
      transform: scale(1.05);
    }

    .region-info h2 {
      margin: 0;
      color: white;
      font-size: 1.5rem;
    }

    .region-status {
      color: #00ff88;
      font-size: 0.9rem;
    }

    .view-controls {
      display: flex;
      gap: 10px;
    }

    .control-btn {
      padding: 10px 15px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 15px;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(5px);
    }

    .control-btn:hover, .control-btn.active {
      background: rgba(0, 212, 255, 0.3);
      border-color: #00d4ff;
    }

    .emergency-btn {
      padding: 10px 15px;
      background: linear-gradient(135deg, #ff4444, #ff6666);
      border: none;
      border-radius: 15px;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      animation: emergencyPulse 2s infinite;
    }

    @keyframes emergencyPulse {
      0%, 100% { box-shadow: 0 0 5px rgba(255, 68, 68, 0.5); }
      50% { box-shadow: 0 0 20px rgba(255, 68, 68, 0.8); }
    }

    .mapbox-map {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }

    /* PANELES FLOTANTES MOVIBLES */
    .floating-panel {
      position: absolute;
      background: rgba(26, 26, 46, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 15px;
      min-width: 300px;
      max-width: 400px;
      z-index: 50;
      cursor: move;
      transition: transform 0.1s ease;
    }

    .floating-panel:hover {
      box-shadow: 0 10px 30px rgba(0, 212, 255, 0.2);
    }

    .ecosystem-panel {
      top: 100px;
      left: 20px;
    }

    .legend-panel {
      top: 100px;
      right: 20px;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      background: rgba(0, 212, 255, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 15px 15px 0 0;
      cursor: move;
    }

    .panel-title {
      color: white;
      font-weight: bold;
      font-size: 1.1rem;
    }

    .panel-controls {
      display: flex;
      gap: 5px;
    }

    .minimize-btn, .close-btn {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: 50%;
      width: 25px;
      height: 25px;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .minimize-btn:hover {
      background: rgba(0, 212, 255, 0.3);
    }

    .close-btn:hover {
      background: rgba(255, 68, 68, 0.3);
    }

    .panel-content {
      padding: 20px;
      color: white;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 20px;
    }

    .metric-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      padding: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.3s ease;
    }

    .metric-card:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    .metric-icon {
      font-size: 1.5rem;
    }

    .metric-info {
      display: flex;
      flex-direction: column;
    }

    .metric-value {
      font-size: 1.2rem;
      font-weight: bold;
      color: #00ff88;
    }

    .metric-label {
      font-size: 0.8rem;
      opacity: 0.8;
    }

    .metric-trend {
      font-size: 0.7rem;
      margin-top: 2px;
    }

    .metric-trend.positive {
      color: #00ff88;
    }

    .metric-trend.negative {
      color: #ff6666;
    }

    .ai-predictions h4 {
      margin: 0 0 10px;
      color: #00d4ff;
    }

    .prediction-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      margin: 5px 0;
      border-radius: 8px;
      font-size: 0.9rem;
    }

    .prediction-item.priority-high {
      background: rgba(255, 68, 68, 0.2);
      border-left: 3px solid #ff4444;
    }

    .prediction-item.priority-medium {
      background: rgba(255, 165, 0, 0.2);
      border-left: 3px solid #ffa500;
    }

    .prediction-item.priority-low {
      background: rgba(255, 255, 0, 0.2);
      border-left: 3px solid #ffff00;
    }

    .legend-section {
      margin-bottom: 20px;
    }

    .legend-section h4 {
      margin: 0 0 10px;
      color: #00d4ff;
      font-size: 1rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 8px 0;
      font-size: 0.9rem;
    }

    .legend-symbol {
      font-size: 1.2rem;
      width: 20px;
      text-align: center;
    }

    .legend-line {
      width: 20px;
      height: 3px;
      border-radius: 2px;
    }

    .legend-line.active-route {
      background: linear-gradient(90deg, #00d4ff, #00ff88);
      animation: routeFlow 2s linear infinite;
    }

    @keyframes routeFlow {
      0% { opacity: 0.5; }
      50% { opacity: 1; }
      100% { opacity: 0.5; }
    }

    .legend-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .legend-dot.optimal {
      background: #00ff88;
    }

    .legend-dot.warning {
      background: #ffa500;
    }

    .legend-dot.critical {
      background: #ff4444;
    }

    /* ABEJAS SIGUIENDO RUTAS */
    .bee-layer {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 30;
    }

    .bee-follower {
      position: absolute;
      font-size: 1.2rem;
      z-index: 31;
      filter: drop-shadow(0 0 5px rgba(255, 255, 0, 0.5));
    }

    /* MODAL DE EMERGENCIA */
    .emergency-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
      backdrop-filter: blur(5px);
    }

    .emergency-content {
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      border: 2px solid #ff4444;
      border-radius: 20px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(255, 68, 68, 0.3);
    }

    .emergency-header {
      background: linear-gradient(135deg, #ff4444, #ff6666);
      padding: 20px;
      border-radius: 18px 18px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .emergency-header h2 {
      margin: 0;
      color: white;
      font-size: 1.5rem;
    }

    .emergency-body {
      padding: 20px;
      color: white;
    }

    .alert-section, .action-section, .timeline-section {
      margin-bottom: 25px;
    }

    .alert-section h3, .action-section h3, .timeline-section h3 {
      color: #ff6666;
      margin-bottom: 10px;
    }

    .action-item {
      padding: 8px 12px;
      margin: 5px 0;
      border-radius: 8px;
      font-size: 0.9rem;
    }

    .action-item.completed {
      background: rgba(0, 255, 136, 0.2);
      border-left: 3px solid #00ff88;
    }

    .action-item.in-progress {
      background: rgba(255, 165, 0, 0.2);
      border-left: 3px solid #ffa500;
    }

    .action-item.pending {
      background: rgba(255, 255, 255, 0.1);
      border-left: 3px solid #666;
    }

    .timeline-item {
      padding: 5px 0;
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .timeline-item.current {
      color: #00ff88;
      font-weight: bold;
      opacity: 1;
    }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .top-controls {
        flex-direction: column;
        gap: 10px;
        padding: 10px;
      }

      .view-controls {
        justify-content: center;
      }

      .floating-panel {
        position: relative;
        margin: 10px;
        width: calc(100% - 20px);
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }

      .space-stats {
        flex-direction: column;
        align-items: center;
      }

      .quick-regions {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class BeeziUltimateComponent implements OnInit, AfterViewInit, OnDestroy {
  showAdvancedUI = false;
  @ViewChild('spaceGlobeMap', { static: false }) spaceGlobeMap?: ElementRef<HTMLDivElement>;
  spaceGlobe?: mapboxgl.Map;
  // Estados principales
  viewMode: 'space' | 'map' = 'space';
  currentRegion = '';
  regionStatus = '';
  isLoading = true;
  timelapseMode = false;
  showEmergency = false;

  // Search
  searchQuery = '';
  quickRegions = [
    { name: 'España', flag: '🇪🇸', coordinates: [-3.7492, 40.4637] },
    { name: 'Francia', flag: '🇫🇷', coordinates: [2.2137, 46.2276] },
    { name: 'Italia', flag: '🇮🇹', coordinates: [12.5674, 41.8719] },
    { name: 'Alemania', flag: '🇩🇪', coordinates: [10.4515, 51.1657] }
  ];

  // Sistema de paneles
  panels = {
    ecosystem: false,
    legend: false
  };

  panelStates = {
    ecosystem: { minimized: false },
    legend: { minimized: false }
  };

  panelPositions = {
    ecosystem: { x: 20, y: 100 },
    legend: { x: window.innerWidth - 420, y: 100 }
  };

  // Drag & Drop
  dragging = {
    panel: '',
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0
  };

  // Statistics
  stats = {
    pollinators: '157K',
    pollinatorsTrend: 18,
    activeZones: 12,
    zonesTrend: 8,
    alerts: 3,
    alertsTrend: 12,
    efficiency: 89,
    efficiencyTrend: 5
  };

  // Mapbox
  map!: mapboxgl.Map;
  
  // Abejas en rutas
  activeBees: any[] = [];
  beeRoutes: any[] = [];
  animationFrameId?: number;

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {}
  goToLanding() {
    this.router.navigate(['/']);
  }

  ngOnInit() {
    // Leer query param 'q' para centrar el mapa si viene de landing
    this.route.queryParams.subscribe(params => {
      const region = params['q'];
      // Siempre mostrar los paneles y la IA al entrar desde el buscador
      this.panels.ecosystem = true;
      this.panels.legend = true;
      if (region) {
        this.currentRegion = region;
        this.regionStatus = 'Cargando datos satelitales...';
        this.viewMode = 'map';
        setTimeout(() => {
          // Geocode the region and center the map
          this.geocodeAndInitMap(region);
          this.regionStatus = 'Monitoreo activo - Estado óptimo';
        }, 1000);
      } else {
  // Initialize after 3 seconds
        setTimeout(() => {
          this.isLoading = false;
        }, 3000);
        // Configurar rutas de abejas
        this.setupBeeRoutes();
      }
    });
  }

  async geocodeAndInitMap(region: string) {
    // Usar Mapbox Geocoding API para obtener coordenadas
    try {
  const token = window.__env__?.MAPBOX_TOKEN || '';
  const resp = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(region)}.json?access_token=${encodeURIComponent(token)}`);
      const data = await resp.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        this.initializeMap([lng, lat]);
      } else {
        // Si no se encuentra, usar centro por defecto
        this.initializeMap();
      }
    } catch (e) {
      console.error('Error geocodificando la región', e);
      this.initializeMap();
    }
  }

  ngAfterViewInit() {
    // Configurar event listeners para drag & drop
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
    // Inicializar globo 3D si estamos en modo espacio
    setTimeout(() => {
      if (this.viewMode === 'space' && this.spaceGlobeMap && !this.spaceGlobe) {
  (mapboxgl as any).accessToken = window.__env__?.MAPBOX_TOKEN || '';
        this.spaceGlobe = new mapboxgl.Map({
          container: this.spaceGlobeMap.nativeElement,
          style: 'mapbox://styles/mapbox/satellite-v9',
          center: [0, 20],
          zoom: 1.2,
          projection: 'globe',
          pitch: 0,
          bearing: 0,
          antialias: true
        });
        this.spaceGlobe.on('style.load', () => {
          this.spaceGlobe!.setFog({
            'color': 'white',
            'horizon-blend': 0.5
          });
        });
      }
    }, 200);
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  // SEARCH AND NAVIGATION

  async flyToRegion() {
    if (!this.searchQuery.trim()) return;
    const region = this.searchQuery.trim();
    let coords: [number, number] = [0, 20];
    try {
  const token = window.__env__?.MAPBOX_TOKEN || '';
  const resp = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(region)}.json?access_token=${encodeURIComponent(token)}`);
      const data = await resp.json();
      if (data.features && data.features.length > 0) {
        coords = data.features[0].center;
      }
    } catch {}
    // Animar el globo antes de entrar
    if (this.spaceGlobe) {
      this.spaceGlobe.flyTo({
        center: coords,
        zoom: 6.5,
        speed: 1.2,
        curve: 1.8,
        essential: true,
        bearing: 20 + Math.random() * 40,
        pitch: 45
      });
    }
    setTimeout(() => {
      this.currentRegion = region;
      this.regionStatus = 'Cargando datos satelitales...';
      this.showAdvancedUI = true;
      setTimeout(() => {
        this.initializeMap(coords);
  this.regionStatus = 'Active monitoring - Optimal state';
      }, 1000);
    }, 1600);
  }

  async flyToQuickRegion(region: any) {
    let coords: [number, number] = region.coordinates || [0, 20];
    if (this.spaceGlobe) {
      this.spaceGlobe.flyTo({
        center: coords,
        zoom: 6.5,
        speed: 1.2,
        curve: 1.8,
        essential: true,
        bearing: 20 + Math.random() * 40,
        pitch: 45
      });
    }
    setTimeout(() => {
      this.currentRegion = region.name;
      this.regionStatus = 'Cargando datos satelitales...';
      this.viewMode = 'map';
      setTimeout(() => {
        this.initializeMap(coords);
  this.regionStatus = 'Active monitoring - Optimal state';
      }, 1000);
    }, 1600);
  }



  goBackToSpace() {
    this.viewMode = 'space';
    this.searchQuery = '';
    this.panels.ecosystem = false;
    this.panels.legend = false;
    if (this.map) {
      this.map.remove();
    }
    // Destruir el globo anterior si existe
    setTimeout(() => {
      if (this.spaceGlobeMap && this.spaceGlobe) {
        this.spaceGlobe.remove();
        this.spaceGlobe = undefined;
      }
      // Inicializar el globo de nuevo
      setTimeout(() => {
        if (this.spaceGlobeMap && !this.spaceGlobe) {
          (mapboxgl as any).accessToken = window.__env__?.MAPBOX_TOKEN || '';
          this.spaceGlobe = new mapboxgl.Map({
            container: this.spaceGlobeMap.nativeElement,
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [0, 20],
            zoom: 1.2,
            projection: 'globe',
            pitch: 0,
            bearing: 0,
            antialias: true
          });
          this.spaceGlobe.on('style.load', () => {
            this.spaceGlobe!.setFog({
              'color': 'white',
              'horizon-blend': 0.5
            });
          });
        }
      }, 200);
    }, 200);
  }

  // MAP INITIALIZATION
  initializeMap(center: [number, number] = [-3.7492, 40.4637]) {
    // Usar SIEMPRE el mismo contenedor del globo 3D
    if (this.spaceGlobe) {
      this.spaceGlobe.flyTo({
        center: center,
        zoom: 6,
        pitch: 45,
        duration: 2000,
        essential: true
      });
      setTimeout(() => {
        this.addHotspots();
        this.addRoutes();
        this.startBeeAnimation();
      }, 1200);
    }
  }

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

    // Agregar source y layer para hotspots
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

  // Pulsating circles layer
    // (Capa de hotspots pendiente de definir)
  }

  addRoutes() {
  // Migration routes between hotspots
    const routes = [
      { from: [-5.9842, 37.3891], to: [-3.6032, 37.1760] }, // Sevilla -> Jaén
  { from: [-3.6032, 37.1760], to: [-4.4214, 36.7213] }, // Jaen -> Malaga
  { from: [-4.4214, 36.7213], to: [-1.1307, 37.9922] }, // Malaga -> Murcia
      { from: [-1.1307, 37.9922], to: [-0.3763, 39.4699] }, // Murcia -> Valencia
      { from: [-0.3763, 39.4699], to: [2.1734, 41.3851] },  // Valencia -> Barcelona
      { from: [2.1734, 41.3851], to: [-3.7492, 40.4637] },  // Barcelona -> Madrid
      { from: [-3.7492, 40.4637], to: [-8.5460, 42.8805] }  // Madrid -> A Coruña
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

    // Guardar rutas para las abejas
    this.beeRoutes = routes;
  }

  // SISTEMA DE ABEJAS SIGUIENDO RUTAS
  setupBeeRoutes() {
    this.activeBees = [
      { id: 1, routeIndex: 0, progress: 0, speed: 3000, x: 0, y: 0 },
      { id: 2, routeIndex: 1, progress: 0.3, speed: 2500, x: 0, y: 0 },
      { id: 3, routeIndex: 2, progress: 0.6, speed: 3500, x: 0, y: 0 },
      { id: 4, routeIndex: 3, progress: 0.9, speed: 2800, x: 0, y: 0 }
    ];
  }

  startBeeAnimation() {
    if (this.viewMode !== 'map' || !this.map || this.beeRoutes.length === 0) return;

    const animateBees = () => {
      this.activeBees.forEach(bee => {
        if (bee.routeIndex >= this.beeRoutes.length) return;

        const route = this.beeRoutes[bee.routeIndex];
        const fromPoint = this.map.project(route.from);
        const toPoint = this.map.project(route.to);

  // Calculate interpolated position
        bee.x = fromPoint.x + (toPoint.x - fromPoint.x) * bee.progress;
        bee.y = fromPoint.y + (toPoint.y - fromPoint.y) * bee.progress;

        // Avanzar progreso
        bee.progress += 0.005;

  // If reached the end of the route, switch to the next one
        if (bee.progress >= 1) {
          bee.progress = 0;
          bee.routeIndex = (bee.routeIndex + 1) % this.beeRoutes.length;
        }
      });

      if (this.viewMode === 'map') {
        this.animationFrameId = requestAnimationFrame(animateBees);
      }
    };

    animateBees();
  }

  trackBee(index: number, bee: any) {
    return bee.id;
  }

  // SISTEMA DE PANELES MOVIBLES
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
  }

  onMouseMove(event: MouseEvent) {
    if (!this.dragging.panel) return;

    const deltaX = event.clientX - this.dragging.startX;
    const deltaY = event.clientY - this.dragging.startY;

    const panel = this.dragging.panel as 'ecosystem' | 'legend';
    this.panelPositions[panel].x = this.dragging.startPosX + deltaX;
    this.panelPositions[panel].y = this.dragging.startPosY + deltaY;

    // Limitar a los bordes de la pantalla
    this.panelPositions[panel].x = Math.max(0, Math.min(window.innerWidth - 320, this.panelPositions[panel].x));
    this.panelPositions[panel].y = Math.max(70, Math.min(window.innerHeight - 200, this.panelPositions[panel].y));
  }

  onMouseUp() {
    this.dragging.panel = '';
  }

  // CONTROLES
  toggleTimelapseMode() {
    this.timelapseMode = !this.timelapseMode;
    if (this.timelapseMode && this.map) {
  // Simulate timelapse with automatic rotation
      let bearing = 0;
      const rotateMap = () => {
        if (!this.timelapseMode) return;
        bearing += 0.5;
        this.map.rotateTo(bearing, { duration: 100 });
        setTimeout(rotateMap, 100);
      };
      rotateMap();
    }
  }

  showEmergencyProtocol() {
    this.showEmergency = true;
  }

  hideEmergencyProtocol() {
    this.showEmergency = false;
  }
}