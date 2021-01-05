import { Vue } from "vue/types/vue";

function isObject(obj: any) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

function isDefined(val: any): boolean {
  return val !== undefined && val !== null;
}

const trim = function(string: any) {
  return (string || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
};

/* istanbul ignore next */
function hasClass(el: Element, cls: string) {
  if (!el || !cls) return false;
  if (cls.indexOf(" ") !== -1) throw new Error("className should not contain space.");
  if (el.classList) {
    return el.classList.contains(cls);
  }
  return (" " + el.className + " ").indexOf(" " + cls + " ") > -1;
}

/**
 * @description
 * @param {Element} el
 * @param {string} cls
 * @returns
 */
function addClass(el: Element, cls: string): void {
  if (!el) return;
  let curClass = el.className;
  let classes = (cls || "").split(" ");

  for (let i = 0, j = classes.length; i < j; i++) {
    let clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += " " + clsName;
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
}

/* istanbul ignore next */
function removeClass(el: Element, cls: string): void {
  if (!el || !cls) return;
  let classes = cls.split(" ");
  let curClass = " " + el.className + " ";

  for (let i = 0, j = classes.length; i < j; i++) {
    let clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(" " + clsName + " ", " ");
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
}

/**
 * 检查元素的数据合法性
 * @param {object} dataKey 元素对象
 * @param {string} [value] 元素的值
 */
function checkData(this: Vue, dataKey: ObjectAny, value?: any): boolean {
  let val = isDefined(value) ? value : dataKey.val,
    errMsg = "",
    handleValid;

  if(!isDefined(val)) {
    return true;
  }
  if (dataKey.show === false || dataKey.ignore || dataKey.disabled) {
    //忽略验证时
    return true;
  }

  if (dataKey.required !== false) {
    if (val === "" || val.length === 0) {
      dataKey.error = _("This field cannot be blank.");
      return false;
    }
  } else {
    //非必填时 为空则不验证
    if (val === "") {
      dataKey.error = "";
      return true;
    }
  }
  if (Array.isArray(dataKey.sortArray)) {
    let sortArr = dataKey.sortArray.filter((item) => item.value == val);
    if (sortArr.length > 0) {
      dataKey.error = "";
      return true;
    }
  }
  //未定义验证类型时
  if (!dataKey.valid) {
    dataKey.error = "";
    return true;
  }

  //数据验证函数
  handleValid = this.$valid[dataKey.valid] || {};
  //验证参数
  let args = [];
  if (dataKey.min != undefined) {
    args.push(dataKey.min);
  }
  if (dataKey.max != undefined) {
    args.push(dataKey.max);
  }
  if (dataKey.msg != undefined) {
    args.push(dataKey.msg);
  }

  if (typeof handleValid == "function") {
    errMsg = handleValid(val, ...args);
  } else if (typeof handleValid.all === "function") {
    errMsg = handleValid.all(val, ...args);
  }

  //数据验证
  if (errMsg) {
    dataKey.error = errMsg;
    return false;
  }

  dataKey.error = "";
  return true;
}

if (typeof window._ !== "function") {
  window._ = function(key: string, replacements: any) {
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
}

function copyDeepData(item: any): any {
  let newItem: any;
  if (Array.isArray(item)) {
    newItem = [];
    item.map(function(arr) {
      newItem.push(copyDeepData(arr));
    });
  } else if (typeof item === "function") {
    newItem = item;
  } else if (item instanceof Object) {
    newItem = {};
    for (let prop in item) {
      newItem[prop] = copyDeepData(item[prop]);
    }
  } else {
    newItem = item;
  }

  return newItem;
}

/**
 * 数组排序
 *
 * @param {object} item1       数组元素对象
 * @param {object} item2       数组元素对象
 * @param {string|array} fields      排序属性
 * @param {object} sortTypeObj  排序属性的排序方式对象
 *
 * @return {numbber} 排序结果
 */
function sortByKey(item1: ObjectAny, item2: ObjectAny, fields: Array<string>, sortTypeObj: ObjectAny) {
  let cps = [],
    i = 0,
    j = 0,
    prop,
    value1,
    value2,
    asc; //是否升序

  // asc: 升序
  // desc: 降序 默认
  if (typeof fields === "string") {
    fields = [fields];
  }

  if (fields && fields.length > 0) {
    for (i = 0; i < fields.length; i++) {
      asc = sortTypeObj[fields[i]] == "asc"; //升序
      prop = fields[i];
      if (typeof item1[prop] == "number" || typeof item2[prop] == "number") {
        value1 = item1[prop];
        value2 = item2[prop];
      } else {
        value1 = item1[prop].toString().toUpperCase();
        value2 = item2[prop].toString().toUpperCase();
      }
      if (value1 > value2) {
        cps.push(asc ? 1 : -1);
        break; // 大于时跳出循环。
      } else if (value1 === value2) {
        cps.push(0);
      } else {
        cps.push(asc ? -1 : 1);
        break; // 小于时跳出循环。
      }
    }
  }

  for (j = 0; j < cps.length; j++) {
    if (cps[j] === 1 || cps[j] === -1) {
      return cps[j];
    }
  }
  return 0;
}

/**
 * 错误提示信息
 *
 * @class FormMessage
 */
class FormMessage {
  /**
   *Creates an instance of FormMessage.
   * @param {string} msg
   * @param {*} showTime
   * @memberof FormMessage
   */
  msg: string | Element;
  time: number;
  success: boolean;
  elemPool: Array<Element>;
  constructor() {
    this.msg = "";
    this.time = 2000;
    this.elemPool = [];
    this.success = false;
  }
  createElem(): Element {
    let elem = document.createElement("div");
    elem.className = "form-message";
    return elem;
  }

  getMsgContent(): Element | Node {
    if (this.elemPool.length > 0) {
      return this.elemPool[0].cloneNode(true);
    }

    return this.createElem();
  }

  getContainer() {
    let elem = document.getElementsByClassName("message-container")[0];

    if (!elem) {
      elem = document.createElement("div");
      elem.className = "message-container";
      document.body.appendChild(elem);
    }

    return elem;
  }

  setMsg(msg: any, showTime: number) {
    let elem: any = this.getMsgContent(),
      containerElem = this.getContainer(),
      _this = this;
    if (typeof msg == "object" && msg.nodeType === 1) {
      msg = msg.outerHTML;
    }
    this.msg = msg;
    this.time = showTime || 2000 + msg.length * 50;

    if (_this.success) {
      addClass(elem, "message-success");
      elem.innerHTML = `<span class="form-message-icon v-icon-notice-success"></span>${this.msg}`;
    } else {
      elem.innerHTML = `<span class="form-message-icon v-icon-notice-error"></span>${this.msg}`;
    }
    containerElem.appendChild(elem);
    setTimeout(function() {
      addClass(elem, "in");
    }, 10);
    setTimeout(function() {
      addClass(elem, "out");
      removeClass(elem, "in");
      setTimeout(function() {
        removeClass(elem, "out");
        removeClass(elem, "message-success");
        elem.innerHTML = "";
        _this.elemPool.push(elem);
        containerElem.removeChild(elem);
      }, 300);
    }, this.time);
  }
}

let formMessage = new FormMessage();

/**
 * 防抖和节流
 * 防抖的情况下只会调用一次， 而节流的情况会每隔一定时间调用一次函数
 */
function debounce(func: Function, wait: number, immediate = true) {
  let timeout: any, context: any, args: any;
  // 延迟执行函数
  const later = () =>
    setTimeout(() => {
      // 延迟函数执行完毕，清空定时器
      timeout = null;
      // 延迟执行的情况下，函数会在延迟函数中执行
      // 使用到之前缓存的参数和上下文
      if (!immediate) {
        func.apply(context, args);
        context = args = null;
      }
    }, wait);

  function debounced(this: void, ...params: Array<any>) {
    if (!timeout) {
      timeout = later();
      if (immediate) {
        //立即执行
        func.apply(this, params);
      } else {
        //闭包
        context = this;
        args = params;
      }
    } else {
      clearTimeout(timeout);
      timeout = later();
    }
  }
  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
  };
  return debounced;
}

export {
  //setOptions,
  sortByKey,
  copyDeepData,
  formMessage,
  checkData,
  isDefined,
  isObject,
  hasClass,
  addClass,
  removeClass,
  debounce
};
