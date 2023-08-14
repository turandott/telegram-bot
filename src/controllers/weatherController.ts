import { Composer, Scenes } from 'telegraf';

import { isValidCity } from '../helpers/cityCheck.js';
import { getWeatherResponse } from '../helpers/weatherShow.js';

const stepEnterCity = new Composer<Scenes.WizardContext>();
const stepWeather = new Composer<Scenes.WizardContext>();

stepEnterCity.on('text', async (ctx: any) => {
  await ctx.reply(ctx.i18n.t('weather.city'));
  return ctx.wizard.next();
});

stepWeather.on('text', async (ctx: any) => {
  const city: string = ctx.message.text;

  if (city === '/exit') {
    await ctx.reply(ctx.i18n.t('dialog.exit'));
    return ctx.scene.leave();
  }

  if (!isValidCity(city)) {
    return ctx.reply(ctx.i18n.t('error.city_error'));
  }
  try {
    const weatherResponse = await getWeatherResponse(city);
    await ctx.reply(weatherResponse);
    return ctx.scene.leave();
  } catch (error) {
    await ctx.reply(ctx.i18n.t('error.no_city'));
    return ctx.scene.leave();
  }
});

const weatherScene = new Scenes.WizardScene(
  'weatherScene',
  stepEnterCity,
  stepWeather,
);

export default weatherScene;
