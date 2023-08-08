import { Composer } from "telegraf";
import COMMANDS from "../utils/consts.js";
import { Context } from "../types/index.js";
const composer = new Composer<Context>();

composer.command("start", (ctx: Context) => {
  return ctx.reply(ctx.i18n.t("start.text"));
});
composer.command("help", (ctx: Context) => {
  let commands = COMMANDS.map(
    (command) => `
  /${command.command} ${command.description}`
  ).join(`\n`);

  ctx.replyWithHTML(`
  ${ctx.i18n.t("start.help")}
  ${commands}
  `);
});

export default composer;
