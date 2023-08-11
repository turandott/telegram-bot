import cron from "node-cron";
import db from "./index.js";
const User = db.User;
const Task = db.Task;
const TaskSubscribe = db.TaskSubscribe;

export async function userToTaskSubscribe(user, time) {
  //check if the user with the chatId exists
  const existingUser = await User.findOne({ chatId: user });
  if (!existingUser) {
    return "You have no tasks";
  }
  console.log(existingUser);
  const existingTask = await Task.find({ user: existingUser._id });

  if (existingTask.length === 0) {
    return "You have no tasks";
  }

  // check if user is already subscribed to tasks
  const existingSubscription = await TaskSubscribe.findOne({
    user: existingUser._id,
  });

  if (existingSubscription) {
    // update time
    existingSubscription.time = time;
    await existingSubscription.save();
  } else {
    // create new subscription
    const newSubscription = new TaskSubscribe({
      time,
      user: existingUser._id,
    });
    await newSubscription.save();
  }

  return "Subscribed to tasks successfully";
}
