import { Scenes } from 'telegraf';

import { createTask } from '../../models/createTask';

const taskCreateScene = new Scenes.WizardScene(
  'taskCreateScene',
  async (ctx: any) => {
    await ctx.reply(ctx.i18n.t('task.text'));
    return ctx.wizard.next();
  },
  async (ctx: any) => {
    try {
      const taskText = ctx.message.text;
      const { user } = ctx.session;
      console.log(user);
      createTask(user, taskText);
      return ctx.wizard.steps[ctx.wizard.cursor + 1](ctx);
    } catch (err) {
      ctx.reply(ctx.i18n.t('error.server'));
      return ctx.scene.enter('taskScene');
    }
  },
  async (ctx: any) => {
    await ctx.scene.enter('taskScene');
  },
);

export default taskCreateScene;
