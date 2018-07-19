const map = L.map('map')

L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
  {
    attribution:
      'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
  }
).addTo(map)

const layerGroup = L.layerGroup().addTo(map)

map.fitBounds([[latMin, lngMin], [latMax, lngMax]])

// binding buttons

document.getElementById('button-10').onclick = () => {
  fillMapWithData(1, 1)
}

document.getElementById('button-100').onclick = () => {
  fillMapWithData(5, 2)
}

document.getElementById('button-1000').onclick = () => {
  fillMapWithData(10, 10)
}

document.getElementById('button-10000').onclick = () => {
  if (window.confirm('This will probably freeze your browser tab, are you sure?')) {
    fillMapWithData(40, 25)
  }
}

function fillMapWithData(rows, columns) {
  layerGroup.clearLayers()

  const data = generateItems(rows, columns)

  addPoints(data)
  addPolygons(data)
  addLines(data)
}

function addPoints(data) {
  for (const point of data.points) {
    L.marker([point.lat, point.lng]).addTo(layerGroup)
  }
}

function addLines(data) {
  for (const line of data.lines) {
    L.polyline([line.segments.map(p => [p.lat, p.lng])], {
      color: line.color,
    }).addTo(layerGroup)
  }
}

function addPolygons(data) {
  for (const polygon of data.polygons) {
    // Leaflet doesn't require the first coordinate to be duplicated for polygons
    L.polygon([polygon.segments.map(p => [p.lat, p.lng])], {
      fillColor: polygon.color,
      fillOpacity: 0.7,
      color: polygon.color,
    }).addTo(layerGroup)
  }
}
