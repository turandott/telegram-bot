import { Composer } from 'telegraf';

import { Context } from '../types/index.js';
import COMMANDS from '../utils/consts.js';

const composer = new Composer<Context>();

composer.command('start', (ctx: Context) => ctx.reply(ctx.i18n.t('start.text')));

composer.command('help', (ctx: Context) => {
  const commands = COMMANDS.map(
    (command) => `
  /${command.command} ${command.description}`,
  ).join('\n');

  ctx.replyWithHTML(`
  ${ctx.i18n.t('start.help')}
  ${commands}
  `);
});

export default composer;
