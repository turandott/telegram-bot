import { Composer, Scenes } from "telegraf";
import { getWeatherResponse } from "../helpers/weatherShow.js";
import { isValidCity } from "../helpers/cityCheck.js";

const stepEnterCity = new Composer<Scenes.WizardContext>();
const stepWeather = new Composer<Scenes.WizardContext>();

stepEnterCity.on("text", async (ctx: any) => {
  await ctx.reply(ctx.i18n.t("weather.city"));
  return ctx.wizard.next();
});

stepWeather.on("text", async (ctx: any) => {
  const city: string = ctx.message.text;

  if (!isValidCity(city)) {
    return ctx.reply(ctx.i18n.t("error.city_error"));
  }
  try {
    const weatherResponse = await getWeatherResponse(city);
    console.log(weatherResponse);
    console.log(weatherResponse);
    await ctx.reply(weatherResponse);
    return ctx.scene.leave();
  } catch (error) {
    console.log(`error occure with weather: ${error}`);
    await ctx.reply(ctx.i18n.t("weather.error"));
    return ctx.scene.leave();
  }
});

const weatherScene = new Scenes.WizardScene(
  "weatherScene",
  stepEnterCity,
  stepWeather,
);

export default weatherScene;
