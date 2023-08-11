import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
import db from "../models/index.js";
import { createTask } from "../models/createTask.js";
import { showTasks } from "../models/showTasks.js";
import { deleteTask } from "../models/deleteTask.js";
import { userToTaskSubscribe } from "../models/taskSubscribe.js";
import { userToTaskUnsubscribe } from "../models/taskUnsubscribe.js";
import { timeParser } from "../helpers/timeParserHelper.js";
import { isValidTime } from "../helpers/timeCheckHelper.js";
import cron from "node-cron";

const stepChooseVariant = new Composer<Scenes.WizardContext>();
const stepCreateTask = new Composer<Scenes.WizardContext>();
const stepDeleteTask = new Composer<Scenes.WizardContext>();
const stepExit = new Composer<Scenes.WizardContext>();
const stepSubscribeTask = new Composer<Scenes.WizardContext>();

stepChooseVariant.on("text", async (ctx: any) => {
  const userChoice = ctx.message.text.toLowerCase();
  ctx.session.user = ctx.from.id;
  console.log(ctx.from.id);

  console.log(userChoice);
  await ctx.replyWithHTML(
    ctx.i18n.t("task.choose"),
    Markup.inlineKeyboard([
      [Markup.button.callback(ctx.i18n.t("task.create"), "create")],
      [Markup.button.callback(ctx.i18n.t("task.delete"), "delete")],
      [Markup.button.callback(ctx.i18n.t("task.show_all"), "show_all")],
      [Markup.button.callback(ctx.i18n.t("task.subscribe"), "subscribe")],
      [Markup.button.callback(ctx.i18n.t("task.unsubscribe"), "unsubscribe")],
      [Markup.button.callback(ctx.i18n.t("task.exit"), "exit")],
    ]),
  );
});

stepChooseVariant.action("create", async (ctx: any) => {
  await ctx.reply(ctx.i18n.t("task.text"));
  return ctx.wizard.selectStep(1);
});

stepChooseVariant.action("delete", async (ctx: any) => {
  await ctx.reply(ctx.i18n.t("task.text_id"));
  return ctx.wizard.selectStep(2);
});

stepChooseVariant.action("show_all", async (ctx: any) => {
  const userId = ctx.session.user;
  console.log(userId);
  let tasks = await showTasks(userId);
  if (!tasks) {
    await ctx.reply("You have no tasks :(");
    return ctx.wizard.selectStep(0);
  }
  const reply = "Your tasks:\n\n" + tasks.join("\n");
  await ctx.reply(reply);
  return ctx.wizard.selectStep(0);
});

stepChooseVariant.action("subscribe", async (ctx: any) => {
  await ctx.reply(ctx.i18n.t("task.time"));
  return ctx.wizard.selectStep(3);
});

stepChooseVariant.action("exit", async (ctx: any) => {
  await ctx.reply(ctx.i18n.t("task.bye"));
  return ctx.scene.leave();
});

stepChooseVariant.action("unsubscribe", async (ctx: any) => {
  const user = ctx.session.user;

  if (ctx.session.state && ctx.session.state.cronJob) {
    ctx.session.state.cronJob.stop();
    delete ctx.session.state.cronJob;
  }
  let subscriptions = ctx.session.taskSubscriptions || [];
  console.log(ctx.session.taskSubscriptions);

  subscriptions.forEach((subscription: any) => {
    if (
      subscription &&
      subscription.taskSubscriptions &&
      subscription.userId == user
    ) {
      subscription.taskSubscriptions.stop();
    }
  });

  subscriptions = subscriptions.filter((subscription: any) => {
    console.log(subscription);
    return subscription.userId !== user;
  });
  ctx.session.taskSubscriptions = subscriptions;

  const unsubscribe = await userToTaskUnsubscribe(user);
  ctx.reply(unsubscribe);
  return ctx.wizard.selectStep(0);
});

stepCreateTask.on("text", async (ctx: any) => {
  const taskText = ctx.message.text;
  const user = ctx.session.user;
  createTask(user, taskText);
  return ctx.scene.reenter();
});

stepDeleteTask.on("text", async (ctx: any) => {
  const text = await ctx.message.text;
  const userId = await ctx.session.user;
  console.log(text, userId);
  const result = await deleteTask(userId, text);
  await ctx.reply(result);
  return ctx.scene.reenter();
});

stepSubscribeTask.on("text", async (ctx: any) => {
  const time = ctx.message.text;
  const user = ctx.session.user;
  try {
    if (isValidTime(time)) {
      const [hours, minutes] = timeParser(time);
      await ctx.reply(ctx.i18n.t("weather.your_time", { time }));

      if (!ctx.session.taskSubscriptions) {
        ctx.session.taskSubscriptions = [];
      }

      const subscribe = await userToTaskSubscribe(user, time);
      let tasks = await showTasks(user);
      if (!tasks) {
        await ctx.reply("You have no tasks :(");
        return ctx.wizard.selectStep(0);
      }
      const reply = "Your tasks:\n\n" + tasks.join("\n");

      const job = cron.schedule(`${minutes} ${hours} * * *`, async () => {
        ctx.reply(reply);
      });

      console.log(reply);
      ctx.wizard.state.cronJob = job;
      const subscription = {
        taskSubscriptions: job,
        userId: user,
      };

      ctx.session.taskSubscriptions.push(subscription);
      job.start();

      await ctx.reply(ctx.i18n.t("task.subscribed"));

      return ctx.scene.reenter();
    } else {
      await ctx.reply(ctx.i18n.t("error.time_error"));
      return ctx.scene.reenter();
    }
  } catch (err) {
    ctx.reply(ctx.i18n.t("error.time_error"));
    return ctx.scene.reenter();
  }
});

stepExit.on("text", (ctx) => ctx.scene.leave());

const taskScene = new Scenes.WizardScene(
  "taskScene",
  stepChooseVariant,
  stepCreateTask,
  stepDeleteTask,
  stepSubscribeTask,
  stepExit,
);

export default taskScene;
