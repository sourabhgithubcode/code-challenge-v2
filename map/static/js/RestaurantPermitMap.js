import React, { useEffect, useState } from "react"

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"

import "leaflet/dist/leaflet.css"

import RAW_COMMUNITY_AREAS from "../../../data/raw/community-areas.geojson"

function YearSelect({ setFilterVal }) {
  // Filter by the permit issue year for each restaurant
  const startYear = 2026
  const years = [...Array(11).keys()].map((increment) => {
    return startYear - increment
  })
  const options = years.map((year) => {
    return (
      <option value={year} key={year}>
        {year}
      </option>
    )
  })

  return (
    <>
      <label htmlFor="yearSelect" className="fs-3">
        Filter by year:{" "}
      </label>
      <select
        id="yearSelect"
        className="form-select form-select-lg mb-3"
        onChange={(e) => setFilterVal(e.target.value)}
      >
        {options}
      </select>
    </>
  )
}

export default function RestaurantPermitMap() {
  const communityAreaColors = ["#eff3ff", "#bdd7e7", "#6baed6", "#2171b5"]

  const [currentYearData, setCurrentYearData] = useState([])
  const [year, setYear] = useState(2026)

  const yearlyDataEndpoint = `/map-data/?year=${year}`

  // Calculate total permits and max permits for the current year
  const totalPermits = currentYearData.reduce(
    (sum, area) => sum + area.num_permits,
    0
  )
  const maxNumPermits = Math.max(
    ...currentYearData.map((area) => area.num_permits),
    0
  )

  useEffect(() => {
    fetch(yearlyDataEndpoint)
      .then((res) => res.json())
      .then((data) => {
        /**
         * TODO: Fetch the data needed to supply to map with data
         */
        setCurrentYearData(data)
      })
  }, [yearlyDataEndpoint])


  function getColor(percentageOfPermits) {
    /**
     * TODO: Use this function in setAreaInteraction to set a community
     * area's color using the communityAreaColors constant above
     */
    if (percentageOfPermits > 0.75) return communityAreaColors[3]
    if (percentageOfPermits > 0.5) return communityAreaColors[2]
    if (percentageOfPermits > 0.25) return communityAreaColors[1]
    return communityAreaColors[0]
  }

  function setAreaInteraction(feature, layer) {
    /**
     * TODO: Use the methods below to:
     * 1) Shade each community area according to what percentage of
     * permits were issued there in the selected year
     * 2) On hover, display a popup with the community area's raw
     * permit count for the year
     */
    // Get the area ID from the geojson feature
    const areaId = feature.properties.area_numbe

    // Find matching data from our API response
    const areaData = currentYearData.find(
      (area) => area.area_id === parseInt(areaId)
    )

    const numPermits = areaData ? areaData.num_permits : 0
    const areaName = areaData ? areaData.name : feature.properties.community

    // Calculate the percentage for color shading
    const percentageOfPermits = maxNumPermits > 0 ? numPermits / maxNumPermits : 0

    // Set the style with the calculated color
    layer.setStyle({
      fillColor: getColor(percentageOfPermits),
      weight: 2,
      opacity: 1,
      color: "white",
      fillOpacity: 0.7,
    })

    // Add hover interaction with popup
    layer.on("mouseover", () => {
      layer.bindPopup(`
        <strong>${areaName}</strong><br/>
        Permits in ${year}: ${numPermits}
      `)
      layer.openPopup()
    })

    layer.on("mouseout", () => {
      layer.closePopup()
    })
  }

  return (
    <>
      <YearSelect filterVal={year} setFilterVal={setYear} />
      <p className="fs-4">
        Restaurant permits issued this year: {totalPermits}
      </p>
      <p className="fs-4">
        Maximum number of restaurant permits in a single area: {maxNumPermits}
      </p>
      <MapContainer
        id="restaurant-map"
        center={[41.88, -87.62]}
        zoom={10}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png"
        />
        {currentYearData.length > 0 ? (
          <GeoJSON
            data={RAW_COMMUNITY_AREAS}
            onEachFeature={setAreaInteraction}
            key={maxNumPermits}
          />
        ) : null}
      </MapContainer>
    </>
  )
}
