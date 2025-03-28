const axios = require("axios");

async function getCoordinates(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  
  const response = await axios.get(url);
  console.log(response);
  
  const lat = parseFloat(response.data[0].lat) ?? null;
  const lng = parseFloat(response.data[0].lon) ?? null;
  
  return { lat, lng };
}

module.exports = getCoordinates;
