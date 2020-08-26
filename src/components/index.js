import "../css/index.scss";
/*全局组件*/

import Dialog from "./dialog/index.js";
import Alert from "./alert/index.js";
//import Area from "./area/index.js";
import Elem from "./elem/index.js";
import Table from "./table/index.js";
import Input from "./input/index.js";
import Radio from "./radio/index.js";
import Select from "./select/index.js";
import Checkbox from "./checkbox/index.js";
import Button from "./button/index.js";
import {
  Progress,
  //UpProgress
} from "./progress/index.js";
import Switch from "./switch/index.js";
//import Slider from "./slider/index.js";
import {
  VForm,
  VFormItem
} from "./form/index.js";
import Item from "./item/index.js";

//import Pop from "./pop/index.js";
import Text from "./text/index.js";
//import Collapse from "./collapse/index.js";
//import Picker from "./picker/index.js";
import Column from "./column/index.js";
import Ip from "./ip/index.js";
import Mac from "./mac/index.js";
import Upload from "./upload/index.js";
import Base from "./base.js";
const components = [
  Dialog,
  Alert,
  Elem,
  Table,
  Input,
  Radio,
  Select,
  Checkbox,
  Button,
  Progress,
  //UpProgress,
  Switch,
  VForm,
  VFormItem,
  Item,
  Text,
  Column,
  Ip,
  Mac,
  Upload
];

const install = function (Vue) {
  window.Vue = Vue;
  Vue.use(Base);
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

/* istanbul ignore if */
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}
export default {
  install,
  Dialog,
  Alert,
  //Header,
  Elem,
  Table,
  Input,
  Radio,
  Select,
  Checkbox,
  Button,
  Progress,
  Switch,
  //Slider,
  VForm,
  VFormItem,
  Item,
  //Pop,
  Text,
  //Picker,
  //Collapse,
  Upload,
  Base
};