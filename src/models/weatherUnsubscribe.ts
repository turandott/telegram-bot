import db from "./index.js";
const User = db.User;
const Weather = db.Weather;

export async function userToWetherUnsubscribe(userId) {
  const existingUser = await User.findOne({ chatId: userId });

  await Weather.deleteOne({ user: existingUser._id });

  await User.deleteOne({ chatId: userId });
}
