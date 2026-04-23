const axios = require("axios");

async function getCoords(location) {
  const res = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
      q: location,
      format: "json",
      limit: 1,
    },
    headers: {
      "User-Agent": "wanderlust",
    },
  });

  if (res.data.length === 0) return null;

  return {
    lat: res.data[0].lat,
    lng: res.data[0].lon,
  };
}

module.exports = { getCoords };
