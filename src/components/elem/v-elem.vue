<template>
<transition
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="enter"
    @leave="beforeEnter"
    @after-leave="afterEnter"
  >
    <div class="collapse-active clearfix" ref="elem" v-if="show !== false" :style="style">
      <div class="float" ref="children">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
/**
 * v-if 支持动画效果
 */
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class VElem extends Vue {
  @Prop({ default: true }) readonly show!: boolean;
  public $refs!: {
    [name: string]: HTMLDivElement;
  };
  style = {
    overflowY: ""
  };

  beforeEnter(el: HTMLElement) {
    el.style.overflowY = "hidden";
    el.style.height = "0px";
  }
  enter(el: HTMLElement) {
    el.style.height = this.$refs.children.clientHeight + "px";
  }
  afterEnter(el: HTMLElement) {
    el.style.height = "";
    el.style.overflowY = "";
  }

  @Watch("show")
  onShowChanged(val: boolean) {
    if (val) {
    } else {
      this.$refs.elem.style.overflowY = "hidden";
      this.$refs.elem.style.height = this.$refs.children.clientHeight + "px";
    }
  }

  beforeDestroy() {
    if (this.$refs.elem) {
      this.$refs.elem.style.overflowY = "";
    }
  }

  translate() {
    //window.B && window.B.translate(this.$refs.elem);
    // this.$refs.elem.setAttribute("data-translated", "true");
  }
}
</script>

