import cron from "node-cron";
import db from "./index.js";
const User = db.User;
const Weather = db.Weather;

export async function userToWetherSubscribe(user, city, time) {
  //check if the user with the chatId exists
  const existingUser = await User.findOne({ chatId: user });
  let existingWeather;
  if (existingUser) {
    existingWeather = await Weather.findOne({
      user: existingUser._id,
    });
  }
  if (existingUser && existingWeather) {
    // user already exists update information
    await Weather.updateOne(
      { user: existingUser._id },
      {
        city: city,
        time: time,
      },
    );
  } else if (existingUser && !existingWeather) {
    await Weather.create({
      user: existingUser._id,
      city: city,
      time: time,
    });
  } else {
    //user does not exist
    const newUser = await User.create({
      chatId: user,
    });

    await Weather.create({
      user: newUser._id,
      city: city,
      time: time,
    });
  }
}
