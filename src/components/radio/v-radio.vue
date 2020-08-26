<template>
  <div class="form-el-content" v-show="show" :class="{ 'error-group': error, [css]: true }">
    <template v-for="item in sortArray">
      <label
        :class="['form-radio', radioValue === item.value ? 'checked' : '']"
        @click.stop="changeRadio(item.value, item)"
        :key="item.value"
        :name="name"
        v-manualevent="evtHandlerList"
        :evt-name="evtName"
      >
        <span
          class="raido-item"
          :class="{
            'v-icon-radio-checked': radioValue === item.value,
            'v-icon-radio-unchecked': radioValue !== item.value,
            disabled: item.disabled || disabled
          }"
          :value="item.value"
        ></span>
        <span class="radio-text">{{ item.title }}</span>
      </label>
    </template>
    <div class="error-bottom text-error" v-if="error">{{ msg || error }}</div>
  </div>
</template>

<script lang="ts">
import { mixins } from "vue-class-component";
import { Prop, Watch, Component } from "vue-property-decorator";
import EventMixin from "../add-event";

@Component
export default class VRadio extends mixins(EventMixin) {
  @Prop({ default: true }) readonly required!: boolean; //是否必填
  @Prop({ default: "" }) readonly css!: string; //样式
  @Prop({ default: true }) readonly show!: boolean; //显示
  @Prop({ default: false }) readonly ignore!: boolean; //是否忽略验证
  @Prop({ default: false }) readonly disabled!: boolean; //是否禁用
  @Prop({ default: "" }) readonly error!: string; //错误信息
  @Prop() readonly msg!: string; //自定义错误信息
  @Prop([String, Boolean]) readonly value!: string | boolean; //值
  @Prop({ default: "" }) readonly name!: string; //名称
  @Prop({
    default() {
      return [];
    }
  })
  readonly sortArray!: Array<ItemObject>; //选项数组
  @Prop({ default: () => function(){} }) readonly changeCallBack!: Function; //点击事件

  get radioValue() {
    this.radioValue = this.value;
    return this.value;
  }

  set radioValue(val) {
    this.$emit("change", val);
    this.changeCallBack(val);
  }

  created() {
    this.addEvent();
  }

  @Watch("value", { immediate: true})
  onValChanged(val: string | boolean) {
    this.radioValue = val;
  }

  mounted() {
    if (this.value === "") {
      this.radioValue = this.sortArray[0].value;
    }
  }

  changeRadio(value: string | boolean, item: ItemObject) {
    if (this.disabled || item.disabled) {
      return;
    }
    this.$emit("changeProp", "error", "");
    if (value === this.radioValue) {
      return;
    }
    this.radioValue = value;
  }
}
</script>
