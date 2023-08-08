import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
import placeService from "../services/placeService.js";
import { Context } from "../types/index.js";

const stepEnterCity = new Composer<Scenes.WizardContext>();
const stepKind = new Composer<Scenes.WizardContext>();
const stepShow = new Composer<Scenes.WizardContext>();

const stepExit = new Composer<Scenes.WizardContext>();

stepEnterCity.on("text", async (ctx: any) => {
  await ctx.reply(ctx.i18n.t("place.city"));
  return ctx.wizard.next();
});

stepKind.on("text", async (ctx: any) => {
  const city = ctx.message.text;
  ctx.wizard.state.city = city;
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
});

stepShow.on("text", async (ctx: any) => {
  const city = ctx.wizard.state.city;
  const text = ctx.message.text;
  console.log(text);
  const kind = text.toLowerCase().replace(/ /g, "_");
  console.log(kind);

  const sights = await placeService.getCity(city, kind);
  console.log(sights);

  sights.forEach((sight, index) => {
    ctx.reply(ctx.i18n.t("place.text", { sight, index }));
  });
  return ctx.wizard.next();
});

stepExit.on("text", (ctx) => ctx.scene.leave());

const placesScene = new Scenes.WizardScene(
  "placesScene",
  stepEnterCity,
  stepKind,
  stepShow,
  stepExit
);

export default placesScene;
