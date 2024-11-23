const getAdministrativeDivisions = async (lat, lng) => {
    const apiKey = "apikey"; // Replace with your API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.results && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;
        
        // Extract all administrative levels
        const divisions = {};
        for (let level = 1; level <= 5; level++) {
          const division = addressComponents.find(component =>
            component.types.includes(`administrative_area_level_${level}`)
          );
          if (division) {
            divisions[`level_${level}`] = division.long_name;
          }
        }
  
        // Add fallback for missing levels
        for (let level = 1; level <= 5; level++) {
          if (!divisions[`level_${level}`]) {
            divisions[`level_${level}`] = "Not available";
          }
        }
  
        return divisions;
      }
      return { error: "No results found" };
    } catch (error) {
      console.error("Error fetching administrative divisions:", error);
      return { error: "Error occurred" };
    }
  };
  
  // Example usage
  getAdministrativeDivisions(10.8505, 77.8510).then(console.log);
  