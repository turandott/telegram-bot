import cron from 'node-cron';
import { Markup, Scenes } from 'telegraf';

import { showTask } from '../../helpers/taskShow';
import timeCheck from '../../helpers/timeCheck';
import { showTasks } from '../../models/showTasks';
import { userToTaskSubscribe } from '../../models/taskSubscribe';
import { userToTaskUnsubscribe } from '../../models/taskUnsubscribe';
import { tasksJobs } from '../../subscriptions/restartTaskSubscribtion';

const taskUnsubscribeScene = new Scenes.WizardScene(
  'taskUnsubscribeScene',
  async (ctx: any) => {
    try {
      const { user } = ctx.session;
      const existingJob = tasksJobs.find((job) => job.chatId === String(user));

      if (existingJob) {
        existingJob.job.stop();
        console.log(`Stopped existing job for user with chat ID: ${user}`);
      }

      let subscriptions = ctx.session.taskSubscriptions || [];

      subscriptions.forEach((subscription: any) => {
        if (subscription && subscription.sub && subscription.userId == user) {
          subscription.sub.stop();
        }
      });

      subscriptions = subscriptions.filter(
        (subscription: any) => subscription.userId !== user,
      );

      ctx.session.taskSubscriptions = subscriptions;
      const unsubscribe = await userToTaskUnsubscribe(user);
      ctx.reply(unsubscribe);
      await ctx.wizard.next();
    } catch {
      ctx.reply(ctx.i18n.t('error.server'));
      await ctx.wizard.next();
    }
  },
  async (ctx: any) => ctx.scene.enter('taskScene'),
);

export default taskUnsubscribeScene;
