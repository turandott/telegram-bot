import dotenv from "dotenv";
dotenv.config({ path: "./src/config/.env" });
import {
  Telegraf,
  Markup,
  Scenes,
  session,
  Context,
  Middleware,
} from "telegraf";

const token: string | undefined = process.env.TOKEN;
import startController from "./controllers/startController.js";
import dogController from "./controllers/dogController.js";
import catController from "./controllers/catController.js";
import weatherController from "./controllers/weatherController.js";
import weatherScene from "./controllers/subscribeController.js";
import placesScene from "./controllers/placeController.js";
import unsubscribeScene from "./controllers/unsubscribeController.js";
import cron from "node-cron";
import db from "./models/models.js";

const User = db.User;
const Weather = db.Weather;

import { SceneSessionData } from "telegraf/typings/scenes/context.js";
import sequelize from "./config/db.js";

const bot: Telegraf<Context> = new Telegraf(token);

const stage = new Scenes.Stage<Scenes.SceneContext>(
  [weatherScene, placesScene, unsubscribeScene],
  {
    default: "super-wizard",
  }
);
bot.use(session());

bot.use(stage.middleware());

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await db.sync();

    console.log("U have connected to db");
  } catch (e) {
    console.log(`Error ${e.message}`);
  }
};

start();

cron.schedule("* * * * *", async function () {
  let timeNow = new Date();
  let [hours, minutes] = [timeNow.getHours(), timeNow.getMinutes()];
  let currentTime = `${hours}:${minutes}:00`;

  try {
    const users = await User.findAll({ attributes: ["id", "chatId"] });
    for (const user of users) {
      const { id, chatId } = user.dataValues;

      const weather = await Weather.findOne({
        where: { id: id },
      });
      if (weather && weather.time == currentTime) {
        console.log(weather.time);
        bot.telegram.sendMessage(chatId, "ваш прогноз по подписке");
      } else {
        console.log(`No weather data found for user with ID: ${id}`);
      }
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
});

bot.command("subscribe", async (ctx: any) => {
  ctx.scene.enter("weatherScene");
});

bot.command("unsubscribe", async (ctx: any) => {
  ctx.scene.enter("unsubscribeScene");
});

bot.command("places", async (ctx: any) => {
  ctx.scene.enter("placesScene");
});
bot.use(startController);
bot.use(dogController);
bot.use(catController);
bot.use(weatherController);

bot.launch();
