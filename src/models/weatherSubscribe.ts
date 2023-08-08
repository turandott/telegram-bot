import cron from "node-cron";
import db from "./index.js";
const User = db.User;
const Weather = db.Weather;

export async function userToWetherSubscribe(user, city, time) {
  //check if the user with the chatId exists
  const existingUser = await User.findOne({ where: { chatId: user } });
  let existingWeather;
  if (existingUser) {
    existingWeather = await Weather.findOne({
      where: { id: existingUser.id },
    });
  }
  if (existingUser && existingWeather) {
    // user already exists update information
    await Weather.update(
      {
        city: city,
        time: time,
      },
      { where: { id: existingUser.id } },
    );
  } else if (existingUser && !existingWeather) {
    await Weather.create({
      id: existingUser.id,
      city: city,
      time: time,
    });
  } else {
    //user does not exist
    const newUser = await User.create({
      chatId: user,
    });

    await Weather.create({
      userId: newUser.id,
      city: city,
      time: time,
    });
  }
}
