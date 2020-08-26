<template>
  <transition name="fade">
    <v-dialog @hide="hide" v-bind="$props">
      <slot></slot>
    </v-dialog>
  </transition>
</template>

<script lang="ts">

// import Component from 'vue-class-component';
import { Vue, Component, Prop} from "vue-property-decorator";

@Component
export default class VAlert extends Vue {
  @Prop({ default: "" }) readonly css!: string; //样式
  @Prop({ default: "" }) readonly title!: string; //标题
  @Prop({ default: true }) readonly hasOK!: boolean; //是否有确定按钮
  @Prop({ default: true }) readonly show!: boolean; //是否显示
  @Prop({ default: _("OK") }) readonly okText!: string; //确定按钮文字
  @Prop({ default: function() {} }) readonly beforeClose!: Function; //关闭前函数

  created() {
    this.$props.hasCancel = false;
    this.$props.outside = false;
  }
  hide() {
    this.$emit("hide");
  }
}
</script>
