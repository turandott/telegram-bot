import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
import placeService from "../services/placeService.js";
import { Context } from "../types/index.js";
import { isValidCity } from "../helpers/cityCheckHelper.js";

const stepEnterCity = new Composer<Scenes.WizardContext>();
const stepKind = new Composer<Scenes.WizardContext>();
const stepShow = new Composer<Scenes.WizardContext>();
const stepExit = new Composer<Scenes.WizardContext>();

stepEnterCity.on("text", async (ctx: any) => {
  try {
    await ctx.reply(ctx.i18n.t("place.city"));
    return ctx.wizard.next();
  } catch (error) {
    console.log(`Error in city enter Place Scene: ${error}`);
    await ctx.reply(ctx.i18n.t("place.error"));
  }
});

stepKind.on("text", async (ctx: any) => {
  try {
    const city = ctx.message.text;
    ctx.wizard.state.city = city;

    if (isValidCity(city)) {
      ctx.reply(ctx.i18n.t("place.option"), {
        reply_markup: {
          keyboard: [
            [
              { text: "Cafes" },
              { text: "Historical places" },
              { text: "Museums" },
              { text: "Banks" },
            ],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
      return ctx.wizard.next();
    } else {
      await ctx.reply(ctx.i18n.t("error.city_error"));
    }
  } catch (error) {
    console.log(error);
    await ctx.reply(ctx.i18n.t("place.error"));
  }
});

stepShow.on("text", async (ctx: any) => {
  try {
    const city = ctx.wizard.state.city;
    const text = ctx.message.text;
    const kind = text.toLowerCase().replace(/ /g, "_");

    const sights = await placeService.getCity(city, kind);

    sights.forEach((sight, index) => {
      ctx.reply(ctx.i18n.t("place.text", { sight, index }));
    });
    return ctx.wizard.next();
  } catch (error) {
    console.log(`Error with fetch data in Place Scene: ${error}`);
    await ctx.reply(ctx.i18n.t("error"));
  }
});

stepExit.on("text", (ctx) => ctx.scene.leave());

const placesScene = new Scenes.WizardScene(
  "placesScene",
  stepEnterCity,
  stepKind,
  stepShow,
  stepExit,
);

export default placesScene;
