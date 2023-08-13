import axios from 'axios';

import { WEATHER_API, WEATHER_KEY } from '../config/env.config';

const getWeather = async (city: string) => {
  try {
    const response = await axios.get(WEATHER_API, {
      params: { q: city },
      headers: {
        'x-rapidapi-key': WEATHER_KEY,
        'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com',
      },
    });
    console.log(response.data.current);
    return response.data.current;
  } catch (error) {
    console.error(error);
  }
};

export default { getWeather };
