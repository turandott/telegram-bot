import { Markup, Scenes } from "telegraf";
import { showTasks } from "../../models/showTasks";
import { showTask } from "../../helpers/taskShow";

const taskShowScene = new Scenes.WizardScene(
  "taskShowScene",
  async (ctx: any) => {
    const userId = ctx.session.user;
    console.log(userId);
    let tasks = await showTasks(userId);
    if (!tasks) {
      await ctx.reply(ctx.i18n.t("error.no_task"));
      return ctx.wizard.selectStep(0);
    }
    let [task, reply] = await showTask(tasks);

    await ctx.reply(reply);
    // return ctx.wizard.next();
    return ctx.wizard.next();
  },
  async (ctx: any) => {
    return ctx.scene.enter("taskScene");
  },
);
export default taskShowScene;
