import { Scenes } from 'telegraf';

// import { BotContext } from "../../types";

const taskExitScene = new Scenes.WizardScene(
  'taskExitScene',
  async (ctx: any) => {
    await ctx.reply(ctx.i18n.t('task.bye'));
    return ctx.scene.leave();
  },
);
export default taskExitScene;
