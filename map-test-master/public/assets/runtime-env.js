window.__env__ = window.__env__ || {};
// Load MAPBOX_TOKEN from runtime env or fallback to .env for local dev
window.__env__.MAPBOX_TOKEN = (typeof MAPBOX_TOKEN !== 'undefined') ? MAPBOX_TOKEN : 'pk.eyJ1Ijoic2FoaXZhIiwiYSI6ImNtZzl3cXFwaDBpOG8ybHNneGFwZ3ZqOTUifQ.UrldzEHRjHkw2CiMeAyR-Q';
