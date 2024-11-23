import React, { useState, useRef } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import state from "./MAPS/output.json"; // Replace with your GeoJSON file path
import second from "./MAPS/second-optimize.json"; // Your second GeoJSON file

const MapComponent = () => {
  const [selectedDistrict, setSelectedDistrict] = useState(null); // State to track selected district
  const mapRef = useRef(); // Reference to access the map instance

  // Function to generate a random color
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Function to style the regions (each district gets a random color)
  const style = (feature) => {
    const districtName = feature.properties.name; // Assuming district name is in 'name'
    return {
      fillColor: getRandomColor(), // Random fill color for each district
      weight: 2,
      opacity: 1,
      color: selectedDistrict === districtName ? "green" : "white", // Green border for selected district
      fillOpacity: 0.7,
    };
  };

  // Function to bind a tooltip and add a click event to zoom to the district and highlight it
  const onEachFeature = (feature, layer) => {
    const districtName = feature.properties.name;
    layer.bindTooltip(`${districtName}`, { sticky: true });

    // Add click event to zoom to the district and highlight border
    layer.on("click", () => {
      setSelectedDistrict(districtName); // Set the clicked district as selected
      const bounds = layer.getBounds();
      mapRef.current.fitBounds(bounds, { padding: [50, 50] }); // Zoom to the clicked district
    });
  };

  return (
    <div>
      <MapContainer
        center={[22.9734, 78.6569]} // Change to your preferred coordinates
        zoom={5}
        style={{ height: "100vh", width: "100vw" }}
        ref={mapRef} // Reference to the map instance
      >
        <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://carto.com">CartoDB</a> contributors'
      />

        <GeoJSON
          data={second} // Replace with the data source you'd like to use
          style={style}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
