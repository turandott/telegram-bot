import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
import cron from "node-cron";
import { isValidCity } from "../helpers/cityCheck.js";
import { userToWetherSubscribe } from "../models/weatherSubscribe.js";
import { getWeatherResponse } from "../helpers/weatherShow.js";
import timeCheck from "../helpers/timeCheck.js";

const stepEnterCity = new Composer<Scenes.WizardContext>();
const stepEnterTime = new Composer<Scenes.WizardContext>();
const stepGetWeather = new Composer<Scenes.WizardContext>();

stepEnterCity.on("text", async (ctx: any) => {
  await ctx.reply(ctx.i18n.t("weather.city"));
  return ctx.wizard.next();
});

stepEnterTime.on("text", async (ctx: any) => {
  try {
    const city = ctx.message.text;
    const user = ctx.message.chat.id;

    if (!isValidCity(city)) {
      return ctx.reply(ctx.i18n.t("error.city_error"));
    }

    ctx.wizard.state.city = city;
    ctx.wizard.state.user = user;

    await ctx.reply(ctx.i18n.t("weather.time"));
    return ctx.wizard.next();
  } catch (error) {
    console.log(error);
    await ctx.reply(ctx.i18n.t("error.city_error"));
  }
});

stepGetWeather.on("text", async (ctx: any) => {
  try {
    const city = ctx.wizard.state.city;
    const user = ctx.wizard.state.user;

    let time = ctx.message.text;
    ctx.wizard.state.time = time;

    if (timeCheck.isValidTime(time)) {
      const [hours, minutes] = timeCheck.timeParser(time);

      await ctx.reply(ctx.i18n.t("weather.your_time", { time }));

      if (!ctx.session.weatherSubscriptions) {
        ctx.session.weatherSubscriptions = [];
      }

      userToWetherSubscribe(user, city, time);

      const job = cron.schedule(`${minutes} ${hours} * * *`, async () => {
        const city = ctx.wizard.state.city;
        ctx.reply(await getWeatherResponse(city));
      });
      ctx.wizard.state.cronJob = job;
      const subscription = {
        weatherSubscription: job,
        userId: user,
      };

      ctx.session.weatherSubscriptions.push(subscription);
      job.start();

      return ctx.scene.leave();
    } else {
      return ctx.reply(ctx.i18n.t("error.time_error"));
    }
  } catch (error) {
    console.log(`error occure with weather: ${error}`);
    return ctx.reply(ctx.i18n.t("weather.error"));
  }
});

const weatherSubscribeScene = new Scenes.WizardScene(
  "weatherSubscribeScene",
  stepEnterCity,
  stepEnterTime,
  stepGetWeather,
);

export default weatherSubscribeScene;
