import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const key: string = process.env.PLACE_KEY;

async function getCity(city: string, kind: string): Promise<any> {
  try {
    const { lat, lon } = (
      await axios.get(
        `${process.env.PLACE_API}geoname?name=${city}&apikey=${process.env.PLACE_KEY}`
      )
    ).data;
    const placesId = await getListOfPlaces(lon, lat, kind);
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
      `${process.env.PLACE_API}radius?radius=5000&lon=${lon}&lat=${lat}&kinds=${kind}&rate=1&limit=4&apikey=${process.env.PLACE_KEY}`
    );
    const places = response.data.features.map((feature) => feature.id);
    return places;
  } catch (error) {
    console.error("Error fetching:", error);
    throw error;
  }
}

async function getSight(id) {
  const response = await axios.get(
    `${process.env.PLACE_API}xid/${id}?apikey=${process.env.PLACE_KEY}`
  );
  const sight = response.data;
  const info = {
    name: sight.name,
    adress: `${sight.address.city_district} ${sight.address.house_number}`,
  };
  return info;
}

export default { getCity };
