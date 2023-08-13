import { Telegraf, Scenes, session } from "telegraf";
import { Context } from "./types";
import controllers from "./controllers";
import dbConnection from "./config/db";
import restartWeatherSubscription from "./subscriptions/restartWeatherSubscribtion";
import rateLimit from "telegraf-ratelimit";
import { limitConfig } from "./config/limit";
import restartTaskSubscription from "./subscriptions/restartTaskSubscribtion";
import i18n from "./config/localization";
import { TOKEN } from "./config/env.config";

const token: string | undefined = TOKEN;

i18n;
const bot: Telegraf<Context> = new Telegraf(token);

const stage = new Scenes.Stage<Scenes.SceneContext>(
  [
    controllers.weatherSubscribeScene,
    controllers.placesScene,
    controllers.unsubscribeWeatherScene,
    controllers.weatherScene,
    controllers.taskScene,
    controllers.taskCreateScene,
    controllers.taskShowScene,
    controllers.taskDeleteScene,
    controllers.taskSubscribeScene,
    controllers.taskUnsubscribeScene,
    controllers.taskExitScene,
  ],
  {
    default: "super-wizard",
  },
);
bot.use(session());
bot.use(i18n.middleware());
bot.use(stage.middleware());
bot.use(rateLimit(limitConfig));

dbConnection;

function sendMessage(chatId, message) {
  bot.telegram.sendMessage(chatId, message);
}

bot.command("subscribe", async (ctx: Context) => {
  ctx.scene.enter("weatherSubscribeScene");
});

bot.command("unsubscribe", async (ctx: Context) => {
  ctx.scene.enter("unsubscribeWeatherScene");
});

bot.command("places", async (ctx: Context) => {
  ctx.scene.enter("placesScene");
});

bot.command("tasks", async (ctx: Context) => {
  ctx.scene.enter("taskScene");
});

bot.command("weather", async (ctx: Context) => {
  ctx.scene.enter("weatherScene");
});

bot.use(controllers.startController);
bot.use(controllers.dogController);
bot.use(controllers.catController);

bot.on("message", (ctx) => ctx.reply(ctx.i18n.t("start.no_command")));

restartWeatherSubscription(sendMessage);
restartTaskSubscription(sendMessage);
bot.launch();
