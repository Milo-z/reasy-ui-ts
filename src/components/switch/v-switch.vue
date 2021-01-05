<template>
<div class="form-switch form-el-content clearfix" v-show="show">
    <div
      class="switch-item"
      :name="name"
      @click="clickSwitch()"
      :class="checked ? 'checked' : ''"
      v-manualevent="evtHandlerList"
      :evt-name="evtName"
    ></div>
    <span class="switch-tips" v-show="hasTips">{{ tips }}</span>
  </div>
</template>

<script lang="ts">
import { mixins } from "vue-class-component";
import { Prop, Component } from "vue-property-decorator";
import EventMixin from "../add-event";

@Component
export default class VSwitch extends mixins(EventMixin) {
  @Prop({ default: true }) readonly required!: boolean; //是否必填项
  @Prop({ default: "" }) readonly css!: string; //样式
  @Prop({ default: true }) readonly show!: boolean; //显示
  @Prop({ default: false }) readonly ignore!: boolean; //是否忽略验证
  @Prop({ default: false }) readonly disabled!: boolean;
  @Prop({ default: "" }) readonly error!: string;
  @Prop([Boolean, String]) readonly value!: string | boolean;
  @Prop({ default: "" }) readonly name!: string;
  @Prop({ default() {
      return {
        on: true,
        off: false
      };
    }
  }) readonly values!: ObjectAny; //开关值，第一项为开启的值  第二项为关闭的值

  @Prop({ default: false }) readonly hasTips!: boolean; //开关后面是否显示文字信息
  @Prop({ default: () => function() {} }) readonly changeCallBack!: Function;
  @Prop({ default: () => function() {} }) readonly beforeChange!: Function; //点击前操作，返回false时不会执行值修改

  firstChange = false;

  get checked() {
    return this.value === this.values.on;
  }
  get tips() {
    return this.checked ? _("Enable") : _("Disable");
  }

  get switchValue() {
    this.changeCallBack(this.value);
    return this.value;
  }
  set switchValue(val) {
    this.$emit("change", val);
  }

  clickSwitch() {
    if (this.disabled) {
      return;
    }
    if (this.beforeChange() === false) {
      return;
    }

    this.switchValue = !this.checked ? this.values.on : this.values.off;
  }
}
</script>

