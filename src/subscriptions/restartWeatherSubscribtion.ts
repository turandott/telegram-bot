import { getWeatherResponse } from "../helpers/weatherShow.js";
import db from "../models/index.js";
import cron from "node-cron";
const User = db.User;
const Weather = db.Weather;

async function restartWeatherSubscription(sendMessage) {
  try {
    const users = await User.find({}).select("id chatId");
    for (const user of users) {
      const { id, chatId } = user;
      console.log(id, chatId);
      const weather = await Weather.findOne({
        user: id,
      });
      console.log(weather);

      if (weather && weather.time) {
        const { time, city } = weather;
        const [hours, minutes] = time.split(":");
        const cronTime = `${parseInt(minutes)} ${parseInt(hours)} * * *`;

        cron.schedule(cronTime, async () => {
          const weatherResponse = await getWeatherResponse(city);
          sendMessage(chatId, weatherResponse);
        });

        console.log(`Cron job started for user with ID: ${id}`);
      } else {
        console.log(`No weather data found for user with ID: ${id}`);
      }
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

export default restartWeatherSubscription;
