import { Composer, Scenes } from 'telegraf';

import { userToWetherUnsubscribe } from '../models/weatherUnsubscribe.js';

const stepUnsubscribe = new Composer<Scenes.WizardContext>();
const stepExit = new Composer<Scenes.WizardContext>();

stepUnsubscribe.on('text', async (ctx: any) => {
  try {
    const userId = ctx.message.chat.id;
    userToWetherUnsubscribe(userId);

    if (ctx.session.state && ctx.session.state.cronJob) {
      ctx.session.state.cronJob.stop();
      delete ctx.session.state.cronJob;
    }
    let subscriptions = ctx.session.weatherSubscriptions || [];

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
    ctx.reply(ctx.i18n.t('unsubscribe.text'));
    ctx.scene.leave();
  } catch (error) {
    console.log(error);
    await ctx.reply(ctx.i18n.t('error.sever'));
  }
});

const unsubscribeScene = new Scenes.WizardScene(
  'unsubscribeScene',
  stepUnsubscribe,
);

export default unsubscribeScene;
