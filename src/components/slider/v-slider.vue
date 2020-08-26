<template>
  <div class="form-el-content" v-show="show">
    <div class="form-slider" :class="css">
      <div class="slider-content" :style="{ width: width + 'px' }">
        <div class="slider-percent" :style="{ width: left + 'px' }"></div>
      </div>
      <div
        class="slider-box"
        @mouseover.stop="bindEvent"
        @mousedown.stop="mouseStart"
        :style="{ left: left + 'px' }"
      ></div>
      <div class="slider-number">{{ vText }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

@Component
export default class VSlider extends Vue {
  @Prop({ default: "" }) css!: string; //样式
  @Prop({ default: true }) show!: boolean; //显示
  @Prop({ default: "", type: [Number, String] }) value!: string | number; //值
  @Prop({ default: 0 }) min!: number; //最小值
  @Prop({ default: 100 }) max!: number; //最大值
  @Prop({ default: false }) disabled!: boolean; //禁用
  @Prop({ default: 200, type: [Number, String] }) width!: number | string; //长度
  @Prop({ default: () => function(){} }) changeCallBack!: Function; //值修改回调

  startX = 0;
  endX = 0;
  percent = 0;
  vText: number | string = 0;
  left = 0;
  lastLeft = 0;
  moveStart = false;

  get perNum() {
    return Number(this.width) / (this.max - this.min);
  }

  created() {
    let val = this.value;
    if(val < this.min) {
      val = this.min;
      this.$emit("change", this.min);
    }
    this.vText = val;
    this.left = this.perNum * (Number(val) - this.min);
  }

  bindEvent() {
    window.addEventListener("mousemove", this.mouseMove, false);
    window.addEventListener("mouseup", this.mouseUp, false);
  }

  mouseStart(e: MouseEvent) {
    if (this.disabled) {
      return;
    }
    this.startX = e.pageX;
    this.lastLeft = this.left;
    this.moveStart = true;
    //document.body.addClass("no-select");
  }
  mouseMove(e: MouseEvent) {
    if (this.moveStart) {
      this.endX = e.pageX;
      this.left = this.lastLeft + this.endX - this.startX;
      if (this.left < 0) {
        this.left = 0;
      }

      if (this.left > this.width) {
        this.left = Number(this.width);
      }

      this.vText = Math.round(Number(this.min) + this.left / this.perNum);
    }
  }
  mouseUp() {
    this.moveStart = false;
    window.removeEventListener("mousemove", this.mouseMove);
    window.removeEventListener("mouseup", this.mouseUp);
    this.$emit("change", this.vText);
    this.changeCallBack(this.vText);
  }

  destroyed() {
    window.removeEventListener("mousemove", this.mouseMove);
    window.removeEventListener("mouseup", this.mouseUp);
  }
}
</script>
