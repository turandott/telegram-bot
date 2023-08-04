import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
import weatherService from "../services/weatherService.js";
import cron from "node-cron";
import db from "../models/models.js";
const User = db.User;
const Weather = db.Weather;


const stepEnterCity = new Composer<Scenes.WizardContext>();
const stepEnterTime = new Composer<Scenes.WizardContext>();
const stepGetWeather = new Composer<Scenes.WizardContext>();
// const stepFour = new Composer<Scenes.WizardContext>();
const stepExit = new Composer<Scenes.WizardContext>();

stepEnterCity.on("text", async (ctx: any) => {
  await ctx.reply("Enter the city for subscription");

  return ctx.wizard.next();
});

stepEnterTime.on("text", async (ctx: any) => {
  const city = ctx.message.text;
  const user = ctx.message.chat.id;

  ctx.wizard.state.city = city;
  ctx.wizard.state.user = user;
  await ctx.reply("Enter the time in HH:MM format for messages");
  return ctx.wizard.next();
});

stepGetWeather.hears(/^\d{2}:\d{2}$/, async (ctx: any) => {
  const city = ctx.wizard.state.city;
  const user = ctx.wizard.state.user;
  let time = ctx.message.text;
  ctx.wizard.state.time = time;

  await ctx.reply(` u have choosen time: ${time}`);

  const [hours, minutes] = time.split(":");

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    ctx.reply("Invalid time format. Please try again.");
    return;
  }

  // Check if the user with the chatId already exists in the database
  const existingUser = await User.findOne({ where: { chatId: user } });

  if (existingUser) {
    // If the user already exists update information
    await Weather.update(
      {
        city: city,
        time: time,
      },
      { where: { id: existingUser.id } }
    );
  } else {
    // If the user does not exist
    const newUser = await User.create({
      chatId: user,
    });

    await Weather.create({
      userId: newUser.id,
      city: city,
      time: time,
    });
  }

  // const job = cron.schedule(`${minutes} ${hours} * * *`, async () => {
  //   const city = ctx.wizard.state.city;
  //   const weather = await weatherService.getWeather(city);
  //   console.log(weather);
  //   ctx.reply(
  //     `The weather in ${city} is ${weather.current.condition.text.toLowerCase()}, the temperature is ${
  //       weather.current.temp_c
  //     }, wind speed is ${weather.current.wind_mph} mph, humidity is ${
  //       weather.current.humidity
  //     } percent.`
  //   );
  // });
  // ctx.wizard.state.cronJob = job;

  // job.start();

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
