import { Composer, Context } from "telegraf";
import catService from "../services/catService.js";

const composer = new Composer<Context>();

composer.command("cat", async (ctx) => {
  const data = await catService.getCatImage();
  console.log(data);
  return ctx.replyWithPhoto(data);
});

export default composer;
