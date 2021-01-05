import VButton from './v-button.vue';

/* istanbul ignore next */
VButton.install = function (Vue) {
  Vue.component(VButton.name, VButton);
};

export default VButton;