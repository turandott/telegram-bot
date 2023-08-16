import { Scenes } from 'telegraf';

import { showTask } from '../../helpers/taskShow';
import { showTasks } from '../../models/showTasks';

const taskShowScene = new Scenes.WizardScene(
  'taskShowScene',
  async (ctx: any) => {
    const userId = ctx.session.user;

    const tasks = await showTasks(userId);
    if (!tasks) {
      await ctx.reply(ctx.i18n.t('error.no_task'));
      return ctx.wizard.next();
    }
    const [task, reply] = await showTask(tasks);

    await ctx.reply(reply);
    return ctx.wizard.next();
  },
  async (ctx: any) => ctx.scene.enter('taskScene'),
);
export default taskShowScene;
