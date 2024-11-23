// const fetch = require("node-fetch");

const getAdministrativeDetailsOpenCage = async (lat, lng) => {
  const apiKey = "apikey"; // Replace with your OpenCage API key
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const components = data.results[0].components;

      // Extract key administrative divisions
      const state = components.state || "Not available";
      const district = components.county || "Not available"; // Often maps to "district"
      const taluk = components.suburb || components.municipality || "Not available"; // Possible mappings for taluk
      const country = components.country || "Not available";

      return { state, district, taluk, country };
    }
    return { error: "No results found" };
  } catch (error) {
    console.error("Error fetching administrative details:", error);
    return { error: "Error occurred" };
  }
};

// Example usage
getAdministrativeDetailsOpenCage(10.9496922, 77.8331546).then(console.log);
