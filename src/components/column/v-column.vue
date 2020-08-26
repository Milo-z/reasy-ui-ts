<template>
  <div
    class="form-el-content form-input"
    :class="{ 'error-group': error, [css]: true }"
    v-show="show"
  >
    <div class="col-content" :class="{ disabled: disabled, focus: isFocus }" :name="name">
      <span
        class="col-group"
        :style="{ width: 100 / inputList.length + '%' }"
        v-for="(item, index) in inputList"
        :key="item"
      >
        <input
          type="text"
          :disabled="disabled"
          class="text"
          :value="inputVal[index]"
          :data-index="index"
          :maxlength="maxlength"
          @focus="isFocus = true"
          @blur="isFocus = false"
          @keydown="handlerKeyDown"
          @keyup.stop="handlerKeyUp"
          ref="input"
        />
        <div class="col-splitter" v-if="index != inputList.length - 1">{{ splitter }}</div>
      </span>
    </div>
    <div class="error-bottom text-error" v-if="error">{{ msg || error }}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Ref, Component, Watch } from "vue-property-decorator";

function getCursorPos(ctrl: HTMLInputElement): number {
  let Sel,
    doc: Document = document,
    CaretPos = 0;
  //IE Support
  if (doc.selection) {
    ctrl.focus();
    Sel = doc.selection.createRange();
    Sel.moveStart("character", -ctrl.value.length);
    CaretPos = Sel.text.length;
  } else if (ctrl.selectionStart || ctrl.selectionStart === 0) {
    CaretPos = ctrl.selectionStart;
  }
  return CaretPos;
}

@Component
export default class VInputGroup extends Vue {
  @Prop({ default: true }) readonly required!: boolean; //是否为必填项
  @Prop({ default: "" }) readonly css!: string; //样式
  @Prop({ default: true }) readonly show!: boolean; //是否显示
  @Prop({ default: false }) readonly ignore!: boolean; //是否可以忽略不进行数据验证
  @Prop({ default: false }) readonly disabled!: boolean; //是否禁用
  @Prop({ default: "" }) readonly name!: string; //名称
  @Prop({ default: "" }) readonly value!: string; //值
  @Prop() readonly error!: string; //错误信息
  @Prop() readonly msg!: string; //自定义错误信息
  @Prop() readonly valid!: string; //数据验证类型
  @Prop({ default: 4, type: [Number, String] }) readonly column!: number | string; //输入框个数
  @Prop({ default: 3 }) readonly maxlength!: number; //输入框最大输入长度
  @Prop({ default: "." }) readonly splitter!: string; //分隔符
  @Prop({ default: "0-9" }) readonly allow!: string; //允许输入字段，最后会转成正则且忽略大小写
  @Ref() readonly input!: Array<HTMLInputElement>;

  isFocus = false;
  clickIndex = 0;
  eventKeyDown = false;

  get inputList() {
    let len = this.column,
      i = 0,
      itemArr = [];
    for (; i < len; i++) {
      itemArr.push(String(i + 1));
    }

    return itemArr;
  }

  get inputVal() {
    return this.value.split(this.splitter);
  }

  created() {
    for (let prop in this.$props) {
      this.changeProp(prop, this.$props[prop]);
    }
  }

  changeProp(key: string, val: any) {
    this.$emit("changeProp", key, val);
  }

  handlerKeyDown(event: KeyboardEvent) {
    let evtTarget = event.target as HTMLInputElement,
      val = evtTarget.value,
      index = Number(evtTarget.getAttribute("data-index")),
      keyVal = event.char || event.key,
      keyCode = event.keyCode,
      maxIndex = this.inputList.length - 1,
      position;

    let inputElArr = this.input;

    if (keyCode === 8) {
      if (!this.eventKeyDown) {
        this.eventKeyDown = true;
        this.clickIndex = index;
      }
      position = getCursorPos(evtTarget); //光标位置
      if (position === 0) {
        evtTarget.value = "";
      }
      //this.setValue();
    } else if (keyCode == 39 || keyCode == 40) {
      //右 或者下
      position = getCursorPos(evtTarget); //光标位置
      if (position === evtTarget.value.length) {
        if (index !== maxIndex) {
          inputElArr[index + 1].focus();
          event.preventDefault();
          return;
        }
      }
    } else if (keyCode == 37 || keyCode == 38) {
      position = getCursorPos(evtTarget); //光标位置
      if (position === 0) {
        if (index !== 0) {
          inputElArr[index - 1].focus();
          event.preventDefault();
          return;
        }
      }
    }
    //回退
    if (keyCode === 8 && val === "") {
      index != 0 && inputElArr[index - 1].focus();
      event.preventDefault();
      return;
    }
    if (keyVal === this.splitter) {
      event.preventDefault();
    }
  }

  handlerKeyUp(event: KeyboardEvent) {
    let evtTarget = event.target as HTMLInputElement,
      val,
      index = Number(evtTarget.getAttribute("data-index")),
      keyVal = event.char || event.key,
      regStr = this.allow,
      reg = new RegExp("[" + regStr + "]", "gi"),
      illegalReg = new RegExp("[^" + regStr + "]", "gi"),
      keyCode = event.keyCode,
      position,
      maxIndex = this.inputList.length - 1;

    let inputElArr = this.input;

    if (keyCode >= 37 && keyCode <= 40) {
      //方向键
      return;
    }
    if (keyCode === 8) {
      this.eventKeyDown = false;
      if (this.clickIndex > index) {
        for (let i = this.clickIndex; i > index; i--) {
          inputElArr[i].value = "";
        }
      }
      position = getCursorPos(evtTarget); //光标位置
      if (position === 0) {
        evtTarget.value = "";
      }
      this.setValue();
      return;
    }

    //只取前几个数据
    val = evtTarget.value = evtTarget.value.replace(illegalReg, "").slice(0, this.maxlength);

    //当输入值是分隔符或者是允许输入的数据时
    if (reg.test(keyVal) || keyVal === this.splitter) {
      //非最后一个输入框
      if (index !== maxIndex) {
        //当输入值是分隔符并且当前输入框值不是空  或者 当前值长度等于允许输入的最大长度
        if ((keyVal === this.splitter && val !== "") || val.length === this.maxlength) {
          //选中下一个输入框
          inputElArr[index + 1].setSelectionRange(0, -1);
          inputElArr[index + 1].focus();
        }
      }
    }
    this.setValue();
  }

  setValue() {
    let arr: Array<string> = [],
      isNotNull = false;

    let inputElArr = this.input;
    inputElArr.forEach(elem => {
      if (elem.value != "") {
        isNotNull = true;
      }
      arr.push(elem.value);
    });
    this.$emit("change", isNotNull ? arr.join(this.splitter) : "");
  }

  @Watch("show")
  onShowChanged(newValue: boolean) {
    if (!newValue) {
      this.changeProp("error", "");
    }
  }

  @Watch("disabled")
  onDisabledChanged(newValue: boolean) {
    if (!newValue) {
      this.changeProp("error", "");
    }
  }

  destroyed() {
    this.changeProp("error", "");
  }
}
</script>
