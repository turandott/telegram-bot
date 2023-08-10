import cron from "node-cron";
import db from "./index.js";
const User = db.User;
const Weather = db.Weather;
const Task = db.Task;

export async function deleteTask(user, text) {
  //check if the user with the chatId exists
  let existingUser = await User.findOne({ chatId: user });
  if (!existingUser) {
    existingUser = await User.create({
      chatId: user,
    });
  }
  const deletedTask = await Task.deleteOne({
    text: text,
    user: existingUser._id,
  });

  if (deletedTask.deletedCount === 0) {
    return "no task with that text";
  }

  return "task deleted";
}
