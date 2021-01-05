import VElem from "./v-elem.vue";
/* istanbul ignore next */
VElem.install = function (Vue) {
  Vue.component(VElem.name, VElem);
};

export default VElem;