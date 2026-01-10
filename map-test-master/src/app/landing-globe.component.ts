import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import mapboxgl from 'mapbox-gl';
// REMOVED: Unified in app.unified-map.ts
@Component({
  selector: 'app-landing-globe',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="landing-globe-container">
      <div *ngIf="mapError && showMapAlert" class="map-alert error" role="alert">
        <div class="map-alert-content">
          <strong>Error:</strong>&nbsp;<span>{{ mapError }}</span>
        </div>
        <button class="map-alert-dismiss" (click)="showMapAlert = false">✕</button>
      </div>
      <div #globeMap class="globe-map"></div>
      <div class="landing-search-panel">
        <h1>BEEZI</h1>
        <p> Satellite System of pollinators</p>
        <div class="search-row">
          <input id="landingRegionQuery" name="landingRegionQuery" #searchInput type="text" placeholder="Search a region" [(ngModel)]="query" (keydown.enter)="flyToQuery()" />
          <button (click)="flyToQuery()"><span style="font-size:1.2em;">🔍</span> Explore</button>
        </div>
      </div>
      <div class="satellite-icon">🛰️</div>
    </div>
  `,
  styleUrls: ['./landing-globe.component.scss']
})
export class LandingGlobeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('globeMap', { static: false }) globeMap!: ElementRef<HTMLDivElement>;
  map!: mapboxgl.Map;

  query: string = '';
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef<HTMLInputElement>;
  mapError: string | null = null;
  mapWarning: string | null = null;
  showMapAlert: boolean = true;
  constructor(private readonly router: Router) {}

  ngAfterViewInit(): void {
    const token = window.__env__?.MAPBOX_TOKEN || '';
    if (!token) {
      this.mapError = 'No Mapbox token found. The map may not load correctly.';
      console.error('No Mapbox token found!');
      return;
    }
    (mapboxgl as any).accessToken = token;
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
    // Expose map for debugging
    try {
      (window as any).currentMap = this.map;
    } catch (e) {}
    this.map.on('style.load', () => {
      this.map.setFog({
        'color': 'white',
        'horizon-blend': 0.5
      });
    });
    this.map.on('error', (e) => {
      console.error('Map error:', e);
      if (!this.mapError) this.mapError = 'Error loading map tiles or style. Check console for details.';
    });
    // Enfocar el input al cargar
    setTimeout(() => {
      if (this.searchInput) this.searchInput.nativeElement.focus();
    }, 400);
  }

  ngOnDestroy(): void {
    try {
      if (this.map) {
        this.map.remove();
      }
    } catch (e) {
      console.debug('Error removing landing globe map on destroy', e);
    }
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
      const token = window.__env__?.MAPBOX_TOKEN || '';
      const resp = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(region)}.json?access_token=${encodeURIComponent(token)}`);
      const data = await resp.json();
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        coords = feature.center;

        // If bbox exists, fit bounds to show the whole region
        if (feature.bbox && feature.bbox.length === 4) {
          const bbox: [number, number, number, number] = feature.bbox;
          try {
            // Increase maxZoom to allow closer framing for large regions
            this.map.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], { padding: 80, maxZoom: 12, duration: 1200 });
            this.router.navigate(['/map'], { queryParams: { q: region } });
            this.query = '';
            setTimeout(() => { if (this.searchInput) this.searchInput.nativeElement.blur(); }, 200);
            return;
          } catch (e) {
            console.debug('fitBounds error', e);
          }
        } else {
          // Choose zoom based on place_type when bbox not available; increase values slightly for closer view
          const placeType = (feature.place_type && feature.place_type[0]) || '';
          const zoomByType: Record<string, number> = { country: 7, region: 8, district: 9, place: 12, locality: 13, neighborhood: 14 };
          const targetZoom = zoomByType[placeType] ?? 8;
          this.map.flyTo({ center: coords, zoom: targetZoom, speed: 1.2, curve: 1.4, essential: true, bearing: 20 + Math.random() * 40, pitch: 45 });
          this.router.navigate(['/map'], { queryParams: { q: region } });
          this.query = '';
          setTimeout(() => { if (this.searchInput) this.searchInput.nativeElement.blur(); }, 200);
          return;
        }
      }
    } catch (e) {
      console.debug('geocoding error', e);
    }

    // Fallback: generic flyTo (slightly closer)
    try {
      this.map.flyTo({ center: coords, zoom: 8, speed: 1.2, curve: 1.8, essential: true, bearing: 20 + Math.random() * 40, pitch: 45 });
    } catch (e) {
      console.debug('flyTo fallback error', e);
    }

    setTimeout(() => {
      this.router.navigate(['/map'], { queryParams: { q: region } });
      this.query = '';
      setTimeout(() => { if (this.searchInput) this.searchInput.nativeElement.blur(); }, 200);
    }, 1600);
  }
}
