import dotenv from "dotenv";
dotenv.config({ path: "./src/config/.env" });
import { Telegraf, Scenes, session } from "telegraf";
import { Context } from "./types";
const token: string | undefined = process.env.TOKEN;
import controllers from "./controllers";
import cron from "node-cron";
import db from "./models/index.js";
import restartWeatherSubscription from "./subscriptions/restartWeatherSubscribtion";
import { SceneSessionData } from "telegraf/typings/scenes/context.js";
import sequelize from "./config/db.js";


const bot: Telegraf<Context> = new Telegraf(token);

const stage = new Scenes.Stage<Scenes.SceneContext>(
  [
    controllers.weatherScene,
    controllers.placesScene,
    controllers.unsubscribeScene,
  ],
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

function sendMessage(chatId, message) {
  bot.telegram.sendMessage(chatId, message);
}

bot.command("subscribe", async (ctx: Context) => {
  ctx.scene.enter("weatherScene");
});

bot.command("unsubscribe", async (ctx: Context) => {
  ctx.scene.enter("unsubscribeScene");
});

bot.command("places", async (ctx: Context) => {
  ctx.scene.enter("placesScene");
});

bot.use(controllers.startController);
bot.use(controllers.dogController);
bot.use(controllers.catController);
bot.use(controllers.weatherController);

restartWeatherSubscription(sendMessage);

bot.launch();
