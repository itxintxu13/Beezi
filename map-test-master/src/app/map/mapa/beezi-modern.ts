// import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
// import mapboxgl from 'mapbox-gl';


// @Component({
//   selector: 'app-beezi-modern',
//   templateUrl: './mapa.html',
//   styleUrls: ['./mapa.scss'] 
// })
// export class BeeziModern implements AfterViewInit {
//   @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef<HTMLDivElement>;

//   map!: mapboxgl.Map;
//   isAnimating: boolean = false;
//   isLoading: boolean = true;
//   loadingProgress: number = 0;
  
//   // Static metrics for the demo
//   activeHotspots: number = 12;
//   totalPollinators: number = 156834;
//   riskZones: number = 3;

//   ngAfterViewInit(): void {
//     this.simulateLoading();

//     setTimeout(() => {
//       this.initializeMap();
//     }, 5500);
//   }

//   private simulateLoading(): void {
//     const loadingSteps = [20, 40, 60, 80, 100];
//     let currentStep = 0;
    
//     const loadingInterval = setInterval(() => {
//       if (currentStep < loadingSteps.length) {
//         this.loadingProgress = loadingSteps[currentStep];
//         currentStep++;
//       } else {
//         clearInterval(loadingInterval);
//         setTimeout(() => {
//           this.isLoading = false;
//           this.isAnimating = true; // Automatically start animations
//         }, 500);
//       }
//     }, 1000);
//   }

//   private initializeMap(): void {
//     (mapboxgl as any).accessToken = 'pk.eyJ1Ijoic2FoaXZhIiwiYSI6ImNtZzl3cXFwaDBpOG8ybHNneGFwZ3ZqOTUifQ.UrldzEHRjHkw2CiMeAyR-Q';

//     this.map = new mapboxgl.Map({
//       container: this.mapContainer.nativeElement,
//       style: 'mapbox://styles/mapbox/satellite-streets-v12',
//       center: [-3.7038, 40.4168],
//       zoom: 6,
//       pitch: 45,
//       bearing: 0,
//       antialias: true
//     });

//     this.map.on('style.load', () => {
//       this.map.setFog({
//         'range': [0.8, 8],
//         'color': '#f8f0e3',
//         'horizon-blend': 0.5
//       });
      
//       this.addBloomingHotspots();
//       this.addPollinatorRoutes();
//       this.startAnimations();
//     });
//   }

//   private addBloomingHotspots(): void {
//     const hotspots = [
//       { lat: 37.1773, lon: -3.5985, intensity: 0.95, name: "Campos de Jaén", flower: "🌺" },
//       { lat: 41.6561, lon: -0.8773, intensity: 0.88, name: "Valle del Ebro", flower: "🌻" },
//       { lat: 40.4637, lon: -3.7492, intensity: 0.72, name: "Sierra de Madrid", flower: "🌼" },
//       { lat: 43.3614, lon: -5.8593, intensity: 0.65, name: "Asturias", flower: "🌸" },
//       { lat: 42.3601, lon: -7.5593, intensity: 0.91, name: "Galicia", flower: "🌺" },
//       { lat: 36.7213, lon: -4.4214, intensity: 0.79, name: "Málaga", flower: "🌻" },
//       { lat: 28.1248, lon: -15.4300, intensity: 0.58, name: "Gran Canaria", flower: "🌼" },
//       { lat: 27.7648, lon: -17.9077, intensity: 0.63, name: "La Palma", flower: "🌸" },
//       { lat: 39.8628, lon: 4.2599, intensity: 0.84, name: "Ibiza", flower: "🌺" },
//       { lat: 37.3886, lon: -5.9823, intensity: 0.77, name: "Sevilla", flower: "🌻" },
//       { lat: 41.3851, lon: 2.1734, intensity: 0.69, name: "Barcelona", flower: "🌼" },
//       { lat: 43.2630, lon: -2.9350, intensity: 0.73, name: "Bilbao", flower: "🌸" }
//     ];

//     const geojson = {
//       type: "FeatureCollection",
//       features: hotspots.map(hotspot => ({
//         type: "Feature",
//         geometry: { 
//           type: "Point", 
//           coordinates: [hotspot.lon, hotspot.lat] 
//         },
//         properties: { 
//           name: hotspot.name,
//           intensity: hotspot.intensity,
//           flower: hotspot.flower
//         }
//       }))
//     };

//     this.map.addSource('blooming-hotspots', { 
//       type: 'geojson', 
//       data: geojson as any
//     });

//     // Mapa de calor mejorado
//     this.map.addLayer({
//       id: 'blooming-heatmap',
//       type: 'heatmap',
//       source: 'blooming-hotspots',
//       maxzoom: 9,
//       paint: {
//         'heatmap-weight': [
//           'interpolate',
//           ['linear'],
//           ['get', 'intensity'],
//           0, 0,
//           1, 1
//         ],
//         'heatmap-intensity': [
//           'interpolate',
//           ['linear'],
//           ['zoom'],
//           0, 1,
//           9, 4
//         ],
//         'heatmap-color': [
//           'interpolate',
//           ['linear'],
//           ['heatmap-density'],
//           0, 'rgba(16, 185, 129, 0)',
//           0.2, 'rgba(16, 185, 129, 0.2)',
//           0.4, 'rgba(245, 158, 11, 0.4)',
//           0.6, 'rgba(239, 68, 68, 0.6)',
//           0.8, 'rgba(220, 38, 38, 0.8)'
//         ],
//         'heatmap-radius': [
//           'interpolate',
//           ['linear'],
//           ['zoom'],
//           0, 3,
//           9, 25
//         ],
//         'heatmap-opacity': [
//           'interpolate',
//           ['linear'],
//           ['zoom'],
//           7, 1,
//           9, 0
//         ]
//       }
//     });

//     // Circles with pulsating flowers
//     this.map.addLayer({
//       id: 'blooming-circles',
//       type: 'circle',
//       source: 'blooming-hotspots',
//       paint: {
//         'circle-radius': [
//           'interpolate',
//           ['linear'],
//           ['get', 'intensity'],
//           0, 15,
//           1, 50
//         ],
//         'circle-color': [
//           'interpolate',
//           ['linear'],
//           ['get', 'intensity'],
//           0, '#fbbf24',
//           0.5, '#f59e0b',
//           0.8, '#10b981',
//           1, '#059669'
//         ],
//         'circle-opacity': 0.6,
//         'circle-stroke-width': 3,
//         'circle-stroke-color': '#ffffff',
//         'circle-stroke-opacity': 0.9
//       }
//     }, 'blooming-heatmap');

//     // Popups mejorados
//     this.map.on('click', 'blooming-circles', (e: any) => {
//       const properties = e.features[0].properties;
//       const coordinates = e.features[0].geometry.coordinates.slice();

//       new mapboxgl.Popup({
//         closeButton: true,
//         closeOnClick: true,
//         className: 'modern-popup'
//       })
//         .setLngLat(coordinates)
//         .setHTML(`
//           <div style="padding: 16px; max-width: 280px; background: linear-gradient(135deg, #0f172a, #1e293b); border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.3);">
//             <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
//               <span style="font-size: 2rem;">${properties.flower}</span>
//               <h3 style="margin: 0; color: #f1f5f9; font-size: 1.1rem; font-weight: 600;">${properties.name}</h3>
//             </div>
//             <div style="display: grid; gap: 8px;">
//               <div style="display: flex; justify-content: space-between;">
//                 <span style="color: #94a3b8; font-size: 0.9rem;">Intensidad:</span>
//                 <span style="color: #10b981; font-weight: 600;">${(properties.intensity * 100).toFixed(0)}%</span>
//               </div>
//               <div style="display: flex; justify-content: space-between;">
//                 <span style="color: #94a3b8; font-size: 0.9rem;">Estado:</span>
//                 <span style="color: ${properties.intensity > 0.7 ? '#10b981' : '#f59e0b'}; font-weight: 600;">
//                   ${properties.intensity > 0.7 ? 'Optimal' : 'Moderate'}
//                 </span>
//               </div>
//               <div style="margin-top: 8px; padding: 8px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; border-left: 3px solid #10b981;">
//                 <span style="color: #e2e8f0; font-size: 0.85rem;">🐝 Polinizadores activos en la zona</span>
//               </div>
//             </div>
//           </div>
//         `)
//         .addTo(this.map);
//     });
//   }

//   private addPollinatorRoutes(): void {
//     const routes = [
//       {
//         type: "Feature",
//         geometry: {
//           type: "LineString",
//           coordinates: [
//             [-3.7038, 40.4168], // Madrid
//             [-2.9350, 43.2630], // Bilbao
//             [-5.8593, 43.3614], // Asturias
//             [-7.5593, 42.3601]  // Galicia
//           ]
//         },
//         properties: { name: "Ruta Norte" }
//       },
//       {
//         type: "Feature", 
//         geometry: {
//           type: "LineString",
//           coordinates: [
//             [-3.5985, 37.1773], // Jaén
//             [-4.4214, 36.7213], // Malaga
//             [-5.9845, 37.3891], // Sevilla
//             [-0.8773, 41.6561]  // Zaragoza
//           ]
//         },
//         properties: { name: "Ruta Sur" }
//       }
//     ];

//     routes.forEach((route, index) => {
//       this.map.addSource(`pollinator-route-${index}`, {
//         type: 'geojson',
//         data: route as any
//       });

//       this.map.addLayer({
//         id: `pollinator-path-${index}`,
//         type: 'line',
//         source: `pollinator-route-${index}`,
//         layout: {
//           'line-join': 'round',
//           'line-cap': 'round'
//         },
//         paint: {
//           'line-color': '#10b981',
//           'line-width': 6,
//           'line-opacity': 0.8,
//           'line-dasharray': [3, 3]
//         }
//       });
//     });
//   }

//   private startAnimations(): void {
//     this.animateCircles();
//   }

//   private animateCircles(): void {
//     let pulseScale = 1;
//     let growing = true;

//     const animate = () => {
//       if (growing) {
//         pulseScale += 0.015;
//         if (pulseScale >= 1.4) growing = false;
//       } else {
//         pulseScale -= 0.015;
//         if (pulseScale <= 1) growing = true;
//       }

//       this.map.setPaintProperty('blooming-circles', 'circle-radius', [
//         'interpolate',
//         ['linear'],
//         ['get', 'intensity'],
//         0, 15 * pulseScale,
//         1, 50 * pulseScale
//       ]);

//       if (this.isAnimating) {
//         requestAnimationFrame(animate);
//       }
//     };

//     animate();
//   }

//   toggleAnimation(): void {
//     this.isAnimating = !this.isAnimating;
//     if (this.isAnimating) {
//       this.animateCircles();
//     }
//   }

//   showTimelapseView(): void {
//     const timelapseSteps = [
//       { center: [-3.5985, 37.1773], zoom: 8, duration: 1200 }, // Jaen - Spring
//       { center: [-7.5593, 42.3601], zoom: 8, duration: 1200 }, // Galicia - Verano
//       { center: [-4.4214, 36.7213], zoom: 8, duration: 1200 }, // Malaga - Autumn
//       { center: [-15.4300, 28.1248], zoom: 8, duration: 1200 }, // Canarias - Invierno
//       { center: [-3.7038, 40.4168], zoom: 6, duration: 1800 }  // Return to all Spain
//     ];

//     let currentStep = 0;
//     const executeStep = () => {
//       if (currentStep < timelapseSteps.length) {
//         const step = timelapseSteps[currentStep];
//         this.map.flyTo({
//           center: step.center as [number, number],
//           zoom: step.zoom,
//           speed: 1.5,
//           curve: 1.8
//         });
        
//         setTimeout(() => {
//           currentStep++;
//           executeStep();
//         }, step.duration);
//       }
//     };

//     executeStep();
//   }

//   triggerEmergencyProtocol(): void {
//     const modal = document.createElement('div');
//     modal.style.cssText = `
//       position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
//       background: rgba(0,0,0,0.9); display: flex; justify-content: center; 
//       align-items: center; z-index: 10000; backdrop-filter: blur(10px);
//     `;
    
//     modal.innerHTML = `
//       <div style="background: linear-gradient(135deg, #0f172a, #1e293b); padding: 40px; border-radius: 20px; max-width: 600px; text-align: center; border: 1px solid rgba(239, 68, 68, 0.3); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);">
//         <div style="font-size: 4rem; margin-bottom: 20px;">🚨</div>
//         <h2 style="color: #ef4444; margin-bottom: 20px; font-size: 1.8rem; font-weight: 700;">PROTOCOLO DE EMERGENCIA ACTIVADO</h2>
//         <p style="margin-bottom: 30px; color: #e2e8f0; font-size: 1.1rem;">Detectada escasez crítica de recursos florales en ${this.riskZones} zonas de España.</p>
//         <div style="text-align: left; margin: 30px 0; background: rgba(15, 23, 42, 0.8); padding: 24px; border-radius: 12px; border-left: 4px solid #ef4444;">
//           <h4 style="color: #f1f5f9; margin-bottom: 16px; font-size: 1.2rem;">⚡ Acciones Inmediatas:</h4>
//           <div style="display: grid; gap: 12px;">
//             <div style="display: flex; align-items: center; gap: 12px; color: #e2e8f0;">
//               <span style="font-size: 1.5rem;">🌱</span>
//               <span>Siembra urgente de especies melíferas en zonas críticas</span>
//             </div>
//             <div style="display: flex; align-items: center; gap: 12px; color: #e2e8f0;">
//               <span style="font-size: 1.5rem;">🚛</span>
//               <span>Redistribución inmediata de colmenas móviles</span>
//             </div>
//             <div style="display: flex; align-items: center; gap: 12px; color: #e2e8f0;">
//               <span style="font-size: 1.5rem;">📞</span>
//               <span>Alerta automática a apicultores locales y autoridades</span>
//             </div>
//             <div style="display: flex; align-items: center; gap: 12px; color: #e2e8f0;">
//               <span style="font-size: 1.5rem;">🔬</span>
//               <span>Monitoreo intensivo satelital durante 30 días</span>
//             </div>
//           </div>
//         </div>
//         <button onclick="this.parentElement.parentElement.remove()" 
//                 style="padding: 14px 28px; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 1rem; transition: all 0.3s ease;">
//           PROTOCOLO ACTIVADO
//         </button>
//       </div>
//     `;
    
//     document.body.appendChild(modal);
//   }

  
// }