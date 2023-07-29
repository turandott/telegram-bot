import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const getWeather = async (city: string) => {
  try {
    const response = await axios.get(
      "https://weatherapi-com.p.rapidapi.com/current.json",
      {
        params: { q: city },
        headers: {
          "x-rapidapi-key": process.env.WEATHER_KEY,
          "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default { getWeather };
