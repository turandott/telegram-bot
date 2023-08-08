import { Composer } from "telegraf";
import { Context } from "../types/index.js";
import weatherService from "../services/weatherService.js";
import { getWeatherResponse } from "../services/responseWeatherService.js";
const composer = new Composer<Context>();

composer.command("weather", (ctx: Context) => {
  ctx.reply(ctx.i18n.t("weather.city"));
});

composer.on("text", async (ctx) => {
  const city: string = ctx.message.text;
  try {
    const weatherResponse = await getWeatherResponse(city);
    console.log(weatherResponse);
    ctx.reply(weatherResponse);
  } catch (error) {
    ctx.reply(error.message);
  }
});

export default composer;
