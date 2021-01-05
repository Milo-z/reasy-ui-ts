import "../css/index.scss";
/*全局组件*/

import VDialog from "./dialog/index.js";
import VAlert from "./alert/index.js";
//import Area from "./area/index.js";
import VElem from "./elem/index.js";
import VTable from "./table/index.js";
import VInput from "./input/index.js";
import VRadio from "./radio/index.js";
import VSelect from "./select/index.js";
import VCheckbox from "./checkbox/index.js";
import VButton from "./button/index.js";
import { VProgress } from
//UpProgress
"./progress/index.js";
import VSwitch from "./switch/index.js";
import VSlider from "./slider/index.js";
import { VForm, VFormItem } from "./form/index.js";
import VItem from "./item/index.js";

//import Pop from "./pop/index.js";
import VText from "./text/index.js";
//import Collapse from "./collapse/index.js";
//import Picker from "./picker/index.js";
import VInputGroup from "./column/index.js";
import VIp from "./ip/index.js";
import VMac from "./mac/index.js";
import VUpload from "./upload/index.js";
import Base from "./base.js";
const components = {VDialog, VAlert, VElem, VTable, VInput, VRadio, VSelect, VCheckbox, VButton, VProgress,
//UpProgress,
VSwitch, VForm, VFormItem, VItem, VText, VInputGroup, VIp, VMac, VUpload, VSlider};

const install = function (Vue) {
  window.Vue = Vue;
  Vue.use(Base);
  for (let item in components) {
    Vue.component(item, components[item]);
  }
  // components.forEach(component => {
  //   Vue.component(component.name, component);
  // });
};

/* istanbul ignore if */
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}
export default {
  install,
  VDialog,
  VAlert,
  //Header,
  VElem,
  VTable,
  VInput,
  VRadio,
  VSelect,
  VCheckbox,
  VButton,
  VProgress,
  VSwitch,
  VSlider,
  VForm,
  VFormItem,
  VItem,
  //Pop,
  VText,
  VInputGroup, 
  VIp,
  VMac,
  //Picker,
  //Collapse,
  VUpload,
  Base
};