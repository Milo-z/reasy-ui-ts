import VItem from "./v-item.vue";
/* istanbul ignore next */
VItem.install = function (Vue) {
  Vue.component(VItem.name, VItem);
};

export default VItem;