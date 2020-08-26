<template>
  <div>
    <transition name="fade">
      <div class="mask" v-show="visible" @click="visible = false"></div>
    </transition>
    <transition name="slide">
      <div class="picker" v-show="visible">
        <div class="picker-title border-b">
          <span class="pt-button pt-cancel" @click="cancel" :style="{ color: colorCancel }">{{
            textCancel
          }}</span>
          <h4 :style="{ color: colorTitle }">{{ textTitle }}</h4>
          <span class="pt-button pt-submit" @click="confirm" :style="{ color: colorConfirm }">{{
            textConfirm
          }}</span>
        </div>
        <div class="picker-panel">
          <div class="picker-mask-top border-b"></div>
          <div class="picker-mask-bottom border-t"></div>
          <div class="picker-wheel-wrapper">
            <div class="picker-wheel" ref="wheelbox">
              <ul class="wheel-scroll">
                <li class="wheel-item" v-for="item in pickerData" :key="item.value">
                  {{ item.title }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">

import BScroll from "better-scroll";
import { copyDeepData } from "../libs";
import { Vue, Prop, Component, Watch, Model, Inject } from "vue-property-decorator";

// 级联
const TEXT_TITLE = "";
const TEXT_CONFIRM = _("Confirm");
const TEXT_CANCEL = _("Cancel");

const COLOR_TITLE = "#262626";
const COLOR_CONFIRM = "#fe6600";
const COLOR_CANCEL = "#595959";

const COMFIRM_EVENT = "confirm";
const V_MODEL_EVENT = "V_MODEL_EVENT";

@Component
export default class VPicker extends Vue {
  @Prop({ default: () => [] }) readonly data!: Array<ObjectAny>;
  @Prop([String, Number]) readonly value!: string | number;
  @Prop({ default: TEXT_TITLE }) readonly textTitle!: string;
  @Prop({ default: TEXT_CONFIRM }) readonly textConfirm!: string;
  @Prop({ default: TEXT_CANCEL }) readonly textCancel!: string;
  @Prop({ default: COLOR_TITLE }) readonly colorTitle!: string;
  @Prop({ default: COLOR_CONFIRM }) readonly colorConfirm!: string;
  @Prop({ default: COLOR_CANCEL }) readonly colorCancel!: string;
  @Prop({ default: "" }) readonly manualText!: string;
  @Model(V_MODEL_EVENT, { default: false }) readonly visible!: boolean;
  @Inject() manualBack!: Function;
  wheel: any = null;

  @Watch("data")
  onDataChanged() {
    this._setPickerData();
  }
  @Watch("visible")
  onVisibleChanged(val: boolean) {
    if (val) {
      this.show();
    } else {
      this.hide();
    }
  }

  get pickerData() {
    let data = copyDeepData(this.data);
    if (data.length > 0 && typeof data[0] !== "object") {
      data = data.map((item: string) => {
        return { title: item, value: item };
      });
    }

    // 添加自定义项
    if (this.manualText) {
      data.push({
        title: this.manualText,
        value: this.manualText
      });
    }
    return [...data];
  }

  get valueToIndex() {
    let data: ObjectAny = {};

    this.pickerData.forEach((item: ItemObject, i: number) => {
      data[item.value] = i;
    });

    return data;
  }
  get anchor() {
    let index = this.valueToIndex[this.value];
    if (index !== undefined) {
      return index;
    }
    if (this.manualText) {
      return this.pickerData.length - 1;
    }
    return 0;
  }

  _createWheel(wheelbox: any) {
    if (!this.wheel) {
      this.wheel = new BScroll(wheelbox, {
        wheel: {
          selectedIndex: 0,
          rotate: 20
        }
      });
    } else {
      this.wheel.refresh();
    }
    return this.wheel;
  }

  _wheelToAnchor(i?: any) {
    i = i === undefined ? this.anchor : i;
    this.wheel.wheelTo(i);
  }

  _getCurrentValue() {
    let i = this.wheel.getSelectedIndex(),
      val = this.pickerData[i].value;
    return val;
  }

  _setPickerData() {
    if (this.visible) {
      this.$nextTick(() => {
        const wheelbox = this.$refs.wheelbox;
        this._createWheel(wheelbox);
        this._wheelToAnchor();
      });
    }
  }
  show() {
    if (!this.wheel) {
      this.$nextTick(() => {
        const wheelbox = this.$refs.wheelbox;
        this._createWheel(wheelbox).enable();
        this._wheelToAnchor();
      });
    } else {
      this.wheel.enable();
      this._wheelToAnchor();
    }
  }

  hide() {
    this.wheel && this.wheel.disable();
    this.$emit(V_MODEL_EVENT, false);
  }

  confirm() {
    let val = this._getCurrentValue();
    this.hide();
    if (val === this.manualText) {
      this.manualBack && this.manualBack();
    } else {
      this.$emit(COMFIRM_EVENT, val);
    }
  }

  cancel() {
    this.hide();
  }
}
</script>
