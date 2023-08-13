import { Scenes } from 'telegraf';

import { showTask } from '../../helpers/taskShow';
import { deleteTask } from '../../models/deleteTask';
import { showTasks } from '../../models/showTasks';

const taskDeleteScene = new Scenes.WizardScene(
  'taskDeleteScene',
  async (ctx: any) => {
    await ctx.reply(ctx.i18n.t('task.text_id'));
    const userId = ctx.session.user;

    const tasks = await showTasks(userId);
    if (!tasks) {
      await ctx.reply(ctx.i18n.t('error.no_task'));
      return ctx.wizard.selectStep(0);
    }

    const [tasksMap, reply] = await showTask(tasks);

    ctx.wizard.state.tasks = tasksMap;

    await ctx.reply(reply);
    return ctx.wizard.next();
  },
  async (ctx: any) => {
    try {
      const number = await ctx.message.text;
      const userId = await ctx.session.user;
      const { tasks } = ctx.wizard.state;
      console.log(number);
      console.log(tasks);

      const text = tasks.get(Number(number));
      console.log(text);
      const result = await deleteTask(userId, text);
      await ctx.reply(result);
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

export default taskDeleteScene;
