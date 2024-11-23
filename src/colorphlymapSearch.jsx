import React, { useState, useRef,useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Autocomplete from "react-google-autocomplete";

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [searchPosition, setSearchPosition] = useState(null);
  const [searchDetails, setSearchDetails] = useState(null);

  const mapRef = useRef();


  useEffect(()=>{

    console.log(searchPosition?.lat, searchPosition?.lng)
  },[searchPosition]
  )
  // Function to handle reverse geocoding and extract district and state
  const reverseGeocode = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    const latLng = new window.google.maps.LatLng(lat, lng);

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        const addressComponents = results[0].address_components;
        const { district, state } = extractLocationDetails(addressComponents);

        // Update state with the location details
        setSearchDetails({
          name: results[0].formatted_address,
          district,
          state,
        });
      } else {
        alert("Geocoder failed or no results found.");
      }
    });
  };

  // Helper function to extract district and state from address components
  const extractLocationDetails = (addressComponents) => {
    let district = "";
    let state = "";

    addressComponents.forEach((component) => {
      const types = component.types;
      if (types.includes("administrative_area_level_3")) {
        district = component.long_name; // District
      }
      if (types.includes("administrative_area_level_1")) {
        state = component.long_name; // State
      }
    });

    return { district, state };
  };

  // Function to handle place selection (from Autocomplete search)
const handlePlaceSelected = (place) => {
  if (!place || !place.geometry) {
    alert("Location not found or invalid place!");
    return;
  }

  const { lat, lng } = place.geometry.location;
  const location = { lat: lat(), lng: lng() };

  // Ensure address_components are present before extracting details
  if (place.address_components && place.address_components.length > 0) {
    const { district, state } = extractLocationDetails(place.address_components);

    // Update the position and perform reverse geocoding to get district and state
    setSearchPosition(location);
    setSearchDetails({
      name: place.formatted_address || "Unknown Location",
      district: district || "Unknown District",
      state: state || "Unknown State",
    });
  } else {
    alert("No address components found for the selected place.");
  }

  // Center the map on the selected location
  if (mapRef.current) {
    mapRef.current.setView([location.lat, location.lng], 10);
  }
};


  return (
    <div>
      {/* Search Bar */}
      <div style={{ position: "absolute", top: "10px", zIndex: 1000, width: "50%" }}>
        <Autocomplete
          apiKey="AIzaSyCxpDBxDfuDG7lJ64iaaSOixb12WqPPdQo" // Replace with your Google Maps API key
          onPlaceSelected={handlePlaceSelected}
          types={["(regions)"]} // Restrict results to regions
          placeholder="Search for a village, city, or district"
          style={{
            width: "100%",
            height: "40px",
            padding: "0 12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>

      {/* Map */}
      <MapContainer
        center={[22.9734, 78.6569]} // Default center (India)
        zoom={5}
        style={{ height: "100vh", width: "100vw" }}
        whenCreated={setMap}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marker for Search */}
        {searchPosition && (
          <Marker position={[searchPosition.lat, searchPosition.lng]}>
            <Popup>
              <strong>{searchDetails.name}</strong>
              <br />
              <span>{`District: ${searchDetails.district}`}</span>
              <br />
              <span>{`State: ${searchDetails.state}`}</span>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
