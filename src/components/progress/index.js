import Progress from "./v-progress.vue";
//import UpProgress from "./v-upgrade-progress.vue";
/* istanbul ignore next */
Progress.install = function(Vue) {
  Vue.component(Progress.name, Progress);
  //Vue.component(UpProgress.name, UpProgress);
};

export {
  Progress,
  //UpProgress
};

