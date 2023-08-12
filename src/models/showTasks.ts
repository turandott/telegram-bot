import cron from "node-cron";
import db from "./index.js";
const User = db.User;
const Weather = db.Weather;
const Task = db.Task;

export async function showTasks(user) {
  try {
    let existingUser = await User.findOne({ chatId: user });
    if (!existingUser) {
      throw new Error("NoUser");
    }

    let tasks = await Task.find({ user: existingUser._id });
    if (!tasks || tasks.length === 0) {
      throw new Error("NoTask");
    }

    let taskTexts = tasks.map((task) => task.text);
    console.log(taskTexts);
    return taskTexts;
  } catch (error) {
    if (error.message === "NoUser") {
      console.error("User not found.");
    } else if (error.message === "NoTask") {
      console.error("No tasks found for the user.");
    } else {
      console.error("An error occurred:", error);
    }
  }
}
