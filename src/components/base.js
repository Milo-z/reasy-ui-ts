import {
  formMessage,
  checkData,
  checkSubmit
} from "./libs.ts";

import msgboxVue from "./MessageBox.vue";

import Derectives from "../directives";

const install = function (Vue) {
  //Vue.prototype.setOptions = setOptions;
  Vue.use(Derectives);

  //定义数据验证
  Vue.prototype.$checkData = checkData;
  Vue.prototype.$checkAll = checkSubmit;

  /**
   * 显示弹出层
   *
   * @param {object | string} msgOptions
   * @returns
   */
  let msgBox;
  const MessageBoxInstance = Vue.extend(msgboxVue);

  function showDialog(msgOptions, hasCancel) {
    let currentMsg, msgBoxEl;
    if (!msgBox) {
      currentMsg = new MessageBoxInstance();
      msgBoxEl = currentMsg.$mount().$el;
      document.body.appendChild(msgBoxEl);
      //msgBox = currentMsg;
    } else {
      currentMsg = msgBox;
      // Vue.extend(currentMsg, defaults);
    }

    if (typeof msgOptions === "string") {
      currentMsg.content = msgOptions;
    } else if (typeof msgOptions === "object") {
      if (typeof msgOptions.content == "object" && msgOptions.content.nodeType === 1) {
        msgOptions.content = msgOptions.content.outerHTML;
        msgOptions.parseHtml = true;
      }

      Object.assign(currentMsg, msgOptions);
    }

    currentMsg.hasCancel = !!hasCancel;

    return currentMsg
      .showMsgBox()
      .then((val) => {
        currentMsg = null;
        return Promise.resolve(val);
      })
      .catch((err) => {
        currentMsg = null;
        return Promise.reject(err);
      });
  }

  //提示信息
  Vue.prototype.$message = function (msg, time) {
    formMessage.success = false;
    formMessage.setMsg(msg, time);
  };

  //成功信息
  Vue.prototype.$success = function (msg, time) {
    formMessage.success = true;
    formMessage.setMsg(msg, time);
  };

  // 在Vue的原型上添加实例方法，以全局调用
  Vue.prototype.$confirm = function (msgOptions) {
    return showDialog(msgOptions, true);
  };

  Vue.prototype._ = function (key, replacements) {
    let nkey = key,
      index,
      count = 0;
    if (!replacements) {
      return nkey;
    }
    if (replacements instanceof Array && replacements.length !== 0) {
      while ((index = nkey.indexOf("%s")) !== -1) {
        nkey = nkey.slice(0, index) + replacements[count] + nkey.slice(index + 2);
        count = count + 1 === replacements.length ? count : count + 1;
      }
    } else if (typeof replacements === "string") {
      index = nkey.indexOf("%s");
      nkey = nkey.slice(0, index) + replacements + nkey.slice(index + 2);
    }
    return nkey;
  };

  Vue.prototype.$alert = function (msgOptions) {
    return showDialog(msgOptions);
  };

  Vue.prototype.$isMobile =
    /Android|webOS|iPhone|iPod|iPad|BlackBerry/gi.test(navigator.userAgent) &&
    document.documentElement.clientWidth <= 768;

  //触发表单的广播事件
  Vue.prototype.$dispatch = function (componentName, name, ...arsg) {
    componentName = componentName;
    if (this.$options.name === componentName || this === this.$root) {
      this.$emit(name, ...arsg);
    } else {
      this.$parent.$dispatch(componentName, name, ...arsg);
    }
  };

  Vue.prototype.$getLabelWidth = function() {
    if(this.$options.name === 'VPage' || this === this.$root) {
      return this.labelWidth || 'auto';
    }
    return this.$parent.$getLabelWidth();
  };
};

export default {
  install
};