import cron from "node-cron";
import db from "./index.js";
const User = db.User;
const Weather = db.Weather;
const Task = db.Task;

export async function createTask(user, text) {
  let existingUser = await User.findOne({ chatId: user });
  if (!existingUser) {
    existingUser = await User.create({
      chatId: user,
    });
  }
  await Task.create({
    user: existingUser._id,
    text: text,
  });
}
