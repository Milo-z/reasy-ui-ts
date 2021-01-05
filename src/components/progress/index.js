import VProgress from "./v-progress.vue";
//import UpProgress from "./v-upgrade-progress.vue";
/* istanbul ignore next */
VProgress.install = function (Vue) {
  Vue.component(VProgress.name, VProgress);
  //Vue.component(UpProgress.name, UpProgress);
};

export { VProgress };