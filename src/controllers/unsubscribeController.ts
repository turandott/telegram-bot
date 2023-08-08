import { Composer, Context, Scenes, session } from "telegraf";
import db from "../models/index.js";
const User = db.User;
const Weather = db.Weather;

const stepUnsubscribe = new Composer<Scenes.WizardContext>();
const stepExit = new Composer<Scenes.WizardContext>();

stepUnsubscribe.on("text", async (ctx: any) => {
  const userId = ctx.message.chat.id;
  const existingUser = await User.findOne({ where: { chatId: userId } });

  await Weather.destroy({ where: { id: existingUser.id } });

  await User.destroy({ where: { chatId: userId } });
  if (ctx.session.state.cronJob) {
    ctx.state.cronJob.stop();
    delete ctx.state.cronJob;
  }
  let subscriptions = ctx.session.weatherSubscriptions || [];
  console.log(ctx.session.weatherSubscriptions);

  subscriptions.forEach((subscription: any) => {
    if (
      subscription &&
      subscription.weatherSubscription &&
      subscription.userId == userId
    ) {
      subscription.weatherSubscription.stop();
    }
  });

  subscriptions = subscriptions.filter((subscription: any) => {
    console.log(subscription);
    return subscription.userId !== userId;
  });

  ctx.session.weatherSubscriptions = subscriptions;
  console.log(ctx.session.weatherSubscriptions);
  ctx.reply("You have unsubscribed from receiving the scheduled message.");
  ctx.scene.leave();
});

const unsubscribeScene = new Scenes.WizardScene(
  "unsubscribeScene",
  stepUnsubscribe
);

export default unsubscribeScene;
