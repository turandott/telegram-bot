import { Markup, Scenes } from "telegraf";
import { showTasks } from "../../models/showTasks";
import { showTask } from "../../helpers/taskShow";
import cron from "node-cron";
import { userToTaskSubscribe } from "../../models/taskSubscribe";
import timeCheck from "../../helpers/timeCheck";

const taskSubscribeScene = new Scenes.WizardScene(
  "taskSubscribeScene",
  async (ctx: any) => {
    await ctx.reply(ctx.i18n.t("task.time"));
    return ctx.wizard.next();
  },
  async (ctx: any) => {
    try {
      const time = ctx.message.text;
      const user = ctx.session.user;
      if (timeCheck.isValidTime(time)) {
        const [hours, minutes] = timeCheck.timeParser(time);
        await ctx.reply(ctx.i18n.t("weather.your_time", { time }));

        if (!ctx.session.taskSubscriptions) {
          ctx.session.taskSubscriptions = [];
        }

        await userToTaskSubscribe(user, time);

        let tasks = await showTasks(user);

        if (!tasks.length) {
          await ctx.reply(ctx.i18n.t("error.no_task"));
          return ctx.scene.enter("taskScene");
        }

        const job = cron.schedule(`${minutes} ${hours} * * *`, async () => {
          const updatedTasks = await showTasks(user);
          const reply = "Your tasks:\n\n" + updatedTasks.join("\n");
          ctx.reply(reply);
        });

        ctx.wizard.state.cronJob = job;
        const subscription = {
          taskSubscriptions: job,
          userId: user,
        };

        ctx.session.taskSubscriptions.push(subscription);
        job.start();
        await ctx.reply(ctx.i18n.t("task.subscribed"));
        return ctx.scene.enter("taskScene");
      } else {
        await ctx.reply(ctx.i18n.t("error.time_error"));
        return ctx.scene.enter("taskScene");
      }
    } catch (err) {
      ctx.reply(ctx.i18n.t("error.server"));
      return ctx.scene.enter("taskScene");
    }
  },
  async (ctx: any) => {
    await ctx.scene.enter("taskScene");
  },
);
export default taskSubscribeScene;
