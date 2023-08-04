import { Composer, Context, Scenes, session } from "telegraf";
import db from "../models/models.js";
const User = db.User;
const Weather = db.Weather;

const stepUnsubscribe = new Composer<Scenes.WizardContext>();
const stepExit = new Composer<Scenes.WizardContext>();

stepUnsubscribe.on("text", async (ctx: any) => {
  const userId = ctx.message.chat.id;
  const existingUser = await User.findOne({ where: { chatId: userId } });

  await Weather.destroy({ where: { id: existingUser.id } });
  //   await User.destroy({ where: { chatId: userId } });
  //   if (ctx.session.state.cronJob) {
  //     ctx.state.cronJob.stop();
  //     delete ctx.state.cronJob;
  //   }

  ctx.reply("You have unsubscribed from receiving the scheduled message.");
  ctx.scene.leave();
});

const unsubscribeScene = new Scenes.WizardScene(
  "unsubscribeScene",
  stepUnsubscribe,
);

export default unsubscribeScene;
