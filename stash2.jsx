import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import stateGeoJSON from "./MAPS/india-master/state/second-optimize.json"; // India States GeoJSON

const MapComponent = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [districtGeoJSON, setDistrictGeoJSON] = useState(null);
  const [subdistrictGeoJSON, setSubdistrictGeoJSON] = useState(null);
  const [filteredSubdistrictGeoJSON, setFilteredSubdistrictGeoJSON] = useState(null); // Filtered subdistrict data
  const [isDistrictView, setIsDistrictView] = useState(false);
  const [isSubdistrictView, setIsSubdistrictView] = useState(false);
  const mapRef = useRef();

  const districtStyle = {
    fillColor: "orange",
    weight: 1,
    opacity: 1,
    color: "white",
    fillOpacity: 0.7,
  };

  const subdistrictStyle = {
    fillColor: "yellow",
    weight: 1,
    opacity: 1,
    color: "white",
    fillOpacity: 0.7,
  };

  // Dynamically import subdistrict GeoJSON data
  useEffect(() => {
    const loadSubdistrictGeoJSON = async () => {
      const data = await import("./MAPS/india-master/STATES/TAMILNADU/TAMILNADU_SUBDISTRICTS.geojson");
      setSubdistrictGeoJSON(data);
    };
    loadSubdistrictGeoJSON();
  }, []);

  const onEachDistrictFeature = (feature, layer) => {
    const districtName = feature.properties.DISTRICT;
    layer.bindPopup(`${districtName}`);

    layer.on("click", (e) => {
      const latlng = e.latlng;
      setSelectedDistrict(districtName);
      setSelectedPosition(latlng);

      const bounds = layer.getBounds();
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });

      // Filter subdistricts for the selected district
      if (subdistrictGeoJSON) {
        const filteredData = {
          ...subdistrictGeoJSON,
          features: subdistrictGeoJSON.features.filter(
            (subdistrict) => subdistrict.properties.DISTRICT === districtName
          ),
        };
        setFilteredSubdistrictGeoJSON(filteredData);
        setIsSubdistrictView(true); // Toggle to subdistrict view
      }
    });
  };

  return (
    <div>
      <MapContainer
        center={[11.1271, 78.6569]} // Tamil Nadu's coordinates
        zoom={6}
        style={{ height: "100vh", width: "100vw" }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://carto.com">CartoDB</a> contributors'
        />

        {/* Render Districts GeoJSON */}
        {!isSubdistrictView && districtGeoJSON && (
          <GeoJSON data={districtGeoJSON} style={districtStyle} onEachFeature={onEachDistrictFeature} />
        )}

        {/* Render Filtered Subdistricts GeoJSON */}
        {isSubdistrictView && filteredSubdistrictGeoJSON && (
          <GeoJSON data={filteredSubdistrictGeoJSON} style={subdistrictStyle} />
        )}

        {/* Conditionally render Popup at selected position */}
        {selectedDistrict && selectedPosition && (
          <Popup position={selectedPosition} onClose={() => setSelectedDistrict(null)}>
            <div>
              <p>Selected District: {selectedDistrict}</p>
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
