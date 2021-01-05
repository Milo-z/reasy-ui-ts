<template>
<transition>
    <div
      ref="tooltip"
      v-if="parseHtml"

      class="el-tooltip"
      v-show="show && content"
      :style="{ left: left + 'px', top: top + 'px' }"
    >
      <div v-html="content" ref="text"></div>
      <div class="triangle-bottom"></div>
    </div>
    <div
      ref="tooltip"
      v-else
      class="el-tooltip"
      v-show="show && content"
      :style="{ left: left + 'px', top: top + 'px', 'min-width': minWidth + 'px', 'max-width': maxWidth }"
    >
      <span class="text-nowrap" ref="text">{{ content }}</span>
      <div class="triangle-bottom"></div>
    </div>
  </transition>
</template>

<script lang="js">
export default {
  data() {
    return {
      parseHtml: false,
      content: "",
      left: 0,
      top: 0,
      minWidth: 12,
      maxWidth: "",
      direction: 'top',
      show: false,
      triangleLeft: 0,
      relativeWidth: 0,
      relativeHeight: 0
    };
  },
  methods: {
    updatePosition() {
      this.$refs.tooltip.style.minWidth = "";
      this.$nextTick(function () {
        let clientRect = this.$refs.tooltip.getBoundingClientRect(),
            bodyWidth = document.body.clientWidth,
            tooltipWidth = clientRect.right - clientRect.left,
            textWidth = this.$refs.text.clientWidth;
        //文本宽度
        if (textWidth < this.relativeWidth) {
          this.minWidth = textWidth;
        } else {
          this.minWidth = this.relativeWidth;
        }
        this.left = this.left - tooltipWidth / 2 + this.relativeWidth / 2;
        this.triangleLeft = this.relativeWidth / 2;
        if (clientRect.right > bodyWidth) {
          this.direction = "left";
          this.left = this.left - (clientRect.right - bodyWidth);
        }
        this.top = this.top - this.$refs.tooltip.offsetHeight - 15;
      });
    }
  }
};
</script>

