import cron from "node-cron";
import db from "./index.js";
const User = db.User;
const Weather = db.Weather;

export async function userToWetherUnsubscribe(userId) {
  const existingUser = await User.findOne({ where: { chatId: userId } });

  await Weather.destroy({ where: { id: existingUser.id } });

  await User.destroy({ where: { chatId: userId } });
}
