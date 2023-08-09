import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
import db from "../models/index.js";

const stepChooseVariant = new Composer<Scenes.WizardContext>();
const stepCreateTask = new Composer<Scenes.WizardContext>();
const stepDeleteTask = new Composer<Scenes.WizardContext>();
const stepShowAllTasks = new Composer<Scenes.WizardContext>();
const stepExit = new Composer<Scenes.WizardContext>();

let tasks = []; // Array to store user tasks

stepChooseVariant.on("text", async (ctx: any) => {
  const userChoice = ctx.message.text.toLowerCase();

  await ctx.replyWithHTML(
    ctx.i18n.t("task.choose"),
    Markup.inlineKeyboard([
      [Markup.button.callback(ctx.i18n.t("task.create"), "create")],
      [Markup.button.callback(ctx.i18n.t("task.delete"), "delete")],
      [Markup.button.callback(ctx.i18n.t("task.show_all"), "show_all")],
      [Markup.button.callback(ctx.i18n.t("task.exit"), "exit")],
    ]),
  );
});

stepChooseVariant.action("create", async (ctx: any) => {
  await ctx.reply(ctx.i18n.t("task.text"));
  return ctx.wizard.selectStep(1);
});

stepChooseVariant.action("delete", async (ctx: any) => {
  await ctx.reply(ctx.i18n.t("task.id"));
  return ctx.wizard.selectStep(2);
});

stepChooseVariant.action("show_all", async (ctx: any) => {
  ctx.reply("Your tasks:\n\n" + tasks.join("\n"));
  return ctx.wizard.selectStep(0);
});

stepChooseVariant.action("exit", async (ctx: any) => {
  await ctx.reply(ctx.i18n.t("task.bye"));
  return ctx.scene.leave();
});

stepCreateTask.on("text", async (ctx: any) => {
  const taskText = ctx.message.text;
  console.log(taskText);

  tasks.push(taskText);

  ctx.reply("Your tasks:\n\n" + tasks.join("\n"));
  return ctx.scene.reenter();
});

stepDeleteTask.on("text", async (ctx: any) => {
  const number = ctx.message.text;
  console.log(tasks);

  tasks.pop();

  ctx.reply("Your tasks:\n\n" + tasks.join("\n"));
  return ctx.scene.reenter();
});

stepExit.on("text", (ctx) => ctx.scene.leave());

const taskScene = new Scenes.WizardScene(
  "taskScene",
  stepChooseVariant,
  stepCreateTask,

  stepDeleteTask,
  stepExit,
);

export default taskScene;
