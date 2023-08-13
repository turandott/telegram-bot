import axios from 'axios';

import { PLACE_API, PLACE_KEY } from '../config/env.config';
import { Place } from '../types';

async function getCity(city: string, kind: string): Promise<Place[]> {
  try {
    const { lat, lon } = await getLocation(city);

    if (!lat || !lon) {
      throw new Error('NoCity');
    }

    const placesId = await getListOfPlaces(lon, lat, kind);
    const sights = [];

    for (const placeId of placesId) {
      const sight = await getSight(placeId);
      sights.push(sight);
    }

    console.log(sights);
    return sights;
  } catch (error) {
    if (error.message === 'NoCity') {
      console.log('Location not found.');
    }
    console.error('Error fetching:', error);
    throw error;
  }
}

async function getLocation(city: string) {
  try {
    const { lat, lon } = (
      await axios.get(`${PLACE_API}geoname?name=${city}&apikey=${PLACE_KEY}`)
    ).data;

    return { lat, lon };
  } catch (error) {
    console.log('No location found');
    throw error;
  }
}

async function getListOfPlaces(
  lon: number,
  lat: number,
  kind: string,
): Promise<string[]> {
  try {
    const response = await axios.get(
      `${PLACE_API}radius?radius=5000&lon=${lon}&lat=${lat}&kinds=${kind}&rate=1&limit=4&apikey=${PLACE_KEY}`,
    );
    const places = response.data.features.map((feature) => feature.id);
    return places;
  } catch (error) {
    console.error('Error fetching:', error);
    throw error;
  }
}

async function getSight(id: string): Promise<Place> {
  const response = await axios.get(`${PLACE_API}xid/${id}?apikey=${PLACE_KEY}`);
  const sight = response.data;
  const info = {
    name: sight.name,
    adress: `${sight.address.city_district} ${sight.address.house_number}`,
  };
  return info;
}

export default { getCity, getLocation };
