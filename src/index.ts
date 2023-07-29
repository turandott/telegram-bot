import dotenv from "dotenv";
dotenv.config({ path: "./src/config/.env" });
import { Telegraf, Markup } from "telegraf";

const token: string | undefined = process.env.TOKEN;
import startController from "./controllers/startController.js";

const bot: Telegraf<any> = new Telegraf(token);

bot.use(startController);

bot.launch();
