import VForm from "./v-form.vue";
import VFormItem from "./v-form-item.vue";
/* istanbul ignore next */
VForm.install = function(Vue) {
  Vue.component(VForm.name, VForm);
  Vue.component(VFormItem.name, VFormItem);
};

export {
  VForm,
  VFormItem
};

