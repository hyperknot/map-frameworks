// framework independent functions

const lngMin = -21
const lngMax = 40
const latMin = 35
const latMax = 59

function generateItems(rows, columns) {
  let data = {
    points: [],
    lines: [],
    polygons: [],
  }

  for (let i = 0; i < rows; i++) {
    const cellLngMin = lerp(lngMin, lngMax, i / rows)
    const cellLngMax = lerp(lngMin, lngMax, (i + 1) / rows)

    for (let j = 0; j < columns; j++) {
      const cellLatMin = lerp(latMin, latMax, j / columns)
      const cellLatMax = lerp(latMin, latMax, (j + 1) / columns)

      const points = Array.from({ length: 8 }, () => ({
        lat: getRandomFloat(cellLatMin, cellLatMax),
        lng: getRandomFloat(cellLngMin, cellLngMax),
        color: randomColor(),
      }))

      const lines = {
        segments: points.slice(3),
        color: randomColor(),
      }

      const polygon = {
        segments: points.slice(0, 3),
        color: randomColor(),
      }

      data.points.push(...points)
      data.lines.push(lines)
      data.polygons.push(polygon)
    }
  }
  return data
}

function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

function randomColor() {
  return '#' + ('000000' + Math.floor(Math.random() * 16777215).toString(16)).slice(-6)
}

if (typeof module === 'object' && module.exports) {
  module.exports = {
    generateItems,
    lerp,
    getRandomFloat,
    getRandomInt,
    randomColor,
    lngMin,
    lngMax,
    latMin,
    latMax,
  }
}
