<template>
<div class="form-group clearfix" v-if="title && dataKey.show !== false">
    <label :style="{ width: labelWidth + 'px' }" ref="label" class="form-title">
      <span ref="labelTxt" class="keep-all">{{ title }}<span v-if="hasColon">{{colonTips}}</span></span>
      <span v-if="hasHelpInfo" class="icon-help" v-tooltip="helpText" parse-html="true" max-width="200px"></span>
    </label>
    <div class="form-content" :style="{ 'margin-left': labelWidth + 20 + 'px' }">
      <component
        :is="vname"
        ref="item"
        v-if="vname"
        v-model="value"
        @check="checkVal"
        @change="changeValue"
        @changeProp="changeProp"
        v-bind="dataKey"
        :class="{ 'is-error': error }"
      >
      </component>
      <span class="vertical-top">
        <slot></slot>
      </span>

      <!-- <div class="form-error" v-if="error">{{ error }}</div> -->
    </div>
  </div>
  <div class="form-no-title" v-else-if="!title && dataKey.show !== false">
    <component
      :is="vname"
      v-model="value"
      @check="checkVal"
      @change="changeValue"
      @changeProp="changeProp"
      v-bind="dataKey"
      :class="{ 'is-error': error }"
    >
    </component>
    <slot></slot>
    <!-- <div class="form-error" v-if="error">{{ error }}</div> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import {checkData} from "../libs";

@Component
export default class VFormItem extends Vue {
  @Prop({
    default() {
      return {};
    }
  })
  readonly dataKey!: DK; //组件关键字段定义对象
  @Prop({ default: "" }) readonly vname!: string; //组件名称
  @Prop({ default: "" }) readonly title!: string; //标题
  @Prop({ default: "" }) readonly field!: string; //字段名称，为空时取dataKey.name
  @Prop({ default: false }) readonly hasHelpInfo!: boolean; // 输入框是否需要帮助信息
  @Prop({ default: "" }) readonly helpText!: string; // 帮助信息
  @Prop({ default: false }) readonly disabled!: boolean; 
  @Model("change") readonly value!: any; //组件的v-model

  public $refs!: {
    [name: string]: HTMLElement;
  };
  error = "";
  //组件标题宽度
  get labelWidth() {
    return this.$getLabelWidth();
  }

  get hasColon() {
    return this.title && this.title.replace(/[ ]/g, "") !== "";
  }

  get colonTips() {
    //从全局vue对象中获取
    return this.$colonTips || "";
  }
  //组件值
  get itemVal() {
    return this.value;
  }

  get ignore() {
    return this.dataKey.ignore === true;
  }

  //字段名称
  get prop() {
    return this.field || this.dataKey.name;
  }

  created() {
    //注册组件到form表单
    this.$dispatch("VForm", "form.addField", this);
  }

  mounted() {
    //标题文字长度改变事件
    this.onTitleChanged();
  }

  //值修改事件
  changeValue(val: any) {
    this.$emit("change", val);
    this.$nextTick(() => {
      //数据验证
      this.checkVal();
    });
  }

  //dataKey属性变化事件
  changeProp(key: string, val: any) {
    //未定义时
    if (this.dataKey[key] === undefined) {
      this.$set(this.dataKey, key, val);
    } else {
      this.dataKey[key] = val;
    }
    if (key === "error") {
      this.error = val;
    }
  }

  //数据验证
  checkVal(val?: any) {
    let validType: string = this.dataKey.valid || "";
    let result = true;
    let handleValid: Function | ValidFunc;
    let args;

    val = val || this.value;
    result = checkData.call(this, this.dataKey, val);
    //错误文字信息
    this.error = this.dataKey.error || "";
    return result;
  }

  @Watch("title")
  onTitleChanged() {
    if (this.$refs.labelTxt) {
      let width = this.$refs.labelTxt.offsetWidth;
      if(this.hasHelpInfo) {
        width += 30;
      }
      //将宽度广播到page组件
      this.$dispatch("VPage", "label-width", width);
    }
  }
  @Watch("error", { immediate: true })
  onErrorChanged(val: string) {
    this.$set(this.dataKey, "error", val);
  }

  //组件注销时，删除表单的注册
  destroyed() {
    this.$dispatch("VForm", "form.removeField", this);
  }
}
</script>

<style lang="scss" scoped>
.icon-help {
  margin-left: 4px;
}
</style>

