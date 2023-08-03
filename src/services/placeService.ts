import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const key: string = process.env.PLACE_KEY;
const url = "https://api.opentripmap.com/0.1/en/places/";

async function getCity(city: string, kind: string): Promise<any> {
  try {
    const { lat, lon } = (
      await axios.get(
        `${url}geoname?name=${city}&apikey=${process.env.PLACE_KEY}`
      )
    ).data;
    console.log(lat, lon);
    const placesId = await getListOfPlaces(lon, lat, kind);
    console.log(placesId);
    let sights = [];

    for (const placeId of placesId) {
      const sight = await getSight(placeId);
      sights.push(sight);
    }

    console.log(sights);
    return sights;
  } catch (error) {
    console.error("Error fetching:", error);
    throw error;
  }
}

async function getListOfPlaces(lon: number, lat: number, kind: string) {
  try {
    const response = await axios.get(
      `${url}radius?radius=5000&lon=${lon}&lat=${lat}&kinds=${kind}&rate=1&limit=4&apikey=${process.env.PLACE_KEY}`
    );
    const places = response.data.features.map((feature) => feature.id);
    console.log(places);
    return places;
  } catch (error) {
    console.error("Error fetching:", error);
    throw error;
  }
}

async function getSight(id) {
  const response = await axios.get(
    `${url}xid/${id}?apikey=${process.env.PLACE_KEY}`
  );
  console.log(`${url}xid/${id}?apikey=${process.env.PLACE_KEY}`);
  const sight = response.data;
  console.log(sight);
  const info = {
    name: sight.name,
    adress: `${sight.address.city_district} ${sight.address.house_number}`,
  };
  console.log(info);
  return info;
}

export default { getCity };
