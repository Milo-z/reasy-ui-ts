<template>
<v-input-group v-bind="$props" @change="changeVal" @changeProp="changeProp"></v-input-group>
</template>

<script lang="ts">
import { mixins } from "vue-class-component";
import { Vue, Prop, Ref, Component, Watch } from "vue-property-decorator";
import EventMixin from "../add-event";

@Component
export default class VMac extends mixins(EventMixin) {
  @Prop({ default: true }) readonly required!: boolean; //是否必填
  @Prop({ default: "" }) readonly css!: string; //样式
  @Prop({ default: true }) readonly show!: boolean; //显示
  @Prop({ default: false }) readonly ignore!: boolean; //是否忽略验证
  @Prop({ default: false }) readonly disabled!: boolean; //是否禁用
  @Prop({ default: "" }) readonly name!: string; //名称
  @Prop({ default: "" }) readonly value!: string; //值
  @Prop() readonly error!: string; //错误信息
  @Prop() readonly msg!: string; //自定义错误信息
  @Prop() readonly valid!: string; //数据验证
  @Prop({ default: 6, type: [Number, String] }) readonly column!: number | string; //输入框个数
  @Prop({ default: 2 }) readonly maxlength!: number; //输入框最大输入长度
  @Prop({ default: ":" }) readonly splitter!: string; //分隔符
  @Prop({ default: "0-9a-f" }) readonly allow!: string; //允许输入字符的正则
  @Ref() readonly input!: Array<HTMLInputElement>;

  changeProp(key:string, val:string) {
    this.$emit("changeProp", key, val);
  }
  changeVal(val:string) {
    this.$emit("change", val);
  }
}
</script>

