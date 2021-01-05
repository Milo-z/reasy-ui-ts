import VText from "./v-text.vue";
/* istanbul ignore next */
VText.install = function (Vue) {
  Vue.component(VText.name, VText);
};

export default VText;