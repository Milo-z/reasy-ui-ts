<template>
  <section class="form-section" :class="css">
    <slot></slot>
    <div class="form-footer">
      <v-button v-if="hasSubmit" :title="submitText" :callback="submitForm"></v-button>
      <v-button v-if="hasCancel" :title="cancelText" :callback="cancelForm"></v-button>
    </div>
  </section>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class VForm extends Vue {
  @Prop({ default: "" }) readonly css!: string;
  @Prop({ default: "保存" }) readonly submitText!: string;
  @Prop({ default: "取消" }) readonly cancelText!: string;
  @Prop({ default: false }) readonly hasCancel!: boolean;
  @Prop({ default: false }) readonly hasSubmit!: boolean;
  @Prop({ default: () => function() {} }) beforeSubmit!: Function; //返回字符串或者false时为错误，其他返回都是正确
  @Prop() submit!: Function;
  @Prop() cancel!: Function;

  fields: Array<any> = [];
  errorField = {};
  created() {
    this.$on("form.addField", (field: any) => {
      this.addField(field);
    });
    this.$on("form.removeField", (field: any) => {
      this.removeField(field);
    });
  }

  addField(field:Vue) {
    this.fields.push(field);
  }

  removeField(field:any) {
    this.fields = this.fields.filter(item => item !== field) || [];
  }

  //表单数据验证
  checkValidate() {
    let error = true;
    this.fields.forEach(field => {
      let checkSuccess = field.checkVal(field.value);
      if (!checkSuccess) {
        error = false;
      }
    });
    return error;
  }

  //获取表单提交数据
  getSubmitData() {
    let subData: any = {};
    this.fields.forEach(field => {
      if(!field.ignore && field.prop) { //未忽略时传值
        subData[field.prop] = field.itemVal;
      }
    });
    return subData;
  }

  submitForm() {
    //有错
    if (!this.checkValidate()) {
      this.$message(_("请检查错误信息"));
      return false;
    }
    //表单自定义事件
    let subData = this.getSubmitData();
    let result = this.beforeSubmit(subData);
    if(typeof result === "string") {
        this.$message(result);
        return false;
    } else if(result === false){
      return false;
    }

    if(typeof this.submit == "function") {
      this.submit(subData);
    } else {
      this.$emit("submit", subData);
    }
  }

  cancelForm() {
    if(typeof this.cancel == "function") {
      this.cancel();
    } else {
      this.$emit("cancel");
    }
  }
}
</script>
