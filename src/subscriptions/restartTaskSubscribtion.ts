import cron from 'node-cron';

import { showTask } from '../helpers/taskShow.js';
import db from '../models/index.js';

const { User } = db;
const { TaskSubscribe } = db;
const { Task } = db;

let tasksJobs = [];

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
        const [hours, minutes] = time.split(':');

        const cronTime = `${parseInt(minutes)} ${parseInt(hours)} * * *`;

        const job = cron.schedule(cronTime, async () => {
          const tasks = await Task.find({ user });

          if (!tasks) {
            sendMessage(
              chatId,
              'You have subscription,  but have no tasks( create new tasks or unsubscribe',
            );
            return;
          }
          const taskTexts = tasks.map((task) => task.text);
          console.log(taskTexts);

          const [tasksMap, reply] = await showTask(taskTexts);
          sendMessage(chatId, reply);
        });

        const jobObject = { chatId: chatId, job: job };

        tasksJobs.push(jobObject);

        console.log(`Cron job tasks started for user with ID: ${id}`);
      } else {
        console.log(`No data found for user with ID: ${id}`);
      }
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

export { restartTaskSubscription, tasksJobs };
