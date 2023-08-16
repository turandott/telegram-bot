import cron from 'node-cron';
import { Composer, Scenes } from 'telegraf';

import { isValidCity } from '../helpers/cityCheck.js';
import timeCheck from '../helpers/timeCheck.js';
import { getWeatherResponse } from '../helpers/weatherShow.js';
import { userToWetherSubscribe } from '../models/weatherSubscribe.js';
import { weatherJobs } from '../subscriptions/restartWeatherSubscribtion.js';

const stepEnterCity = new Composer<Scenes.WizardContext>();
const stepEnterTime = new Composer<Scenes.WizardContext>();
const stepGetWeather = new Composer<Scenes.WizardContext>();

stepEnterCity.on('text', async (ctx: any) => {
  await ctx.reply(ctx.i18n.t('weather.city'));
  return ctx.wizard.next();
});

stepEnterTime.on('text', async (ctx: any) => {
  try {
    const city = ctx.message.text;
    const user = ctx.message.chat.id;

    if (city === '/exit') {
      await ctx.reply(ctx.i18n.t('dialog.exit'));
      return ctx.scene.leave();
    }

    if (!isValidCity(city)) {
      return ctx.reply(ctx.i18n.t('error.city_error'));
    }
    ctx.session.city = city;
    ctx.session.user = user;

    await ctx.reply(ctx.i18n.t('weather.time'));
    return ctx.wizard.next();
  } catch (error) {
    console.log(error);
    await ctx.reply(ctx.i18n.t('error.city_error'));
  }
});

stepGetWeather.on('text', async (ctx: any) => {
  try {
    let city = ctx.session.city;
    const user = ctx.session.user;

    const existingJob = weatherJobs.find((job) => job.chatId === String(user));

    if (existingJob) {
      existingJob.job.stop();
      console.log(`Stopped existing job for user with chat ID: ${user}`);
    }

    let time = ctx.message.text;

    if (time === '/exit') {
      await ctx.reply(ctx.i18n.t('dialog.exit'));
      return ctx.scene.leave();
    }

    ctx.session.time = time;

    if (timeCheck.isValidTime(time)) {
      const [hours, minutes] = timeCheck.timeParser(time);

      await ctx.reply(ctx.i18n.t('weather.your_time', { time }));

      if (!ctx.session.weatherSubscriptions) {
        ctx.session.weatherSubscriptions = [];
      }

      time = hours + ':' + minutes;

      userToWetherSubscribe(user, city, time);

      const job = cron.schedule(`${minutes} ${hours} * * *`, async () => {
        ctx.reply(await getWeatherResponse(city));
      });

      const subscription = {
        sub: job,
        userId: user,
      };

      ctx.session.weatherSubscriptions.push(subscription);
      ctx.session.weatherSubscriptions[0].sub?.start();

      return ctx.scene.leave();
    }
    return ctx.reply(ctx.i18n.t('error.time_error'));
  } catch (error) {
    console.log(`error occure with weather: ${error}`);
    return ctx.reply(ctx.i18n.t('weather.error'));
  }
});

const weatherSubscribeScene = new Scenes.WizardScene(
  'weatherSubscribeScene',
  stepEnterCity,
  stepEnterTime,
  stepGetWeather,
);

export default weatherSubscribeScene;
