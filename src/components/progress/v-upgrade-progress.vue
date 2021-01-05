<template>
<div class="progress-content">
    <div class="h2-title">
      <slot name="header"></slot>
    </div>
    <div class="progress-group">
      <div class="progress-bar">
        <div class="progress-percent" :style="{ width: percent + '%' }" :class="barcss">
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";

@Component
export default class VUpProgress extends Vue {
  @Prop({ default: 0 }) percent!: number; //初始百分比
  @Prop({ default: "" }) readonly barcss!: string;

  max = 100;

  update() {
    if (this.percent >= this.max) {
      this.percent = this.max;
      return;
    }
  }

  @Watch("percent")
  onPercentChanged(val: number) {
    this.update();
    this.$emit("change", val);
  }
}
</script>

