<template>
<div class="form-el-content form-el-checkbox" v-show="show" :class="{ 'error-group': error, [css]: css }">
    <template v-if="hasSelectAll">
      <label
        class="form-checkbox"
        :class="{ disabled: disabled }"
        @click.stop="changeSelectedAll()"
        :name="name"
        v-manualevent="evtHandlerList"
        :evt-name="evtName"
      >
        <span
          class="checkbox-item"
          :class="selectedAll ? 'v-icon-checkbox-checked' : 'v-icon-checkbox-unchecked'"
        ></span>
        <span class="checkbox-text">{{ selectAllText }}</span>
      </label>
    </template>
    <template v-for="(item, index) in sortArray">
      <input
        type="checkbox"
        ref="checkbox"
        :value="item.value"
        v-show="false"
        :checked="getChecked(item.value, index)"
        :key="item.key"
      />
      <label
        class="form-checkbox"
        :class="{ disabled: item.disabled || disabled }"
        @click.stop="changeCheckbox(index, item)"
        v-manualevent="evtHandlerList"
        :evt-name="evtName"
        :data-index="index"
        :key="item.key"
        :name="name"
      >
        <span
          class="checkbox-item"
          :class="getChecked(item.value, index) ? 'v-icon-checkbox-checked' : 'v-icon-checkbox-unchecked'"
        ></span>
        <span class="checkbox-text">{{ item.title }}</span>
      </label>
    </template>
    <div class="error-bottom text-error" v-if="error">{{ msg || error }}</div>
  </div>
</template>

<script lang="ts">
import { mixins } from "vue-class-component";
import { Prop, Ref, Component, Watch } from "vue-property-decorator";
import { isDefined } from "../libs";
import EventMixin from "../add-event";

@Component
export default class VCheckbox extends mixins(EventMixin) {
  @Prop({ default: false }) readonly required!: boolean; //是否必填
  @Prop({ default: "" }) readonly css!: string; //样式
  @Prop({ default: true }) readonly show!: boolean; //显示
  @Prop({ default: false }) readonly ignore!: boolean; //是否忽略验证
  @Prop({ default: false }) readonly disabled!: boolean; //是否禁用
  @Prop({ default: false }) readonly hasSelectAll!: boolean; //是否有全选
  @Prop({ default: "" }) readonly selectAllText!: string; //全选文字
  @Prop({ default: "" }) readonly error!: string; //错误信息
  @Prop() readonly msg!: string; //自定义错误信息
  @Prop([String, Array, Boolean]) readonly value!: any; //值
  @Prop({ default: "" }) readonly name!: string; //名称
  @Prop({
    default() {
      return [];
    }
  })
  readonly sortArray!: Array<ItemObject>; //选项数组
  @Prop({
    default() {
      return {
        on: true,
        off: false
      };
    }
  })
  readonly values!: ObjectAny; //单个复选框时选中和不选中值
  @Prop({ default: () => function() {} }) changeCallBack!: Function; //值修改后的回调事件
  @Ref() readonly checkbox!: Array<HTMLInputElement>;
  //mixins: [addEvent],

  selectedAll = false;
  groups = false;
  checkedVal: any = "";

  get checkboxValue() {
    let disableLen = this.disabledList.length;
    //全选
    if (this.groups && this.value.length === this.sortArray.length - disableLen) {
      this.selectedAll = true;
    } else {
      this.selectedAll = false;
    }
    return this.value;
  }

  set checkboxValue(val) {
    this.$emit("change", val);
    this.changeCallBack(val);
  }

  get disabledList() {
    return this.sortArray.filter((item) => item.disabled);
  }

  created() {
    if (this.sortArray.length <= 1) {
      this.groups = false;
    } else {
      this.groups = true;
      if (!Array.isArray(this.value)) {
        this.$emit("change", []);
      }
    }

    this.checkedVal = isDefined(this.sortArray[0].value) ? this.sortArray[0].value : this.values.on;
  }

  //点击复选框事件
  changeCheckbox(index: number, item: ItemObject) {
    let checkboxVal;

    if (this.disabled === true || item.disabled) {
      return;
    }

    if (!this.groups) {
      if (this.value === this.checkedVal) {
        checkboxVal = this.values.off;
      } else {
        checkboxVal = this.checkedVal;
      }
      this.checkboxValue = checkboxVal;
    } else {
      if (typeof this.value === "string") {
        return;
      }
      checkboxVal = this.value;
      let checkboxEl = this.checkbox[index];
      //组
      if (checkboxEl.checked) {
        //选中的时候过滤此值
        checkboxVal = this.value.filter((item2: any) => item2 !== item.value);
      } else {
        checkboxVal.push(item.value);
      }
      this.checkboxValue = checkboxVal;
      checkboxEl.checked = !checkboxEl.checked;
    }
  }

  changeSelectedAll() {
    if (this.disabled === true) {
      return;
    }
    this.selectedAll = !this.selectedAll;
    let valArr: Array<any> = [];
    if (this.selectedAll) {
      this.sortArray.forEach((item) => {
        if (!item.disabled) {
          valArr.push(item.value);
        }
      });
      this.checkboxValue = valArr;
    } else {
      this.checkboxValue = [];
    }
  }

  getChecked(value: string | boolean): boolean {
    if (!this.groups) {
      if (this.checkboxValue === this.checkedVal) {
        return true;
      }
      return false;
    }

    if (!Array.isArray(this.checkboxValue)) {
      return false;
    }
    return this.checkboxValue.indexOf(value) !== -1;
  }

  @Watch("required", { immediate: true })
  onRequiredChanged(val: boolean) {
    this.$emit("changeProp", "required", val);
  }
}
</script>

