<template>
<div class="progress-content" :class="css" v-if="isShow">
    <div class="h2-title">
      <slot name="header"></slot>
    </div>
    <div class="progress-group">
      <div class="progress-bar" :style="{ 'text-align': textAlign }">
        <div class="progress-percent" :style="{ width: percenter + '%' }" :class="barCss">
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";

@Component
export default class VProgress extends Vue {
  @Prop({ default: 0 }) readonly percent!: number; //初始百分比
  @Prop({ default: true }) readonly show!: boolean; //显示
  @Prop({ default: "" }) readonly css!: string;
  @Prop({ default: "" }) readonly barCss!: string;
  @Prop({ default: "center" }) readonly textAlign!: string;
  @Prop({ default: true }) readonly isAuto!: boolean; //是否需要自动加进度条
  @Prop() readonly intervalTime!: number; //间隔时间
  //@Prop({ default: () => {} }) readonly callback!: Function; //进度条完成时的事件

  progressTimer = 0;
  max = 100;
  isShow = false;
  percenter: number = this.percent;

  update() {
    clearTimeout(this.progressTimer);
    this.progressTimer = window.setTimeout(() => {
      this.update();
    }, this.intervalTime);
    this.setPercent();
  }

  setPercent() {
    if (this.percenter >= this.max) {
      clearTimeout(this.progressTimer);
      this.percenter = this.max;
      this.$emit("callback");
      return;
    }
    this.percenter++;
  }

  @Watch("show", {immediate: true})
  onShowChanged(newVal: boolean) {
    if (newVal) {
      this.isShow = true;
      this.$nextTick(function() {
        this.percenter = this.percent || 0;
        this.isAuto && this.update();
      });
    } else {
      this.percenter = this.max;
      this.isShow = false;
      clearTimeout(this.progressTimer);
    }
  }

  @Watch("percenter")
  onPercentChanged(val: number) {
    this.$emit("change", val);
  }
  @Watch("percent")
  onManualChanged(val: number) {
    if (!this.isAuto) {
      this.percenter = this.percent;
    }
  }
  destroyed() {
    clearTimeout(this.progressTimer);
  }
}
</script>

