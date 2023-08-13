import { showTasks } from '../models/showTasks';

export async function showTask(tasks) {
  //   const reply = "Your tasks:\n\n" + tasks.join("\n");
  //   return reply;

  const tasksMap = new Map();

  tasks.forEach((task, index) => {
    tasksMap.set(index + 1, task);
  });

  let reply = 'Your tasks:\n\n';
  tasksMap.forEach((value, key) => {
    reply += `${key}. ${value}\n`;
  });
  return [tasksMap, reply];
}
