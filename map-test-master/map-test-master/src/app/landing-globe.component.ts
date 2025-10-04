import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import mapboxgl from 'mapbox-gl';
import { Router } from '@angular/router';
// ELIMINADO: Unificado en app.unified-map.ts
@Component({
  selector: 'app-landing-globe',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="landing-globe-container">
      <div #globeMap class="globe-map"></div>
      <div class="landing-search-panel">
        <h1>BEEZI</h1>
        <p>Sistema Satelital de Protección de Polinizadores</p>
        <div class="search-row">
          <input type="text" placeholder="Buscar región o país..." [(ngModel)]="query" (keydown.enter)="flyToQuery()" />
          <button (click)="flyToQuery()"><span style="font-size:1.2em;">🔍</span> Explorar</button>
        </div>
      </div>
      <div class="satellite-icon">🛰️</div>
    </div>
  `,
  styleUrls: ['./landing-globe.component.scss']
})
export class LandingGlobeComponent implements AfterViewInit {
  @ViewChild('globeMap', { static: false }) globeMap!: ElementRef<HTMLDivElement>;
  map!: mapboxgl.Map;

  query: string = '';
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef<HTMLInputElement>;
  constructor(private readonly router: Router) {}

  ngAfterViewInit(): void {
    (mapboxgl as any).accessToken = 'pk.eyJ1Ijoic2FoaXZhIiwiYSI6ImNtZzl3cXFwaDBpOG8ybHNneGFwZ3ZqOTUifQ.UrldzEHRjHkw2CiMeAyR-Q';
    this.map = new mapboxgl.Map({
      container: this.globeMap.nativeElement,
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
    // Enfocar el input al cargar
    setTimeout(() => {
      if (this.searchInput) this.searchInput.nativeElement.focus();
    }, 400);
  }

  async flyToQuery() {
    if (!this.query.trim()) {
      if (this.searchInput) this.searchInput.nativeElement.focus();
      return;
    }
    // Geocodificar la región
    const region = this.query.trim();
    let coords: [number, number] = [0, 20];
    try {
      const resp = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(region)}.json?access_token=pk.eyJ1Ijoic2FoaXZhIiwiYSI6ImNtZzl3cXFwaDBpOG8ybHNneGFwZ3ZqOTUifQ.UrldzEHRjHkw2CiMeAyR-Q`);
      const data = await resp.json();
      if (data.features && data.features.length > 0) {
        coords = data.features[0].center;
      }
    } catch {}

    // Animar el globo: zoom y flyTo
    this.map.flyTo({
      center: coords,
      zoom: 6.5,
      speed: 1.2,
      curve: 1.8,
      essential: true,
      bearing: 20 + Math.random() * 40,
      pitch: 45
    });

    // Esperar a que termine la animación (1.5s aprox)
    setTimeout(() => {
      this.router.navigate(['/map'], { queryParams: { q: region } });
      this.query = '';
      setTimeout(() => {
        if (this.searchInput) this.searchInput.nativeElement.blur();
      }, 200);
    }, 1600);
  }
}
