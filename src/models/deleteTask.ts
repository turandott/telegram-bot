import cron from 'node-cron';

import db from './index.js';

const { User } = db;
const { Weather } = db;
const { Task } = db;

export async function deleteTask(user, text) {
  // check if the user with the chatId exists
  let existingUser = await User.findOne({ chatId: user });
  if (!existingUser) {
    existingUser = await User.create({
      chatId: user,
    });
    console.log('no user');
    return;
  }
  const deletedTask = await Task.deleteOne({
    text,
    user: existingUser._id,
  });

  if (deletedTask.deletedCount === 0) {
    return 'no task with that number';
  }

  return 'task deleted';
}
