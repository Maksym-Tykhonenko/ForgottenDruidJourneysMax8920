import { MYSTERIES } from '../data/catalogue';

// Builds a self-contained Leaflet document with a dark themed basemap and
// custom glowing, pulsing pins. Pin taps are relayed to React Native via
// window.ReactNativeWebView.postMessage so the floating card lives natively.
export function buildMapHtml(): string {
  const markers = MYSTERIES.map(m => ({
    id: m.id,
    lat: m.lat,
    lng: m.lng,
    name: m.name,
  }));

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html, body, #map { height: 100%; margin: 0; padding: 0; background: #070D1F; }
  .leaflet-container { background: #070D1F; outline: none; }
  .leaflet-control-attribution, .leaflet-control-zoom { display: none !important; }
  .pin {
    position: relative; width: 22px; height: 22px;
  }
  .pin .core {
    position: absolute; top: 4px; left: 4px; width: 14px; height: 14px;
    border-radius: 50%; background: #F2932F;
    border: 2px solid #0C1430;
    box-shadow: 0 0 10px 2px rgba(242,147,47,0.85);
    z-index: 2;
  }
  .pin .ring {
    position: absolute; top: 0; left: 0; width: 22px; height: 22px;
    border-radius: 50%; background: rgba(242,147,47,0.55);
    animation: pulse 2.1s ease-out infinite;
    z-index: 1;
  }
  .pin.sel .core { background: #FFAE47; box-shadow: 0 0 16px 5px rgba(255,174,71,0.95); }
  @keyframes pulse {
    0% { transform: scale(0.5); opacity: 0.9; }
    100% { transform: scale(3.2); opacity: 0; }
  }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  var markers = ${JSON.stringify(markers)};
  var map = L.map('map', {
    zoomControl: false, attributionControl: false,
    minZoom: 2, maxZoom: 6, worldCopyJump: true
  }).setView([28, 6], 2);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 8, subdomains: 'abcd'
  }).addTo(map);

  var selected = null;
  var layers = {};

  function icon(sel) {
    return L.divIcon({
      className: '',
      html: '<div class="pin' + (sel ? ' sel' : '') + '"><div class="ring"></div><div class="core"></div></div>',
      iconSize: [22, 22], iconAnchor: [11, 11]
    });
  }

  markers.forEach(function(m) {
    var mk = L.marker([m.lat, m.lng], { icon: icon(false) }).addTo(map);
    layers[m.id] = mk;
    mk.on('click', function() {
      if (selected && layers[selected]) layers[selected].setIcon(icon(false));
      selected = m.id;
      mk.setIcon(icon(true));
      map.panTo([m.lat, m.lng], { animate: true, duration: 0.5 });
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'select', id: m.id }));
      }
    });
  });

  // Allow RN to clear selection styling.
  document.addEventListener('message', handleRN);
  window.addEventListener('message', handleRN);
  function handleRN(e) {
    try {
      var d = JSON.parse(e.data);
      if (d.type === 'deselect' && selected && layers[selected]) {
        layers[selected].setIcon(icon(false));
        selected = null;
      }
    } catch (err) {}
  }
</script>
</body>
</html>`;
}
