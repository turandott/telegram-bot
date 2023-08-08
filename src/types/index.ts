import { Scenes } from "telegraf";
import { SceneContext } from "telegraf/typings/scenes";
import I18nContext from "telegraf-i18n";

export interface Context extends Scenes.SceneContext {
  i18n: I18nContext;
}

export interface Photo {
  url: string;
}

export interface Place {
  name: string;
  adress: string;
}

// export interface MySceneContext extends SceneContext {
//   enter: (sceneId: string) => void;
// }
