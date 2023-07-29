import { Composer, Context } from "telegraf";
import dogService from "../services/dogService.js";

const composer = new Composer<Context>();

composer.command("dog", async (ctx) => {
  const data = await dogService.getDogImage();
  console.log(data);
  return ctx.replyWithPhoto(data);
});

export default composer
