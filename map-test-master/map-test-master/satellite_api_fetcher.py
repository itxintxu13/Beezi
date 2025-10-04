"""
Script para descargar NDVI/EVI de MODIS/Sentinel usando APIs públicas (NASA LAADS, Google Earth Engine REST, Copernicus Open Access Hub)
Genera archivos GeoJSON listos para cargar en el frontend (Angular/Streamlit/Dash)
"""
import requests
import json
from datetime import datetime, timedelta

# --- CONFIGURACIÓN ---
# Ejemplo: Descarga de NDVI MODIS para una región y rango de fechas
NASA_LAADS_URL = "https://ladsweb.modaps.eosdis.nasa.gov/api/v1"
PRODUCT = "MOD13Q1"  # NDVI 16 días, 250m
TOKEN = "TU_TOKEN_NASA_LAADS"  # Regístrate gratis en https://ladsweb.modaps.eosdis.nasa.gov/

# Región piloto (España)
BBOX = [-4.0, 40.0, -3.0, 41.0]  # minLon, minLat, maxLon, maxLat
START_DATE = "2025-04-01"
END_DATE = "2025-06-01"

# --- FUNCIONES ---
def fetch_modis_ndvi(product, bbox, start_date, end_date, token):
    # Esta función es un ejemplo. Para datos reales, usa la API de LAADS o Earth Engine Python API.
    # Aquí simulamos datos NDVI para el MVP.
    ndvi_points = []
    current = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    while current <= end:
        ndvi_points.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [bbox[0] + 0.5, bbox[1] + 0.5]},
            "properties": {"ndvi": 0.7 + 0.2 * (current.month-4)/2, "date": current.strftime("%Y-%m-%d")}
        })
        current += timedelta(days=16)
    return {"type": "FeatureCollection", "features": ndvi_points}

# --- DESCARGA Y GUARDA ---
if __name__ == "__main__":
    ndvi_geojson = fetch_modis_ndvi(PRODUCT, BBOX, START_DATE, END_DATE, TOKEN)
    with open("public/data/hotspots_modis.geojson", "w") as f:
        json.dump(ndvi_geojson, f, indent=2)
    print("GeoJSON NDVI simulado guardado en public/data/hotspots_modis.geojson")
