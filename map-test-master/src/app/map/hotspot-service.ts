import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BloomingHotspot } from './bloomingHotspot.model';
import { Hotspot } from './hotspot.model';

@Injectable({
  providedIn: 'root'
})
export class HotspotService {
  private readonly url = "data/hotspots.json";

  constructor(private readonly http: HttpClient) { }

  getHotspots(): Observable<Hotspot[]> {
    return this.http.get<Hotspot[]>(this.url);
  }

  /**
   * Llama a una API que devuelve un objeto { count, message, results: [] }
   * y mapea los resultados a BloomingHotspot[].
   * Si la respuesta no tiene la forma esperada, devuelve un array vacío.
   */
  getHotspotsFromApi(apiUrl: string): Observable<BloomingHotspot[]> {
    return this.http.get<any>(apiUrl).pipe(
      map(response => {
        if (!response || !Array.isArray(response.results)) return [];
        // Mapear cada result a BloomingHotspot de forma flexible
  return response.results.map((r: any) => {
          // Intentar soportar formas comunes: {lat, lon} o {geometry: {coordinates: [lon, lat]}}
          let lat = null as number | null;
          let lon = null as number | null;
          if (r.lat !== undefined && r.lon !== undefined) {
            lat = Number(r.lat);
            lon = Number(r.lon);
          } else if (r.geometry && Array.isArray(r.geometry.coordinates)) {
            lon = Number(r.geometry.coordinates[0]);
            lat = Number(r.geometry.coordinates[1]);
          } else if (Array.isArray(r.coordinates) && r.coordinates.length >= 2) {
            lon = Number(r.coordinates[0]);
            lat = Number(r.coordinates[1]);
          }

          let intensityRaw: any = 0.5;
          if (r.intensity !== undefined) intensityRaw = r.intensity;
          else if (r.score !== undefined) intensityRaw = r.score;
          const intensity = Number(intensityRaw);
          const name = r.name || r.title || 'Hotspot remoto';
          let species: string[] = [];
          if (Array.isArray(r.species)) species = r.species;
          else if (r.species) species = [String(r.species)];
          let pollinatorCount = 0;
          if (r.pollinatorCount !== undefined) pollinatorCount = Number(r.pollinatorCount);
          else if (r.count !== undefined) pollinatorCount = Number(r.count);
          const bloomPeriod = r.bloomPeriod || r.period || '';
          const status = r.status || null;

          return {
            lat: lat ?? 0,
            lon: lon ?? 0,
            intensity: isNaN(intensity) ? 0.5 : Math.max(0, Math.min(1, intensity)),
            name,
            bloomPeriod,
            species,
            pollinatorCount: isNaN(pollinatorCount) ? 0 : pollinatorCount,
            status: status
          } as BloomingHotspot;
        }).filter((h: BloomingHotspot) => h.lat !== 0 || h.lon !== 0);
      })
    );
  }

  /**
  * Specific mapping for the GLOBE API (when geojson=TRUE or sample=TRUE is passed).
   * Intenta extraer coordenadas desde geometry/geojson/feature y campos relevantes.
   */
  getHotspotsFromGlobeApi(apiUrl: string): Observable<BloomingHotspot[]> {
    return this.http.get<any>(apiUrl).pipe(
      map(response => {
        // GLOBE puede devolver un objeto con 'results' (array) o un GeoJSON FeatureCollection
        let items: any[] = [];
        if (response) {
          if (Array.isArray(response.results)) items = response.results;
          else if (Array.isArray(response.features)) items = response.features;
        }
        if (!items || items.length === 0) return [];

        const extractGeom = (r: any) => {
          const props = r.properties || r;
          let geom = r.geometry || r.geojson?.geometry || r.feature?.geometry || props.geometry || null;
          if (!geom && r.geojson && r.geojson.type === 'Feature') geom = r.geojson.geometry;
          if (geom && Array.isArray(geom.coordinates)) return { lat: Number(geom.coordinates[1]), lon: Number(geom.coordinates[0]) };
          if (props.location && props.location.latitude !== undefined && props.location.longitude !== undefined) return { lat: Number(props.location.latitude), lon: Number(props.location.longitude) };
          if (props.latitude !== undefined && props.longitude !== undefined) return { lat: Number(props.latitude), lon: Number(props.longitude) };
          if (props.lat !== undefined && props.lon !== undefined) return { lat: Number(props.lat), lon: Number(props.lon) };
          return { lat: 0, lon: 0 };
        };

        const extractName = (props: any) => props.locationName || props.siteName || props.location?.name || props.sample_site || props.id || props.name || props.title || 'GLOBE Hotspot';

        const phenophaseHeuristic = (phenophase: any) => {
          if (!phenophase) return null;
          const p = String(phenophase).toLowerCase();
          if (p.includes('full') || p.includes('peak') || p.includes('open')) return 0.9;
          if (p.includes('bud') || p.includes('flowering')) return 0.6;
          return 0.3;
        };

        const findFirstCandidate = (props: any, keys: string[]) => {
          for (const k of keys) {
            if (props[k] !== undefined && props[k] !== null) return props[k];
          }
          return null;
        };

        const extractIntensity = (props: any) => {
          const candidates = ['value', 'sample_value', 'result_value', 'measurement_value', 'score', 'intensity', 'count'];
          let raw = findFirstCandidate(props, candidates);
          if (raw === null) raw = phenophaseHeuristic(props.phenophase);
          let val = 0.5;
          if (raw !== null && raw !== undefined) {
            val = Number(raw);
            if (isNaN(val)) return 0.5;
            if (val > 1 && val <= 100) val = val / 100;
            if (val > 1) val = 1;
            if (val < 0) val = 0;
          }
          return val;
        };

        const extractSpecies = (props: any) => {
          if (!props) return [] as string[];
          if (props.species) return Array.isArray(props.species) ? props.species : [String(props.species)];
          if (props.plant_common_name) return [String(props.plant_common_name)];
          if (props.scientificName) return [String(props.scientificName)];
          return [] as string[];
        };

        const extractPollinatorCount = (props: any) => {
          if (props.pollinator_count !== undefined && props.pollinator_count !== null) return Number(props.pollinator_count);
          if (props.count !== undefined && props.count !== null) return Number(props.count);
          return 0;
        };

        return items.map((r: any) => {
          const props = r.properties || r;
          const g = extractGeom(r);
          const lat = g.lat || 0;
          const lon = g.lon || 0;
          const name = extractName(props);
          const intensity = extractIntensity(props);
          const species = extractSpecies(props);
          const bloomPeriod = props.measurementdate || props.sample_date || props.collection_date || props.date || props.eventDate || '';
          const pollinatorCount = extractPollinatorCount(props);

          let status: 'critical' | 'moderate' | 'low' | null = null;
          if (intensity < 0.4) status = 'critical';
          else if (intensity < 0.7) status = 'moderate';
          else status = 'low';

          return {
            lat,
            lon,
            intensity,
            name,
            bloomPeriod,
            species,
            pollinatorCount,
            status
          } as BloomingHotspot;
        }).filter((h: BloomingHotspot) => h.lat !== 0 || h.lon !== 0);
      })
    );
  }
}
