import weatherService from "./weatherService";

export const getWeatherResponse = async (city: string): Promise<string> => {
  try {
    const weather = await weatherService.getWeather(city);
    return `The weather in ${city} is ${weather.current.condition.text.toLowerCase()}, the temperature is ${
      weather.current.temp_c
    }, wind speed is ${weather.current.wind_mph} mph, humidity is ${
      weather.current.humidity
    } percent.`;
  } catch (error) {
    throw new Error("City not found. Please enter a valid city name.");
  }
};
