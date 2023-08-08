import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
import weatherService from "../services/weatherService.js";
import cron from "node-cron";
import db from "../models/index.js";
import { isValidCity } from "../helpers/cityCheckHelper.js";
import { timeParser } from "../helpers/timeParserHelper.js";
import { isValidTime } from "../helpers/timeCheckHelper.js";
import { userToWetherSubscribe } from "../models/weatherSubscribe.js";
const User = db.User;
const Weather = db.Weather;

const stepEnterCity = new Composer<Scenes.WizardContext>();
const stepEnterTime = new Composer<Scenes.WizardContext>();
const stepGetWeather = new Composer<Scenes.WizardContext>();
const stepExit = new Composer<Scenes.WizardContext>();

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
    await ctx.reply(ctx.i18n.t("error.city_error")); // Update the error message to "invalid_city"
  }
});

stepGetWeather.on("text", async (ctx: any) => {
  try {
    const city = ctx.wizard.state.city;
    const user = ctx.wizard.state.user;

    let time = ctx.message.text;
    ctx.wizard.state.time = time;

    if (isValidTime(time)) {
      const [hours, minutes] = timeParser(time);

      await ctx.reply(ctx.i18n.t("weather.your_time", { time }));

      if (!ctx.session.weatherSubscriptions) {
        ctx.session.weatherSubscriptions = [];
      }

      userToWetherSubscribe(user, city, time);

      const job = cron.schedule(`${minutes} ${hours} * * *`, async () => {
        const city = ctx.wizard.state.city;
        const weather = await weatherService.getWeather(city);
        let currentWeather = await weather.current.condition.text.toLowerCase();
        let currentTempreture = await weather.current.temp_c;
        let currentWind = await weather.current.wind_mph;
        let currentHumidity = await weather.current.humidity;

        ctx.reply(
          ctx.i18n.t("weather.text", {
            city,
            currentWeather,
            currentTempreture,
            currentWind,
            currentHumidity,
          }),
        );
      });
      ctx.wizard.state.cronJob = job;
      const subscription = {
        city: city,
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
    console.log(error);
    await ctx.reply(ctx.i18n.t("error.time_error")); // Update the error message to "invalid_time"
  }
});

const weatherScene = new Scenes.WizardScene(
  "weatherScene",
  stepEnterCity,
  stepEnterTime,
  stepGetWeather,
);

export default weatherScene;
