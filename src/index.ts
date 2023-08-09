import dotenv from "dotenv";
dotenv.config({ path: "./src/config/.env" });
import { Telegraf, Scenes, session } from "telegraf";
import { Context } from "./types";
import controllers from "./controllers";
import cron from "node-cron";
import dbConnection from "./config/db";
import db from "./models";
// import db from "./models/index.js";
import restartWeatherSubscription from "./subscriptions/restartWeatherSubscribtion";
import { SceneSessionData } from "telegraf/typings/scenes/context.js";
// import sequelize from "./config/db.js";
import TelegrafI18n from "telegraf-i18n";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "telegraf-ratelimit";
import { limitConfig } from "./config/limit";
import mongoose from "./config/db";
const __filename = fileURLToPath(import.meta.url || "");
const __dirname = path.dirname(__filename || "");
const token: string | undefined = process.env.TOKEN;

const i18n = new TelegrafI18n({
  defaultLanguage: "en",
  allowMissing: false, // Default true
  directory: path.resolve(__dirname, "locales"),
});

const bot: Telegraf<Context> = new Telegraf(token);

const stage = new Scenes.Stage<Scenes.SceneContext>(
  [
    controllers.weatherScene,
    controllers.placesScene,
    controllers.unsubscribeScene,
    controllers.taskScene,
  ],
  {
    default: "super-wizard",
  },
);
bot.use(session());
bot.use(i18n.middleware());
bot.use(stage.middleware());
bot.use(rateLimit(limitConfig));

dbConnection.on("error", console.error.bind(console, "connection error:"));
dbConnection.once("open", function () {
  console.log("Database connected successfully");
});
db;
// const start = async () => {
//   try {
//     await sequelize.authenticate();
//     await sequelize.sync();
//     await db.sync();

//     console.log("U have connected to db");
//   } catch (e) {
//     console.log(`Error ${e.message}`);
//   }
// };

// start();

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

bot.command("tasks", async (ctx: Context) => {
  ctx.scene.enter("taskScene");
});

bot.use(controllers.startController);
bot.use(controllers.dogController);
bot.use(controllers.catController);
bot.use(controllers.weatherController);

restartWeatherSubscription(sendMessage);

bot.launch();
