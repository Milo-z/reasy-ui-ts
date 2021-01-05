<template>
<div
    class="form-el-content form-input"
    :class="{ 'error-group': error, [css]: true }"
    v-show="show"
  >
    <input
      :type="type"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :disabled="disabled"
      class="text"
      :name="name"
      :class="{ 'text-password': hasEye, [inputCss]: true }"
      @focus="focused = true"
      @blur="blurEvt()"
      v-model="inputValue"
      v-manualevent="evtHandlerList"
      :evt-name="evtName"
      ref="input"
    />
    <div @click="focus()" class="placeholder-text" v-if="!supportPlaceholder && !inputValue">
      {{ placeholder }}
    </div>
    <div
      v-if="hasEye"
      :class="type == 'password' ? 'v-icon-eye-close' : 'v-icon-eye-open'"
      @click="changePasswordType()"
    ></div>
    <div class="error-bottom text-error" v-if="error">
      {{ msg || error }}
    </div>
  </div>
</template>

<script lang="ts">
import { mixins } from "vue-class-component";
import { Prop, Ref, Component, Watch } from "vue-property-decorator";
import EventMixin from "../add-event";

@Component
export default class VInput extends mixins(EventMixin) {
  @Prop({ default: true }) readonly required!: boolean; //是否为必填项
  @Prop({ default: "" }) readonly css!: string; //样式
  @Prop({ default: "" }) readonly inputCss!: string; //输入框样式
  @Prop({ default: "" }) readonly value!: string; //值
  @Prop({ default: true }) readonly show!: boolean; //是否显示
  @Prop({ default: false }) readonly ignore!: boolean; //是否忽略验证
  @Prop({ default: false }) readonly disabled!: boolean; //是否禁用
  @Prop({ default: false }) readonly hasEye!: boolean; //是否有小眼睛，支持切换输入框类型
  @Prop({ default: "" }) readonly name!: string; //名称
  @Prop({ default: "" }) readonly error!: string; //错误信息
  @Prop() readonly msg!: string; //自定义错误信息
  @Prop({ default: false }) readonly isNum!: boolean; //是否为数字
  @Prop({ default: "text" }) readonly type!: string; //输入框类型
  @Prop({ default: "" }) readonly placeholder!: string;
  @Prop() readonly valid!: string; //输入框数据验证类型
  @Prop([String, Number]) readonly maxlength!: string | number; //最大输入长度
  @Ref() readonly input!: HTMLInputElement;

  supportPlaceholder = this.hasPlaceholder();
  focused = false;

  get inputValue() {
    return this.value;
  }

  set inputValue(val) {
    this.$emit("change", val);
  }

  changePasswordType() {
    if(this.disabled) {
      return;
    }
    let type = this.type == "password" ? "text" : "password";
    this.$emit("changeProp", "type", type);
  }

  hasPlaceholder() {
    let i = document.createElement("input");
    return "placeholder" in i;
  }

  blurEvt() {
    this.focused = false;
    if (this.isNum && this.value) {
      let val:number | string = parseInt(this.value, 10);
      if(isNaN(val)) {
        val = "";
      }
      //输入框只允许输入数字
      this.$emit("change", val.toString());
    }
  }
  focus() {
    this.input.focus();
  }

  @Watch("show")
  onShowChanged(newValue: boolean) {
    if (!newValue) {
      this.$emit("changeProp", "error", "");
    }
  }

  @Watch("disabled")
  onDisabledChanged(newValue: boolean) {
    if (newValue) {
      this.$emit("changeProp", "error", "");
    }
  }
  destroyed() {
    this.$emit("changeProp", "error", "");
  }
}
</script>

