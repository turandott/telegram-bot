import cron from 'node-cron';

import { showTask } from '../helpers/taskShow.js';
import db from '../models/index.js';

const { User } = db;
const { TaskSubscribe } = db;
const { Task } = db;

async function restartTaskSubscription(sendMessage) {
  try {
    const users = await User.find({}).select('id chatId');
    for (const user of users) {
      const { id, chatId } = user;
      const subscribe = await TaskSubscribe.findOne({
        user: id,
      });
      console.log(subscribe);

      if (subscribe) {
        const { user, time } = subscribe;
        console.log(user, time);
        const [hours, minutes] = time.split(':');
        console.log(hours, minutes);
        const cronTime = `${parseInt(minutes)} ${parseInt(hours)} * * *`;

        cron.schedule(cronTime, async () => {
          const tasks = await Task.find({ user });
          console.log(tasks);

          const taskTexts = tasks.map((task) => task.text);
          console.log(taskTexts);

          const receivedTasks = await showTask(taskTexts);
          sendMessage(chatId, receivedTasks);
        });

        console.log(`Cron job tasks started for user with ID: ${id}`);
      } else {
        console.log(`No data found for user with ID: ${id}`);
      }
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

export default restartTaskSubscription;
