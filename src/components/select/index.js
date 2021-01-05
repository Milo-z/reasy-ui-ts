import VSelect from "./v-select.vue";
/* istanbul ignore next */
VSelect.install = function (Vue) {
  Vue.component(VSelect.name, VSelect);
};

export default VSelect;