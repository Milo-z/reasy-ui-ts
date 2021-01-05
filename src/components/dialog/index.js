import VDialog from "./v-dialog.vue";
/* istanbul ignore next */
VDialog.install = function (Vue) {
  Vue.component(VDialog.name, VDialog);
};

export default VDialog;