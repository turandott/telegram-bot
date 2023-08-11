import cron from "node-cron";
import db from "./index.js";
const User = db.User;
const Task = db.Task;
const TaskSubscribe = db.TaskSubscribe;

export async function userToTaskUnsubscribe(user) {
  //check if the user with the chatId exists
  const existingUser = await User.findOne({ chatId: user });
  if (!existingUser) {
    return "You have no tasks";
  }
  const existingSubscription = await TaskSubscribe.findOne({
    user: existingUser._id,
  });

  if (!existingSubscription) {
    return "You have no subscription";
  }
  await TaskSubscribe.deleteOne({ user: existingUser._id });

  return "Unsubscribed tasks successfully";
}
