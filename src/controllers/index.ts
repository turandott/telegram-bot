import startController from "./startController.js";
import dogController from "./dogController.js";
import catController from "./catController.js";
import weatherSubscribeScene from "./subscribeController.js";
import placesScene from "./placeController.js";
import unsubscribeWeatherScene from "./unsubscribeWeatherController.js";
import taskScene from "./task";
import taskCreateScene from "./task/create.js";
import taskDeleteScene from "./task/delete.js";
import taskShowScene from "./task/show.js";
import taskExitScene from "./task/exit.js";
import weatherScene from "./weatherController.js";
import taskSubscribeScene from "./task/subscribe.js";
import taskUnsubscribeScene from "./task/unsubscribe.js";

export default {
  unsubscribeWeatherScene,
  placesScene,
  weatherSubscribeScene,
  catController,
  dogController,
  startController,
  weatherScene,
  taskScene,
  taskCreateScene,
  taskDeleteScene,
  taskShowScene,
  taskExitScene,
  taskSubscribeScene,
  taskUnsubscribeScene,
};
