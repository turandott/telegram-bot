import dotenv from "dotenv";
dotenv.config({ path: "./src/config/.env" });
import { Telegraf, Markup } from "telegraf";

const token: string | undefined = process.env.TOKEN;
import startController from "./controllers/startController.js";
import catController from "./controllers/catController.js";

const bot: Telegraf<any> = new Telegraf(token);

bot.use(startController);
bot.use(catController);

bot.launch();
