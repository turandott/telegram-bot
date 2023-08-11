import { showTasks } from "../models/showTasks";

export async function showTaskHelper(tasks) {
  const reply = "Your tasks:\n\n" + tasks.join("\n");
  return reply;
}
