import cron from 'node-cron';
import { Scenes } from 'telegraf';

import timeCheck from '../../helpers/timeCheck';
import { showTasks } from '../../models/showTasks';
import { userToTaskSubscribe } from '../../models/taskSubscribe';
import { tasksJobs } from '../../subscriptions/restartTaskSubscribtion';
import { showTask } from '../../helpers/taskShow';

const taskSubscribeScene = new Scenes.WizardScene(
  'taskSubscribeScene',
  async (ctx: any) => {
    await ctx.reply(ctx.i18n.t('task.time'));
    return ctx.wizard.next();
  },
  async (ctx: any) => {
    let time = ctx.message.text;
    const { user } = ctx.session;

    try {
      const tasks = await showTasks(user);

      if (!tasks.length) {
        await ctx.reply(ctx.i18n.t('error.no_task'));
        return ctx.scene.enter('taskScene');
      }

      if (timeCheck.isValidTime(time)) {
        const [hours, minutes] = timeCheck.timeParser(time);
        await ctx.reply(ctx.i18n.t('weather.your_time', { time }));

        const existingJob = tasksJobs.find(
          (job) => job.chatId === String(user),
        );

        if (existingJob) {
          existingJob.job.stop();
          console.log(`Stopped existing job for user with chat ID: ${user}`);
        }

        if (!ctx.session.taskSubscriptions) {
          ctx.session.taskSubscriptions = [];
        }

        time = hours + ':' + minutes;

        await userToTaskSubscribe(user, time);

        const job = cron.schedule(`${minutes} ${hours} * * *`, async () => {
          const updatedTasks = await showTasks(user);
          const [task, reply] = await showTask(updatedTasks);
          await ctx.reply(reply);
        });
        const subscription = {
          sub: job,
          userId: user,
        };

        ctx.session.taskSubscriptions.push(subscription);

        ctx.session.taskSubscriptions[0].sub?.start();

        await ctx.reply(ctx.i18n.t('task.subscribed'));
        return ctx.scene.enter('taskScene');
      } else {
        await ctx.reply(ctx.i18n.t('error.time_error'));
        return ctx.scene.enter('taskScene');
      }
    } catch (err) {
      ctx.reply(ctx.i18n.t('error.server'));
      return ctx.scene.enter('taskScene');
    }
  },
  async (ctx: any) => {
    await ctx.scene.enter('taskScene');
  },
);
export default taskSubscribeScene;
