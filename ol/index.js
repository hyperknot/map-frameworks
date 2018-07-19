import 'ol/ol.css'
import './index.css'

import { asArray } from 'ol/color'
import Feature from 'ol/Feature'
import LineString from 'ol/geom/LineString'
import Point from 'ol/geom/Point'
import Polygon from 'ol/geom/Polygon'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import Map from 'ol/Map'
import { transformExtent } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import CircleStyle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Style from 'ol/style/Style'
import View from 'ol/View'

import { generateItems, latMax, latMin, lngMax, lngMin, randomColor } from './utils'

let circleRadius
let usedLayer

const vectorSource = new VectorSource({
  features: [],
})

const vectorLayer = new VectorLayer({
  source: vectorSource,
})

const vectorLayerImg = new VectorLayer({
  source: vectorSource,
  renderMode: 'image',
})

const map = (window.map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new XYZ({
        attributions:
          'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
        url:
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      }),
    }),
  ],

  view: new View(),
}))

// need to manually call transformExtent to make it work with lat lon coordinate pairs
map.getView().fit(transformExtent([lngMin, latMin, lngMax, latMax], 'EPSG:4326', 'EPSG:3857'), {
  constrainResolution: false,
})

// binding buttons

document.getElementById('button-10').onclick = () => {
  setUsedLayer(vectorLayer)
  circleRadius = 10
  fillMapWithData(1, 1)
}

document.getElementById('button-100').onclick = () => {
  setUsedLayer(vectorLayer)
  circleRadius = 7
  fillMapWithData(5, 2)
}

document.getElementById('button-1000').onclick = () => {
  setUsedLayer(vectorLayer)
  circleRadius = 5
  fillMapWithData(10, 10)
}

document.getElementById('button-10000').onclick = () => {
  // this example uses an different 'image' rendering mode
  setUsedLayer(vectorLayerImg)
  circleRadius = 3
  fillMapWithData(40, 25)
}

// ---------
// helper functions
// ---------

function style(feature) {
  const type = feature.get('type')
  const color = feature.get('color')
  let style

  if (type === 'point') {
    style = new Style({
      image: new CircleStyle({
        radius: circleRadius,
        fill: new Fill({ color: color }),
      }),
    })
  } else if (type === 'line') {
    style = new Style({
      stroke: new Stroke({
        color: color,
        width: 3,
      }),
    })
  } else if (type === 'polygon') {
    const olColor = asArray(color).slice() // slice is required
    olColor[3] = 0.7

    style = new Style({
      stroke: new Stroke({
        color: color,
        width: 3,
      }),
      fill: new Fill({
        color: olColor,
      }),
    })
  }
  feature.setStyle(style)
}

function fillMapWithData(rows, columns) {
  vectorSource.clear()

  const data = generateItems(rows, columns)

  addPoints(data)
  addLines(data)
  addPolygons(data)
}

function addPoints(data) {
  for (const point of data.points) {
    const geom = new Point([point.lng, point.lat])
    geom.transform('EPSG:4326', 'EPSG:3857')

    const feature = new Feature({
      type: 'point',
      geometry: geom,
      color: randomColor(),
    })

    style(feature)

    vectorSource.addFeature(feature)
  }
}

function addLines(data) {
  for (const line of data.lines) {
    const geom = new LineString(line.segments.map(p => [p.lng, p.lat]))
    geom.transform('EPSG:4326', 'EPSG:3857')

    const feature = new Feature({
      type: 'line',
      geometry: geom,
      color: randomColor(),
    })

    style(feature)

    vectorSource.addFeature(feature)
  }
}

function addPolygons(data) {
  for (const polygon of data.polygons) {
    // first coordinate needs to be duplicated
    const geom = new Polygon([[...polygon.segments, polygon.segments[0]].map(p => [p.lng, p.lat])])
    geom.transform('EPSG:4326', 'EPSG:3857')

    const feature = new Feature({
      type: 'polygon',
      geometry: geom,
      color: randomColor(),
    })

    style(feature)

    vectorSource.addFeature(feature)
  }
}

function setUsedLayer(layer) {
  if (usedLayer) {
    map.removeLayer(usedLayer)
  }
  usedLayer = layer
  map.addLayer(usedLayer)
}
