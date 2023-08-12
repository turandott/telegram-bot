import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
import placeService from "../services/placeService.js";
import { Context } from "../types/index.js";
import { isValidCity } from "../helpers/cityCheck.js";

const stepEnterCity = new Composer<Scenes.WizardContext>();
const stepKind = new Composer<Scenes.WizardContext>();
const stepShow = new Composer<Scenes.WizardContext>();

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
    const location = await placeService.getLocation(city);

    if (location.lat === undefined || location.lon === undefined) {
      ctx.reply(ctx.i18n.t("error.no_city"));
      return ctx.scene.leave();
    }

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

    sights.forEach((sight) => {
      ctx.reply(ctx.i18n.t("place.text", { sight }));
    });
    return ctx.scene.leave();
  } catch (error) {
    console.log(`Error with fetch data in Place Scene: ${error}`);
    await ctx.reply(ctx.i18n.t("place.error"));
    return ctx.scene.leave();
  }
});

const placesScene = new Scenes.WizardScene(
  "placesScene",
  stepEnterCity,
  stepKind,
  stepShow,
);

export default placesScene;
