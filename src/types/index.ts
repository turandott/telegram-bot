import { Scenes } from "telegraf";
import { SceneContext } from "telegraf/typings/scenes";

export interface Context extends Scenes.SceneContext {}

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
