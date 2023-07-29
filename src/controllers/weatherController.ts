import { Composer, Context } from "telegraf";
import weatherService from "../services/weatherService.js";

const composer = new Composer<Context>();

composer.command("weather", (ctx) => {
  ctx.reply("Please enter the city:");
});

composer.on("text", async (ctx) => {
  const city: string = ctx.message.text;
  // try {
  const weather = await weatherService.getWeather(city);
  console.log(weather);
  ctx.reply(
    `The weather in ${city} is ${weather.current.condition.text.toLowerCase()}, the temperature is ${
      weather.current.temp_c
    }, wind speed is ${weather.current.wind_mph} mph, humidity is ${
      weather.current.humidity
    } percent.`
  );
  // } catch (error) {
  //   ctx.reply("Error: City not found. Please enter a valid city name.");
  // }
});

export default composer;
