import { Feature } from 'geojson';

export interface PollinatorRouteProperties {
  name: string;
  species: string;
  active: boolean;
}

export interface PollinatorRoute extends Feature {
  type: "Feature";
  geometry: {
    type: "LineString";
    coordinates: [number, number][]; // Array de [lon, lat]
  };
  properties: PollinatorRouteProperties;
}