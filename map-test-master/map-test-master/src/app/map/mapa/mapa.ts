import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { FeatureCollection, Point, GeoJsonProperties } from 'geojson';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.scss'] 
})
export class Mapa implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef<HTMLDivElement>;

  map!: mapboxgl.Map;

  ngAfterViewInit(): void {
    (mapboxgl as any).accessToken = 'pk.eyJ1Ijoic2FoaXZhIiwiYSI6ImNtZzl3cXFwaDBpOG8ybHNneGFwZ3ZqOTUifQ.UrldzEHRjHkw2CiMeAyR-Q';

    // Inicializa el mapa tipo globo
    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement, // usa el ViewChild
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [-17, 27],
      zoom: 1.5,
      projection: 'globe',
    });

    this.map.on('style.load', () => this.map.setFog({}));

    // Preguntar al usuario por la región
    const region = prompt('¿A qué ciudad o región quieres ir?');

    if (region) {
      this.flyToRegion(region);
    }

    // Hotspots de ejemplo
    const geojson: FeatureCollection<Point, GeoJsonProperties> = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [-2.5, 43.0] }, // País Vasco
          properties: { name: "Euskadi" }
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [-16.633, 28.2916] }, // Tenerife
          properties: { name: "Tenerife" }
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [-3.7038, 40.4168] }, // Madrid
          properties: { name: "Madrid" }
        }
      ]
    };

    this.map.on('load', () => {
      this.map.addSource('hotspots', { type: 'geojson', data: geojson });

      this.map.addLayer({
        id: 'hotspots-layer',
        type: 'circle',
        source: 'hotspots',
        paint: {
          'circle-radius': 6,
          'circle-color': '#FF4136',
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });
    });
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
