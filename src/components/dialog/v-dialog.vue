<template>
  <transition name="pop-fade">
    <div class="dialog-fixed" v-if="isShow">
      <div class="overlay"></div>
      <div class="dialog">
        <div class="dialog-container" :class="css">
          <div class="dialog-content" v-clickoutside="handlerOutSide">
            <div class="dialog-title">
              <span>{{ title }}</span>
              <span v-if="hasClose" class="dialog-close v-icon-close" @click="handlerCancel()"></span>
            </div>
            <div class="content">
              <slot></slot>
            </div>
            <div class="btn-group" v-if="hasCancel || hasOK">
              <v-button v-if="hasCancel" :callback="handlerCancel" :title="cancelText"></v-button>
              <v-button v-if="hasOK" :callback="handlerOK" css="btn-primary" :title="okText"></v-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

@Component
export default class VDialog extends Vue {
  @Prop({ default: "" }) readonly css!: string; //样式
  @Prop({ default: "" }) readonly title!: string; //标题
  @Prop({ default: true }) readonly hasOK!: boolean; //是否有确认按钮
  @Prop({ default: true }) readonly hasCancel!: boolean; //是否有取消按钮
  @Prop({ default: true }) readonly outside!: boolean; //是否点击外部直接隐藏
  @Prop({ default: true }) readonly autoHide!: boolean; //点击确定后是否自动隐藏
  @Prop({ default: true }) readonly hasClose!: boolean; //是否有关闭按钮
  @Prop({ default: _("确定") }) readonly okText!: string; //确认按钮文字
  @Prop({ default: _("取消") }) readonly cancelText!: string; //取消按钮文字
  @Prop({ default: true }) readonly show!: boolean; //是否显示
  @Prop({ default: () => {} }) readonly beforeClose!: Function; //保存关闭前事件
  @Prop({ default: () => {} }) readonly cancelCallBack!: Function; //取消事件

  get isShow() {
    return this.show;
  }
  set isShow(val) {
    this.$emit("hide", val);
  }

  handlerOutSide() {
    if (!this.outside) {
      return;
    }
    this.handlerCancel();
  }

  handlerCancel() {
    this.isShow = false;
  }

  handlerOK() {
    if (this.beforeClose() === false || !this.autoHide) {
      return;
    }
    this.handlerCancel();
  }
}
</script>
