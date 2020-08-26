<template>
  <div class="form-group clearfix" v-if="title && dataKey.show !== false">
    <label :style="{ width: labelWidth + 'px' }" ref="label" class="form-title">
      <span ref="labelTxt" class="keep-all">{{ title }}</span>
      <span v-if="hasHelpInfo" class="icon-help" v-tooltip="helpText" parse-html="true" max-width="200px"></span>
    </label>
    <div class="form-content" :style="{ 'margin-left': labelWidth + 20 + 'px' }">
      <component
        :is="vname"
        v-if="vname"
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

  @Model("change") readonly value!: any; //组件的v-model

  public $refs!: {
    [name: string]: HTMLElement;
  };
  error = "";
  //组件标题宽度
  get labelWidth() {
    return this.$getLabelWidth();
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
    this.$nextTick(function() {
      //数据验证
      this.checkVal(val);
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
  checkVal(val: any) {
    let validType: string = this.dataKey.valid || "";
    let errMsg = "";
    let handleValid: Function | ValidFunc;
    let args;

    val = val || this.value;
    //禁用 忽略 或隐藏
    if (this.dataKey.disabled || this.dataKey.ignore || this.dataKey.show === false) {
      this.error = "";
      return true;
    }

    //不是必填 值为空 或者空数组（多个复选框）
    if (val === "" || (Array.isArray(val) && val.length === 0)) {
      if (this.dataKey.required === false) {
        this.error = "";
        return true;
      }
      this.error = _("此项必填");
      return false;
    }

    //未定义验证类型时
    if (!validType) {
      this.error = "";
      return true;
    }
    //当值在选项框内时，不做数据验证，用于select
    if (Array.isArray(this.dataKey.sortArray)) {
      let hasValue = this.dataKey.sortArray.some((item: any) => item.value === val);
      if (hasValue) {
        this.error = "";
        return true;
      }
    }

    //数据验证函数
    handleValid = this.$valid[validType] || {};
    //验证参数
    args = [];
    if (this.dataKey.min != undefined) {
      args.push(this.dataKey.min);
    }
    if (this.dataKey.max != undefined) {
      args.push(this.dataKey.max);
    }
    if (this.dataKey.msg != undefined) {
      args.push(this.dataKey.msg);
    }

    if (typeof handleValid == "function") {
      errMsg = handleValid(val, ...args);
    } else if (typeof handleValid.all === "function") {
      errMsg = handleValid.all(val, ...args);
    }
    //错误文字信息
    this.error = this.dataKey.msg || errMsg || "";
    return !errMsg;
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
