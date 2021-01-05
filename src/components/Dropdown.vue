<template>
  <transition name="fade">
    <ul
      class="select-dropdown -r-select-dropdown"
      :class="css"
      :style="{
        top: dropdownTop + 'px',
        left: dropdownLeft + 'px',
        minWidth: minWidth + 'px',
        width: 'auto !important'
      }"
      ref="dropdown"
      v-if="show && !disabled"
    >
      <template v-for="item in sortArray">
        <li
          :value="item.value"
          :key="item.value"
          class="select-li"
          :class="{ active: value == item.value, disabled: item.disabled }"
          @click.stop="changeSelect(item.value, item.title, item.disabled)"
        >
          {{ item.title }}
          <span v-if="item.css" :class="item.css"></span>
        </li>
      </template>
      <li v-show="hasManual" class="select-li" @click.stop="hanlderManual()">
        {{ manualText }}
      </li>
    </ul>
  </transition>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { debounce } from "./libs";
@Component
export default class Dropdown extends Vue {
  relativeVm: ObjectAny = {}; //关联的下拉框组件
  css = "";
  dropdownLeft = 0;
  dropdownTop = 0;
  minWidth = 0;

  get hasManual() {
    return this.relativeVm.hasManual;
  }
  get show() {
    if (this.relativeVm.dropdownShow) {
      this.bindEvt();
      this.$nextTick(function () {
        this.setPosition();
      });
    } else {
      this.unbindEvt();
    }
    return this.relativeVm.dropdownShow;
  }

  get value() {
    return this.relativeVm.value;
  }

  get manualText() {
    return this.relativeVm.manualText;
  }

  get disabled() {
    return this.relativeVm.disabled;
  }

  get sortArray() {
    return this.relativeVm.sortArray;
  }

  hanlderManual() {
    this.relativeVm.hanlderManual();
  }

  changeSelect(...args: any) {
    this.relativeVm.changeSelect(...args);
  }
  bindEvt() {
    window.addEventListener("resize", this.setPosition);
    window.addEventListener("scroll", this.setPosition, true);
  }

  unbindEvt() {
    window.removeEventListener("resize", this.setPosition);
    window.removeEventListener("scroll", this.setPosition, true);
  }

  setPosition() {
    //不显示
    if (!this.relativeVm.dropdownShow) {
      return;
    }
    let inputRect = this.relativeVm.inputtext.getBoundingClientRect(),
      bodyHeight = document.body.clientHeight;
    //当可输入时
    if (inputRect.left === inputRect.right) {
      inputRect = this.relativeVm.input.getBoundingClientRect();
    }

    this.$nextTick(function () {
      //滚动条位置
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop,
        scrollLeft =
          (window.pageXOffset || document.documentElement.scrollLeft) +
          document.body.scrollLeft;
      let dropdownHeight = (this.$refs.dropdown as HTMLElement).clientHeight;
      this.dropdownTop = inputRect.bottom + scrollTop;
      this.dropdownLeft = inputRect.left + scrollLeft;
      this.minWidth = inputRect.right - inputRect.left;

      if (this.dropdownTop + dropdownHeight > bodyHeight) {
        //超出body高度时
        this.dropdownTop = inputRect.top - dropdownHeight - 12;
      }

      this.dropdownTop += document.body.scrollTop;
    });
  }
}
</script>

