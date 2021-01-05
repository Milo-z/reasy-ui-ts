import VUpload from "./v-upload.vue";
/* istanbul ignore next */
VUpload.install = function (Vue) {
  Vue.component(VUpload.name, VUpload);
};

export default VUpload;