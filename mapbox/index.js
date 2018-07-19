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

map.fitBounds([[lngMin, latMin], [lngMax, latMax]], { animate: false })

map.on('load', function() {
  // source for points
  map.addSource('points', {
    type: 'geojson',
    // an empty GeoJSON FeatureCollection is required for an empty source
    data: featureCollection([]),
  })

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

  // layer for points
  map.addLayer({
    id: 'points',
    source: 'points',
    type: 'circle',
    paint: {
      'circle-color': ['get', 'color'],
    },
  })

  // binding buttons

  document.getElementById('button-10').onclick = () => {
    fillMapWithData(1, 1)
    map.setPaintProperty('points', 'circle-radius', 10)
  }

  document.getElementById('button-100').onclick = () => {
    fillMapWithData(5, 2)
    map.setPaintProperty('points', 'circle-radius', 7)
  }

  document.getElementById('button-1000').onclick = () => {
    fillMapWithData(10, 10)
    map.setPaintProperty('points', 'circle-radius', 5)
  }

  document.getElementById('button-10000').onclick = () => {
    fillMapWithData(40, 25)
    map.setPaintProperty('points', 'circle-radius', 3)
  }
})

function fillMapWithData(rows, columns) {
  const data = generateItems(rows, columns)
  map.getSource('points').setData(makePointGeojson(data))
  map.getSource('lines').setData(makeLineGeojson(data))
  map.getSource('polygons').setData(makePolygonGeojson(data))
}

function makePointGeojson(data) {
  return featureCollection(
    data.points.map(p => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [p.lng, p.lat],
      },
      properties: {
        color: p.color,
      },
    }))
  )
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
