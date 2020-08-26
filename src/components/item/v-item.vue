<template>
  <component :is="vname" v-model="value" @change="changeVal" @changeProp="changeProp" v-bind="dataKey">
    <slot></slot>
  </component>
</template>
<script lang="ts">
//暂时未用到！！！
import { Vue, Prop, Component, Model } from "vue-property-decorator";

@Component
export default class VItem extends Vue {
  @Prop() readonly dataKey!: DK;
  @Prop() readonly vname!: string;
  @Model('change') readonly value!: any;

  changeProp(key: string, val: any) {
    if (this.dataKey[key] === undefined) {
      this.$set(this.dataKey, key, val);
    } else {
      this.dataKey[key] = val;
    }
  }
  changeVal(val:string) {
    this.$emit("change", val);
  }
}
</script>
