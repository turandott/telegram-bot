import { Composer } from "telegraf";
import dogService from "../services/dogService.js";
import { Context } from "../types/index.js";

const composer = new Composer<Context>();

composer.command("dog", async (ctx: Context) => {
  try {
    const data = await dogService.getDogImage();
    console.log(data);
    return ctx.replyWithPhoto(data);
  } catch (error) {
    console.log(`error occure with dog image: ${error}`);
    return ctx.reply(ctx.i18n.t("dog.error"));
  }
});

export default composer;
