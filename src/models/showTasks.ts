import cron from "node-cron";
import db from "./index.js";
const User = db.User;
const Weather = db.Weather;
const Task = db.Task;

export async function showTasks(user) {
  let existingUser = await User.findOne({ chatId: user });

  if (!existingUser) {
    throw new Error("User not found");
  }

  let tasks = await Task.find({ user: existingUser._id });

  let taskTexts = tasks.map((task) => task.text);
  console.log(taskTexts);
  return taskTexts;
}
