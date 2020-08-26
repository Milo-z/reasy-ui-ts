<template>
  <div class="button-item" v-if="show !== false">
    <button
      :name="name"
      class="btn"
      type="button"
      :class="{ [css]: css, disabled: disabled }"
      @click.stop="clickCallBack()"
      ref="button"
    >
      <span v-if="title">{{ title }}</span>
    </button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from "vue-property-decorator";

@Component
export default class VButton extends Vue {
  @Prop(String) readonly title!: string; //按钮文字
  @Prop({ default: "" }) readonly css!: string; //样式
  @Prop({ default: true }) readonly show!: boolean; //显示
  @Prop({ default: false }) readonly disabled!: boolean; //禁用
  @Prop({ default: "" }) readonly name!: string; //名称
  @Prop({ type: Function }) callback!: Function; //点击事件
  @Ref() readonly button!: HTMLButtonElement;
  //props: ["title", "css", "callback", "show", "disabled", "name"],

  clickCallBack() {
    this.button.blur();
    if (this.disabled === true) {
      return;
    }
    if (typeof this.callback == "function") {
      this.callback(arguments);
    } else {
      this.$emit("callback");
    }
  }
}
</script>
