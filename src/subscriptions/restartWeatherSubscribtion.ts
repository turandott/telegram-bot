import cron from 'node-cron';

import { getWeatherResponse } from '../helpers/weatherShow.js';
import db from '../models/index.js';

const { User } = db;
const { Weather } = db;

let weatherJobs = [];

async function restartWeatherSubscription(sendMessage) {
  try {
    const users = await User.find({}).select('id chatId');
    for (const user of users) {
      const { id, chatId } = user;
      const weather = await Weather.findOne({
        user: id,
      });

      if (weather && weather.time) {
        const { time, city } = weather;
        const [hours, minutes] = time.split(':');
        const cronTime = `${parseInt(minutes)} ${parseInt(hours)} * * *`;

        const job = cron.schedule(cronTime, async () => {
          const weatherResponse = await getWeatherResponse(city);
          sendMessage(chatId, weatherResponse);
        });
        const jobObject = { chatId: chatId, job: job };

        weatherJobs.push(jobObject);

        console.log(`Cron job started for user with ID: ${id}`);
      } else {
        console.log(`No weather data found for user with ID: ${id}`);
      }
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

export { restartWeatherSubscription, weatherJobs };
