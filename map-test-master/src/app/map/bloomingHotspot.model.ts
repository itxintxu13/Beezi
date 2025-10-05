export interface BloomingHotspot {
  lat: number;                 // Latitud
  lon: number;                 // Longitud
  intensity: number;           // Blooming intensity (0 to 1)
  name: string;                // Nombre del hotspot
  bloomPeriod: string;         // Blooming period (e.g. "April-May")
  species: string[];           // Lista de especies en flor
  pollinatorCount: number;     // Número estimado de polinizadores
  // Estado opcional: 'bajo' | 'moderado' | 'critico'
  status?: 'low' | 'moderate' | 'critical';
}