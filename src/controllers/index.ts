import catController from './catController.js';
import dogController from './dogController.js';
import placesScene from './placeController.js';
import startController from './startController.js';
import weatherSubscribeScene from './subscribeController.js';
import taskScene from './task';
import taskCreateScene from './task/create.js';
import taskDeleteScene from './task/delete.js';
import taskExitScene from './task/exit.js';
import taskShowScene from './task/show.js';
import taskSubscribeScene from './task/subscribe.js';
import taskUnsubscribeScene from './task/unsubscribe.js';
import unsubscribeWeatherScene from './unsubscribeWeatherController.js';
import weatherScene from './weatherController.js';

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
