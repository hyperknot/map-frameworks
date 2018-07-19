mapboxgl.accessToken =
  'pk.eyJ1IjoienNlcm8tdGVzdCIsImEiOiJjamd0dmkxeWMwZjdhMnpwZ2U5bmQzMWJ0In0.QaIl03iTV4NDKy0WOJuTWA'

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',

  center: [0, 0],
  zoom: 17,

  boxZoom: false,
  pitchWithRotate: false,
  dragRotate: false,
})

const markers = []

map.fitBounds([[lngMin, latMin], [lngMax, latMax]], { animate: false })

map.on('load', function() {
  // source for lines
  map.addSource('lines', {
    type: 'geojson',
    data: featureCollection([]),
  })

  // source for polygons
  map.addSource('polygons', {
    type: 'geojson',
    data: featureCollection([]),
  })

  // adding layers bottom to top

  // layer for polygon fill
  map.addLayer({
    id: 'polygon-fill',
    type: 'fill',
    source: 'polygons',
    paint: {
      'fill-color': ['get', 'color'],
      'fill-opacity': 0.7,
    },
  })

  // layer for polygon stroke
  map.addLayer({
    id: 'polygon-stroke',
    type: 'line',
    source: 'polygons',
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-width': 3,
      'line-color': ['get', 'color'],
    },
  })

  // layer for lines
  map.addLayer({
    id: 'lines',
    type: 'line',
    source: 'lines',
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-width': 3,
      'line-color': ['get', 'color'],
    },
  })

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
    fillMapWithData(40, 25)
  }
})

function fillMapWithData(rows, columns) {
  const data = generateItems(rows, columns)

  addPointMarkers(data)

  map.getSource('lines').setData(makeLineGeojson(data))
  map.getSource('polygons').setData(makePolygonGeojson(data))
}

function addPointMarkers(data) {
  for (const marker of markers) {
    marker.remove()
  }

  for (const point of data.points) {
    const marker = new mapboxgl.Marker({ color: point.color }).setLngLat([point.lng, point.lat])
    markers.push(marker)
    marker.addTo(map)
  }
}

function makeLineGeojson(data) {
  return featureCollection(
    data.lines.map(l => ({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: l.segments.map(p => [p.lng, p.lat]),
      },
      properties: {
        color: l.color,
      },
    }))
  )
}

function makePolygonGeojson(data) {
  return featureCollection(
    data.polygons.map(f => ({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        // first coordinate needs to be duplicated
        coordinates: [[...f.segments, f.segments[0]].map(p => [p.lng, p.lat])],
      },
      properties: {
        color: f.color,
      },
    }))
  )
}

function featureCollection(features) {
  return {
    type: 'FeatureCollection',
    features: features,
  }
}
