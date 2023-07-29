import { Composer, Context } from "telegraf";
import COMMANDS from "../utils/consts.js";

const composer = new Composer<Context>();

composer.command("start", (ctx) => ctx.reply("Hello 👋"));

composer.command("help", (ctx) => {
  let commands = COMMANDS.map(
    (command) => `
  /${command.command} ${command.description}`
  ).join(`\n`);

  ctx.replyWithHTML(`
    This bot can help you get a random photo of a cat or dog, check the weather in a city of your choice, check out a cafe in some city, or create some notes and get notifications💖
    ${commands}
  `);
});

export default composer;
