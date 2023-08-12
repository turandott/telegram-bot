import { Markup, Scenes } from "telegraf";
import { createTask } from "../../models/createTask";

const taskExitScene = new Scenes.WizardScene(
  "taskExitScene",
  async (ctx: any) => {
    await ctx.reply(ctx.i18n.t("task.bye"));
    return ctx.scene.leave();
  },
);
export default taskExitScene;
