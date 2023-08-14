import { Composer } from 'telegraf';

import catService from '../services/catService.js';
import { Context } from '../types/index.js';

const composer = new Composer<Context>();

composer.command('cat', async (ctx: Context) => {
  try {
    const data = await catService.getCatImage();
    return await ctx.replyWithPhoto(data);
  } catch (error) {
    console.log(`error occure with cat image: ${error}`);
    return ctx.reply(ctx.i18n.t('cat.error'));
  }
});

export default composer;
