import { Markup, Scenes } from "telegraf";
import { showTasks } from "../../models/showTasks";
import { showTask } from "../../helpers/taskShow";
import cron from "node-cron";
import { userToTaskSubscribe } from "../../models/taskSubscribe";
import timeCheck from "../../helpers/timeCheck";
import { userToTaskUnsubscribe } from "../../models/taskUnsubscribe";

const taskUnsubscribeScene = new Scenes.WizardScene(
  "taskUnsubscribeScene",
  async (ctx: any) => {
    const user = ctx.session.user;

    if (ctx.session.state && ctx.session.state.cronJob) {
      ctx.session.state.cronJob.stop();
      delete ctx.session.state.cronJob;
    }
    let subscriptions = ctx.session.taskSubscriptions || [];
    console.log(ctx.session.taskSubscriptions);

    subscriptions.forEach((subscription: any) => {
      if (
        subscription &&
        subscription.taskSubscriptions &&
        subscription.userId == user
      ) {
        subscription.taskSubscriptions.stop();
      }
    });

    subscriptions = subscriptions.filter((subscription: any) => {
      return subscription.userId !== user;
    });
    ctx.session.taskSubscriptions = subscriptions;

    const unsubscribe = await userToTaskUnsubscribe(user);
    ctx.reply(unsubscribe);
    await ctx.wizard.next();
  },
  async (ctx: any) => {
    return ctx.scene.enter("taskScene");
  },
);

export default taskUnsubscribeScene;
