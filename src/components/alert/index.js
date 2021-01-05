import VAlert from './v-alert';

/* istanbul ignore next */
VAlert.install = function (Vue) {
  Vue.component(VAlert.name, VAlert);
};

export default VAlert;