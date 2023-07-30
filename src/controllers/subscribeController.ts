import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
import weatherService from "../services/weatherService.js";

import cron from "node-cron";

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
  ctx.wizard.state.city = city;
  await ctx.reply("Enter the time in HH:MM format for messages");
  return ctx.wizard.next();
});

stepGetWeather.hears(/^\d{2}:\d{2}$/, async (ctx: any) => {
  let time = ctx.message.text;
  ctx.wizard.state.time = time;
  await ctx.reply(` u have choosen time: ${time}`);

  const [hours, minutes] = time.split(":");

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    ctx.reply("Invalid time format. Please try again.");
    return;
  }

  const job = cron.schedule(`${minutes} ${hours} * * *`, async () => {
    const city = ctx.wizard.state.city;
    const weather = await weatherService.getWeather(city);
    console.log(weather);
    ctx.reply(
      `The weather in ${city} is ${weather.current.condition.text.toLowerCase()}, the temperature is ${
        weather.current.temp_c
      }, wind speed is ${weather.current.wind_mph} mph, humidity is ${
        weather.current.humidity
      } percent.`
    );
  });
  ctx.wizard.state.cronJob = job;

  job.start();

  return ctx.wizard.next();
});

// stepFour.command("unsubscribe", (ctx) => {
//   if (ctx.state.cronJob) {
//     ctx.state.cronJob.stop();
//     delete ctx.state.cronJob;
//   }
//   ctx.reply("You have unsubscribed from receiving the scheduled message.");
// });

stepExit.command("leave", (ctx) => ctx.scene.leave());

const weatherScene = new Scenes.WizardScene(
  "weatherScene",
  stepEnterCity,
  stepEnterTime,
  stepGetWeather,
  stepExit
);

export default weatherScene;
