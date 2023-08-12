import db from "../models/index.js";
import cron from "node-cron";
import { showTask } from "../helpers/taskShow.js";
const User = db.User;
const TaskSubscribe = db.TaskSubscribe;
const Task = db.Task;

async function restartTaskSubscription(sendMessage) {
  try {
    const users = await User.find({}).select("id chatId");
    for (const user of users) {
      const { id, chatId } = user;
      const subscribe = await TaskSubscribe.findOne({
        user: id,
      });
      console.log(subscribe);

      if (subscribe) {
        const { user, time } = subscribe;
        console.log(user, time);
        const [hours, minutes] = time.split(":");
        console.log(hours, minutes);
        const cronTime = `${parseInt(minutes)} ${parseInt(hours)} * * *`;

        cron.schedule(cronTime, async () => {
          let tasks = await Task.find({ user: user });
          console.log(tasks);

          let taskTexts = tasks.map((task) => task.text);
          console.log(taskTexts);

          let receivedTasks = await showTask(taskTexts);
          sendMessage(chatId, receivedTasks);
        });

        console.log(`Cron job tasks started for user with ID: ${id}`);
      } else {
        console.log(`No data found for user with ID: ${id}`);
      }
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

export default restartTaskSubscription;