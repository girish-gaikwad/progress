import React, { useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import stateGeoJSON from "./MAPS/india-master/state/second-optimize.json";

const MapComponent = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedSubdistrict, setSelectedSubdistrict] = useState(null);
  const [districtGeoJSON, setDistrictGeoJSON] = useState(null);
  const [subdistrictGeoJSON, setSubdistrictGeoJSON] = useState(null);
  const [history, setHistory] = useState([]);

  const mapRef = useRef();

  const stateColors = useMemo(() => {
    const colors = {};
    stateGeoJSON.features.forEach((feature) => {
      colors[feature.properties.ST_NM] = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
    });
    return colors;
  }, []);

  const stateStyle = (feature) => ({
    fillColor: stateColors[feature.properties.ST_NM],
    weight: 2,
    opacity: 1,
    color: selectedState === feature.properties.ST_NM ? "green" : "white",
    fillOpacity: 0.7,
  });

  const districtStyle = {
    fillColor: "orange",
    weight: 1,
    opacity: 1,
    color: "white",
    fillOpacity: 0.7,
  };

  const subdistrictStyle = {
    fillColor: "blue",
    weight: 1,
    opacity: 1,
    color: "white",
    fillOpacity: 0.7,
  };

  const onEachStateFeature = (feature, layer) => {
    const stateName = feature.properties.ST_NM;
    layer.bindPopup(stateName);

    layer.on("click", (e) => {
      const latlng = e.latlng;
      setSelectedState(stateName);
      setSelectedPosition(latlng);

      setHistory((prev) => [...prev, { level: "state" }]);

      try {
        const bounds = layer.getBounds();
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      } catch (err) {
        console.error("Error fitting bounds:", err);
      }
    });
  };

  const onEachDistrictFeature = (feature, layer) => {
    const districtName = feature.properties.dtname;
    layer.bindPopup(districtName);

    layer.on("click", (e) => {
      const latlng = e.latlng;
      setSelectedDistrict(districtName);
      setSelectedPosition(latlng);

      setHistory((prev) => [...prev, { level: "district", data: districtGeoJSON }]);

      try {
        const bounds = layer.getBounds();
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      } catch (err) {
        console.error("Error fitting bounds:", err);
      }
    });
  };

  const onEachSubdistrictFeature = (feature, layer) => {
    const subdistrictName = feature.properties.sdtname || "Unnamed Subdistrict"; // Fallback for missing names
    layer.bindPopup(subdistrictName);

    layer.on("click", (e) => {
      const latlng = e.latlng;
      setSelectedSubdistrict({ name: subdistrictName, position: latlng });

      setHistory((prev) => [...prev, { level: "subdistrict", data: subdistrictGeoJSON }]);

      try {
        const bounds = layer.getBounds();
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      } catch (err) {
        console.error("Error fitting bounds:", err);
      }
    });
  };

  const loadDistricts = async (stateName) => {
    console.log(history)

    try {
      const districtData = await import(`./MAPS/india-master/test/${stateName}.json`);
      setDistrictGeoJSON(districtData.default);
      setSubdistrictGeoJSON(null);

      const bounds = L.geoJSON(districtData.default).getBounds();
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    } catch (error) {
      console.error("Error loading district data:", error);
    }
  };

  const loadSubdistricts = async (districtName) => {
    console.log(history)

    try {
      const subdistrictData = await import(`./MAPS/india-master/test2/india_taluk.json`);
      const filteredFeatures = subdistrictData.default.features.filter(
        (feature) => feature.properties.dtname.toLowerCase() === districtName.toLowerCase()
      );

      if (!filteredFeatures.length) {
        alert("No subdistricts found for this district.");
        return;
      }

      setSubdistrictGeoJSON({ type: "FeatureCollection", features: filteredFeatures });
      setDistrictGeoJSON(null);

      const bounds = L.geoJSON(filteredFeatures).getBounds();
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    } catch (error) {
      console.error("Error loading subdistrict data:", error);
    }
  };

  const goBack = () => {
    if (history.length === 0) return; // If no history, do nothing
  
    const lastAction = history.pop(); // Get the last action from history
    setHistory([...history]); // Update the history state
  
    if (lastAction.level === "subdistrict") {
      // If the last action was loading subdistricts
      if (history.length > 0) {
        const previousDistrictAction = history.find((item) => item.level === "district");
        if (previousDistrictAction) {
          setDistrictGeoJSON(previousDistrictAction.data); // Load district data
          setSubdistrictGeoJSON(null); // Clear subdistrict data
          setSelectedSubdistrict(null); // Clear selected subdistrict
        }
      } else {
        // Fallback to clearing everything if no previous district
        setDistrictGeoJSON(null);
        setSubdistrictGeoJSON(null);
        setSelectedSubdistrict(null);
      }
    } else if (lastAction.level === "district") {
      // If the last action was loading districts
      setDistrictGeoJSON(null); // Clear district data
      setSubdistrictGeoJSON(null); // Clear subdistrict data
      setSelectedDistrict(null); // Clear selected district
      setSelectedState(null); // Clear selected state
    } else if (lastAction.level === "state") {
      // If the last action was loading states
      setDistrictGeoJSON(null); // Clear district data
      setSubdistrictGeoJSON(null); // Clear subdistrict data
      setSelectedState(null); // Clear selected state
    }
  };
  

  return (
    <MapContainer center={[22.9734, 78.6569]} zoom={5} style={{ height: "100vh", width: "100vw" }} ref={mapRef}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://carto.com">CartoDB</a> contributors'
      />
      {!districtGeoJSON && !subdistrictGeoJSON && (
        <GeoJSON data={stateGeoJSON} style={stateStyle} onEachFeature={onEachStateFeature} />
      )}
      {districtGeoJSON && (
        <GeoJSON data={districtGeoJSON} style={districtStyle} onEachFeature={onEachDistrictFeature} />
      )}
      {subdistrictGeoJSON && (
        <GeoJSON data={subdistrictGeoJSON} style={subdistrictStyle} onEachFeature={onEachSubdistrictFeature} />
      )}
      {selectedState && selectedPosition && (
        <Popup position={selectedPosition} onClose={() => setSelectedState(null)}>
          <div>
            <p>Selected State: {selectedState}</p>
            <button onClick={() => loadDistricts(selectedState)}>Show Districts</button>
            <button style={{ color: "red" }} onClick={goBack}>
              Go Back
            </button>
          </div>
        </Popup>
      )}
      {selectedDistrict && selectedPosition && (
        <Popup position={selectedPosition} onClose={() => setSelectedDistrict(null)}>
          <div>
            <p>Selected District: {selectedDistrict}</p>
            <button onClick={() => loadSubdistricts(selectedDistrict)}>Show Subdistricts</button>
            <button style={{ color: "red" }} onClick={goBack}>
              Go Back
            </button>
          </div>
        </Popup>
      )}
      {selectedSubdistrict && selectedSubdistrict.position && (
        <Popup position={selectedSubdistrict.position} onClose={() => setSelectedSubdistrict(null)}>
          <div>
            <p>Selected Subdistrict: {selectedSubdistrict.name}</p>
            <button style={{ color: "red" }} onClick={goBack}>
              Go Back
            </button>
          </div>
        </Popup>
      )}
    </MapContainer>
  );
};

export default MapComponent;
