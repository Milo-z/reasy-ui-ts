<template>
  <div class="v-collapse border-b form-group">
    <div class="v-collapse-header" :class="{ 'is-active': active }" @click="active = !active">
      {{ title }}
      <i class="v-collapse-arrow v-icon-arrrow-down" :class="{ 'is-active': active }"></i>
    </div>
    <el-collapse-transition>
      <div class="v-collapse-item" v-show="active">
        <div class="v-collapse-item-content">
          <slot></slot>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script lang="ts">
//暂时未用到此组件
import { Vue, Prop, Component } from "vue-property-decorator";
import ElCollapseTransition from "../util/collapse-transition";
@Component({
  components: {
    "el-collapse-transition": ElCollapseTransition
  }
})
export default class VCollapse extends Vue {
  //
  active = false;
  @Prop({ default: "" }) readonly title!: string;
}
</script>
