<template>
<div class="form-el-content form-select" :class="{ 'error-group': error, [css]: css }" v-show="show">
    <div v-clickoutside="hide" @click.stop="showOption">
      <input
        type="text"
        class="text"
        v-model="inputValue"
        :style="{ visibility: isEdit ? 'visible' : 'hidden' }"
        :disabled="disabled"
        :name="name"
        @keyup="changeValue()"
        @blur="setKeyValue()"
        :maxlength="maxlength"
        ref="input"
        v-manualevent="evtHandlerList"
        :evt-name="evtName"
      />
      <div ref="inputtext" class="input-text" :class="{ active: dropdownShow, disabled: disabled }" v-show="showLabel">
        <div class="text-tips">{{ selectLabel }}</div>
      </div>
      <div class="select-arrow" @click.stop="clickArrow" :class="dropdownShow ? 'arrow-up' : 'arrow-down'">
        <div class="select-arrow-icon v-icon-arrrow-down"></div>
      </div>
    </div>
    <div class="error-bottom text-error" v-if="error">{{ msg || error }}</div>
    <!-- <v-picker v-model="pickerVisible" :value="val" :data="sortArray" @confirm="setValue"></v-picker> -->
  </div>
</template>

<script lang="ts">
import { mixins } from "vue-class-component";
import { Prop, Ref, Component, Watch } from "vue-property-decorator";
import EventMixin from "../add-event";

@Component
export default class VSelect extends mixins(EventMixin) {
  @Prop({ default: true }) readonly required!: boolean;
  @Prop({ default: "" }) readonly css!: string;
  @Prop({ default: true }) readonly show!: boolean;
  @Prop({ default: false }) readonly ignore!: boolean;
  @Prop({ default: false }) readonly disabled!: boolean;
  @Prop({ default: "" }) readonly error!: string;
  @Prop() readonly msg!: string; //自定义错误信息
  @Prop() readonly value!: string;
  @Prop({ default: "" }) readonly defaultVal!: string; //默认值
  @Prop({ default: "" }) readonly name!: string;
  @Prop({ default: "Mbps" }) readonly unit!: string;

  @Prop({ default: false }) readonly hasManual!: boolean; //是否支持自定义输入
  @Prop({ default: false }) readonly hasUnit!: boolean; //是否有单位
  @Prop({ default: _("Custom") }) readonly manualText!: string; //自定义文字
  @Prop({ default: "-1" }) readonly manualValue!: string; //自定义值，主要用于回调处理
  @Prop([String, Number]) readonly maxlength!: string | number; //最大输入长度
  @Prop({ default: true }) readonly immediate!: boolean; //是否立即执行回调函数
  @Prop({ default: false }) readonly isNum!: boolean; //是否是数字
  @Prop({ default: false }) readonly limitVal!: boolean; //极限值
  @Prop({ default: true }) readonly showTitle!: boolean; //是否显示title
  @Prop() readonly type!: string;
  @Prop() readonly placeholder!: string;
  @Prop() readonly valid!: string;
  @Prop({ default: () => function() {} }) readonly changeCallBack!: Function;
  @Prop({ default: () => function() {} }) readonly beforeChange!: Function;

  @Ref() readonly input!: HTMLInputElement;
  @Ref() readonly inputtext!: HTMLInputElement;
  @Ref() readonly dropdown!: HTMLInputElement;
  @Prop({
    default() {
      return [];
    }
  })
  readonly sortArray!: Array<ItemObject>;

  //@Provide() manualBack = this.handlerCallBack;

  isEdit = false;
  isInput = false; //是否正在输入
  dropdownShow = false;
  showLabel = true;

  lastLabel = "";
  created() {
    this.addEvent();
  }

  set pickerVisible(val) {
    this.dropdownShow = val;
  }
  get pickerVisible() {
    return this.dropdownShow;
  }

  get inputValue() {
    if (this.immediate && !this.isInput) {
      this.changeCallBack(this.value);
    }
    return this.value;
  }

  set inputValue(val: string) {

  }

  get selectLabel() {
    let newVal = this.value;
    let varArr = this.sortArray.filter((item) => item.value === newVal);
    //存在下拉列表
    if (varArr.length === 1) {
      !this.isInput && (this.isEdit = false);
      if (!this.showTitle) {
        return varArr[0].value;
      }
      return varArr[0].title;
    }

    //支持自定义时
    this.hasManual &&
      this.$nextTick(function() {
        this.isEdit = true;
      });
    if (this.hasUnit) {
      return newVal + this.unit;
    }
    return newVal;
  }

  changeProp(key: string, val: any) {
    this.$emit("changeProp", key, val);
  }

  changeSelect(value: string, label: string, disabled?: boolean) {
    this.dropdownShow = false;
    if (value === this.value || disabled) {
      return;
    }
    if (this.beforeChange(value) === false) {
      return;
    }
    this.inputValue = value;
    this.changeProp("error", "");
    this.setValue(value);
    this.changeCallBack(value);
    this.handlerChange();
  }

  handlerChange() {
    let events = (
      this.events ||
      function() {
        return {};
      }
    )();
    if (events && events.change) {
      if (typeof events.change === "function") {
        events.change();
      }
    }
  }

  setValue(val: string) {
    this.$emit("change", val);
  }

  clickArrow() {
    if (!this.disabled) {
      this.dropdownShow = !this.dropdownShow;
    }
  }

  showOption() {
    if (!this.disabled && !this.isEdit) {
      this.dropdownShow = !this.dropdownShow;
    }
    if (!this.disabled && this.isEdit) {
      this.showLabel = false;
      this.input.focus();
    }
  }

  /**
   * 失去焦点时，修改KEY值
   */
  setKeyValue() {
    this.showLabel = true;
    let val = this.input.value;
    let valArr = this.sortArray.filter((item) => item.value === val),
      newVal;

    newVal = val;
    if (this.isNum) {
      newVal = Number(val).toString();
    }

    if (this.input.value === "") {
      newVal = this.lastLabel || this.defaultVal;
    }
    if (valArr.length === 1) {
      this.isEdit = false;
    }
    this.isInput = false;
    if (this.limitVal) {
      if (+newVal <= 0.01) {
        newVal = "0";
      }
    }
    if (newVal === this.value) {
      return;
    }

    this.setValue(newVal);
    this.changeCallBack(newVal);
  }

  changeValue() {
    //this.checkData(this, this.selectLabel);
    if (!this.isEdit) {
      return;
    }
    this.isInput = true;
    this.dropdownShow = false;

    //this.$emit("check", this.input.value);
    this.setValue(this.input.value);
  }

  handlerCallBack() {
    this.lastLabel = this.value;
    this.setValue(""); //选择自定义时，将值改为空
    this.showLabel = false;
    this.input.style.visibility = "visible";
    this.$nextTick(function() {
      this.changeProp("error", "");
      this.isEdit = true;
      this.input.focus();
      this.input.scrollIntoView({ block: "center" });
      this.isInput = true;
    });
  }

  hanlderManual() {
    this.handlerCallBack();
    this.hide();
    this.changeCallBack(this.manualValue);
    this.handlerChange();
  }
  hide() {
    this.dropdownShow && (this.dropdownShow = false);
  }
  focus() {
    this.showOption();
  }

  beforeDestroy() {
    this.hide();
  }

  @Watch("dropdownShow")
  onDropChanged(newValue: boolean) {
    this._dropdown(this, this.css);
  }
  @Watch("show")
  onShowChanged(newValue: boolean) {
    if (!newValue) {
      this.changeProp("error", "");
    }
  }

  @Watch("disabled")
  onDisabledChanged(newValue: boolean) {
    if (newValue) {
      this.changeProp("error", "");
    }
  }
}
</script>
