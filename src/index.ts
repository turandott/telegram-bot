import dotenv from "dotenv";
dotenv.config({ path: "./src/config/.env" });
import { Telegraf, Markup } from "telegraf";

const token: string | undefined = process.env.TOKEN;
import startController from "./controllers/startController.js";
import dogController from "./controllers/dogController.js";
import catController from "./controllers/catController.js";
import weatherController from "./controllers/weatherController.js";

const bot: Telegraf<any> = new Telegraf(token);

bot.use(startController);
bot.use(dogController);
bot.use(catController);
bot.use(weatherController);

bot.launch();
