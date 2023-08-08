import { Composer } from "telegraf";
import { Context } from "../types/index.js";
import weatherService from "../services/weatherService.js";
import { getWeatherResponse } from "../services/responseWeatherService.js";
import { isValidCity } from "../helpers/cityCheckHelper.js";
const composer = new Composer<Context>();

composer.command("weather", (ctx: Context) => {
  ctx.reply(ctx.i18n.t("weather.city"));
});

composer.on("text", async (ctx) => {
  const city: string = ctx.message.text;

  if (!isValidCity(city)) {
    return ctx.reply(ctx.i18n.t("error.city_error"));
  }
  try {
    const weatherResponse = await getWeatherResponse(city);
    console.log(weatherResponse);
    return ctx.reply(weatherResponse);
  } catch (error) {
    console.log(`error occure with weather: ${error}`);
    return ctx.reply(ctx.i18n.t("weather.error"));
  }
});

export default composer;
