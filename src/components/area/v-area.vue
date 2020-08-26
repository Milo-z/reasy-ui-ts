<template>
  <div ref="elem" v-show="show !== false">
    <slot></slot>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class VArea extends Vue {
  @Prop({ default: true }) readonly show!: boolean;
  fields: Array<any> = [];
  created() {
    this.$on("form.addField", (field: any) => {
      this.fields.push(field);
      this.$dispatch('VForm', "form.addField", field);
    });

    this.$on("form.removeField", (field: any) => {
      this.fields = this.fields.filter(item => item.prop !== field.prop) || [];
      this.$dispatch('VForm', "form.removeField", field);
    });
  }

  @Watch("show", {immediate: true})
  onShowChanged(val: boolean) {
    this.fields.forEach((field: any) => {
      field.show = val;
    });
  }
}
</script>
