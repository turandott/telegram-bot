import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
import weatherService from "../services/weatherService.js";
import cron from "node-cron";
import db from "../models/index.js";
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

  const city = ctx.message.text;
  const user = ctx.message.chat.id;

  ctx.wizard.state.city = city;
  ctx.wizard.state.user = user;
  await ctx.reply(ctx.i18n.t("weather.time"));
  return ctx.wizard.next();
});

stepGetWeather.hears(/^\d{2}:\d{2}$/, async (ctx: any) => {
  const city = ctx.wizard.state.city;
  const user = ctx.wizard.state.user;

  let time = ctx.message.text;
  ctx.wizard.state.time = time;

  await ctx.reply(ctx.i18n.t("weather.your_time", { time }));

  const [hours, minutes] = time.split(":");

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    ctx.reply(ctx.i18n.t("weather.invalid_time"));
    return;
  }

  if (!ctx.session.weatherSubscriptions) {
    ctx.session.weatherSubscriptions = [];
  }

  console.log(ctx.session.weatherSubscribtion);

  //check if the user with the chatId exists
  const existingUser = await User.findOne({ where: { chatId: user } });
  let existingWeather;
  if (existingUser) {
    existingWeather = await Weather.findOne({
      where: { id: existingUser.id },
    });
  }
  if (existingUser && existingWeather) {
    // user already exists update information
    await Weather.update(
      {
        city: city,
        time: time,
      },
      { where: { id: existingUser.id } }
    );
  } else if (existingUser && !existingWeather) {
    await Weather.create({
      id: existingUser.id,
      city: city,
      time: time,
    });
  } else {
    //user does not exist
    const newUser = await User.create({
      chatId: user,
    });

    await Weather.create({
      userId: newUser.id,
      city: city,
      time: time,
    });
  }

  const job = cron.schedule(`${minutes} ${hours} * * *`, async () => {
    const city = ctx.wizard.state.city;
    const weather = await weatherService.getWeather(city);
    console.log(weather);
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
      })
    );
  });
  ctx.wizard.state.cronJob = job;
  const subscription = {
    city: city,
    weatherSubscription: job,
    userId: user,
  };

  ctx.session.weatherSubscriptions.push(subscription);
  console.log(job.options.name);
  job.start();

  return ctx.wizard.next();
});

stepExit.command("leave", (ctx) => ctx.scene.leave());

const weatherScene = new Scenes.WizardScene(
  "weatherScene",
  stepEnterCity,
  stepEnterTime,
  stepGetWeather,
  stepExit
);

export default weatherScene;
