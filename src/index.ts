import dotenv from "dotenv";
dotenv.config({ path: "./src/config/.env" });
import { Telegraf, Markup, session, Context, Scenes } from "telegraf";

const token: string | undefined = process.env.TOKEN;
import startController from "./controllers/startController.js";
import dogController from "./controllers/dogController.js";
import catController from "./controllers/catController.js";
import weatherController from "./controllers/weatherController.js";
// import unsubscribeController from "./controllers/unsubscribeController.js";
import weatherScene from "./controllers/subscribeController.js";
import placesScene from "./controllers/placeController.js";

import { SceneSessionData } from "telegraf/typings/scenes/context.js";
// import sequelize from "./config/db.js";
// import db from "./models/models.js";

const bot: Telegraf<Context> = new Telegraf(token);
const stage = new Scenes.Stage<Scenes.SceneContext>([ placesScene], {
  default: "super-wizard",
});

bot.use(session());
bot.use(stage.middleware());

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

bot.use(startController);
bot.use(dogController);
bot.use(catController);
// bot.use(unsubscribeController);

// bot.use(weatherController);
// bot.command("subscribe", async (ctx: any) => {
//   ctx.scene.enter("weatherScene");
// });
bot.command("places", async (ctx: any) => {
  ctx.scene.enter("placesScene");
});
bot.launch();
