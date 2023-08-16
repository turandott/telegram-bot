import { Composer, Scenes } from 'telegraf';

import { userToWetherUnsubscribe } from '../models/weatherUnsubscribe.js';
import { weatherJobs } from '../subscriptions/restartWeatherSubscribtion.js';

const stepUnsubscribe = new Composer<Scenes.WizardContext>();

stepUnsubscribe.on('text', async (ctx: any) => {
  try {
    const user = ctx.message.chat.id;

    const existingJob = weatherJobs.find((job) => job.chatId === String(user));

    if (existingJob) {
      existingJob.job.stop();
      console.log(`Stopped existing job for user with chat ID: ${user}`);
    }

    let subscriptions = ctx.session.weatherSubscriptions || [];

    subscriptions.forEach((subscription: any) => {
      if (subscription && subscription.sub && subscription.userId == user) {
        subscription.sub.stop();
      }
    });

    subscriptions = subscriptions.filter(
      (subscription: any) => subscription.userId !== user,
    );

    ctx.session.weatherSubscriptions = subscriptions;

    await userToWetherUnsubscribe(user);

    ctx.reply(ctx.i18n.t('unsubscribe.text'));
    ctx.scene.leave();
  } catch (error) {
    console.log(error);
    await ctx.reply(ctx.i18n.t('error.sever'));
  }
});

const unsubscribeWeatherScene = new Scenes.WizardScene(
  'unsubscribeWeatherScene',
  stepUnsubscribe,
);

export default unsubscribeWeatherScene;
