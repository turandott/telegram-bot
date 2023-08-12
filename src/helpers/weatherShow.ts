import weatherService from "../services/weatherService";

export const getWeatherResponse = async (city: string): Promise<string> => {
  try {
    const weather = await weatherService.getWeather(city);
    return `The weather in ${city} is ${weather.condition.text.toLowerCase()}, the temperature is ${
      weather.temp_c
    }, wind speed is ${weather.wind_mph} mph, humidity is ${
      weather.humidity
    } percent.`;
  } catch (error) {
    throw new Error("City not found. Please enter a valid city name.");
  }
};
