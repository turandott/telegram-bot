import db from "../models/index.js";
import { getWeatherResponse } from "../services/responseWeatherService.js";
import cron from "node-cron";

const User = db.User;
const Weather = db.Weather;

async function restartWeatherSubscription(sendMessage) {
  try {
    const users = await User.findAll({ attributes: ["id", "chatId"] });
    for (const user of users) {
      const { id, chatId } = user.dataValues;
      console.log(id, chatId);
      const weather = await Weather.findOne({
        where: { id: id },
      });
      console.log(weather);

      if (weather && weather.time) {
        const { time, city } = weather;
        const [hours, minutes] = time.split(":");
        const cronTime = `${parseInt(minutes)} ${parseInt(
          hours
        )} * * *`;

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
