"""
Demo BeeWatch: Visualización de hotspots de floración, hábitats y rutas de abejas con slider temporal y animación
Stack: Streamlit + folium + pandas + geojson
"""
import streamlit as st
import folium
from streamlit_folium import st_folium
import pandas as pd
import json
from datetime import datetime

st.set_page_config(page_title="BeeWatch Demo", layout="wide")
st.title("🐝 BeeWatch – Demo Hackatón NASA 2025")

# --- CARGA DE DATOS ---
with open("public/data/hotspots_demo.geojson") as f:
    hotspots = json.load(f)
with open("public/data/habitats_demo.geojson") as f:
    habitats = json.load(f)
with open("public/data/bee_routes_demo.geojson") as f:
    routes = json.load(f)

# --- SLIDER TEMPORAL ---
fechas = sorted(list(set(f["properties"]["date"] for f in hotspots["features"])))
fecha_sel = st.slider("Fecha de floración", min_value=0, max_value=len(fechas)-1, value=0, format="%d", label_visibility="visible")
fecha_actual = fechas[fecha_sel]
st.write(f"Visualizando datos para: {fecha_actual}")

# --- MAPA ---
center = [40.4168, -3.7038]
m = folium.Map(location=center, zoom_start=7, tiles="cartodbpositron")

# Hotspots filtrados por fecha
for f in hotspots["features"]:
    if f["properties"]["date"] == fecha_actual:
        folium.CircleMarker(
            location=f["geometry"]["coordinates"][::-1],
            radius=14,
            color="#FFD600",
            fill=True,
            fill_color="#FFD600",
            fill_opacity=0.7,
            popup=f"NDVI: {f['properties']['ndvi']}"
        ).add_to(m)

# Hábitats
folium.GeoJson(habitats, name="Hábitats", style_function=lambda x: {"fillColor": "#81C784", "color": "#388E3C", "weight": 2, "fillOpacity": 0.3}).add_to(m)

# Rutas de abejas (animación simple)
for f in routes["features"]:
    folium.PolyLine(f["geometry"]["coordinates"], color="#00B8D4", weight=4, opacity=0.7, dash_array="5,10").add_to(m)
    # Animación: marcador de abeja en el primer punto de la ruta
    folium.Marker(f["geometry"]["coordinates"][0][::-1], icon=folium.DivIcon(html='<div style="font-size:2rem;">🐝</div>')).add_to(m)

st_folium(m, width=900, height=600)

# --- PANEL DE RECOMENDACIONES ---
st.sidebar.header("Panel de Recomendaciones")
st.sidebar.info("Plantar flores en zonas con NDVI bajo. Vigilar rutas con menos hotspots.")
