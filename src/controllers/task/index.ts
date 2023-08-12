import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";

const taskScene = new Scenes.WizardScene("taskScene", async (ctx: any) => {
  ctx.session.user = ctx.from.id;
  await ctx.replyWithHTML(
    ctx.i18n.t("task.choose"),
    Markup.inlineKeyboard([
      [Markup.button.callback(ctx.i18n.t("task.create"), "create")],
      [Markup.button.callback(ctx.i18n.t("task.delete"), "delete")],
      [Markup.button.callback(ctx.i18n.t("task.show_all"), "show")],
      [Markup.button.callback(ctx.i18n.t("task.subscribe"), "subscribe")],
      [Markup.button.callback(ctx.i18n.t("task.unsubscribe"), "unsubscribe")],
      [Markup.button.callback(ctx.i18n.t("task.exit"), "exit")],
    ]),
  );

  return ctx.wizard.next();
});

taskScene.action("create", async (ctx: any) => {
  await ctx.scene.enter("taskCreateScene");
});

taskScene.action("delete", async (ctx: any) => {
  await ctx.scene.enter("taskDeleteScene");
});

taskScene.action("show", async (ctx: any) => {
  await ctx.scene.enter("taskShowScene");
});

taskScene.action("subscribe", async (ctx: any) => {
  await ctx.scene.enter("taskSubscribeScene");
});

taskScene.action("unsubscribe", async (ctx: any) => {
  await ctx.scene.enter("taskUnsubscribeScene");
});

taskScene.action("exit", async (ctx: any) => {
  await ctx.scene.enter("taskExitScene");
});

export default taskScene;
