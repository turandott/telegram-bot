import cron from 'node-cron';

import db from './index.js';

const { User } = db;
const { Task } = db;
const { TaskSubscribe } = db;

export async function userToTaskUnsubscribe(user) {
  const existingUser = await User.findOne({ chatId: user });
  if (!existingUser) {
    return 'You have no tasks';
  }
  const existingSubscription = await TaskSubscribe.findOne({
    user: existingUser._id,
  });

  if (!existingSubscription) {
    return 'You have no subscription';
  }
  await TaskSubscribe.deleteMany({ user: existingUser._id });

  return 'Unsubscribed tasks successfully';
}
