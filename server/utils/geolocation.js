const axios = require("axios");

async function getCoordinates(address) {
  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.gomaps.pro/maps/api/js?address=${encodeURIComponent(address)}&key=${API_KEY}`;
  
  const response = await axios.get(url);
  console.log(response);
  
  const { lat, lng } = response.data.results[0].geometry.location;
  return { lat, lng };
}

module.exports = getCoordinates;
