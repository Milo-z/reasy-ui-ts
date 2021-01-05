<template>
<div class="form-text-content" :class="css">
      {{value}}
    </div>
</template>

<script lang="ts">
//暂时未用到
import { Vue, Prop, Component } from "vue-property-decorator";

@Component
export default class VText extends Vue {
  @Prop() css!: string;
  @Prop() value!: string;

  //文本忽略验证
  mounted() {
    this.$emit("changeProp", "ignore", true);
  }
}
</script>

