import db from './index.js';

const { User } = db;
const { Weather } = db;
const { Task } = db;

export async function showTasks(user) {
  try {
    const existingUser = await User.findOne({ chatId: user });
    if (!existingUser) {
      console.log('No such user');
      return;
    }

    const tasks = await Task.find({ user: existingUser._id });
    if (!tasks || tasks.length === 0) {
      console.log('No tasks');
      return;
    }

    const taskTexts = tasks.map((task) => task.text);
    console.log(taskTexts);
    return taskTexts;
  } catch (error) {
    console.error('An error occurred:', error);
  }
}
