<template>
<transition name="pop-fade">
    <div class="pop-wrapper" v-show="visible" @click="popClose">
      <div
        class="pop-box"
        :class="[option.css, option.isAlert ? 'alert' : '']"
        :style="styleObject"
        @click.stop
      >
        <div class="pop-box-header" v-if="!option.isAlert">
          <div class="pop-box-title" v-if="option.title">
            <span>{{ option.title }}</span>
          </div>
        </div>
        <button
          type="button"
          @click="hide"
          :class="['pop-box-headerbtn', $isMobile ? 'v-mobile' : '']"
        >
          <i class="pop-box-close v-icon-close"></i>
        </button>
        <div class="pop-box-content">
          <slot></slot>
        </div>
        <div class="pop-box-toolbar">
          <v-button
            v-for="item in buttons"
            :key="item.text"
            :class="['pop-btn', item.theme || '']"
            :callback="proxyHandle(item.callback)"
            :title="item.text"
          ></v-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import PopupManager from "../util/manager";
import { Vue, Prop, Component, Watch, Model } from "vue-property-decorator";

let idSeed = 1;

@Component
export default class VPop extends Vue {
  @Prop({
    default: function() {
      return {
        css: "", //样式
        title: "",
        isAlert: false,
        buttons: [],
        closeOnClickModal: false,
        modalAppendToBody: true,
        closeDelay: 0,
        openDelay: 0
      };
    }
  })
  readonly option!: ObjectAny;

  @Model("hide", { default: false }) readonly visible!: boolean;

  _popupId = "";
  _closeTimer: any = null;
  _openTimer: any = null;
  opened = false;
  _opening = false;
  _closing = false;
  rendered = false;

  beforeMount() {
    this._popupId = "popup-" + idSeed++;
    PopupManager.register(this._popupId, this);
  }

  beforeDestroy() {
    PopupManager.deregister(this._popupId);
    PopupManager.closeModal(this._popupId);
  }

  get buttons() {
    return this.option.buttons || [];
  }
  get styleObject() {
    if (this.option.isAlert) {
      return {};
    }
    return {
      padding: `${this.option.title ? 0.6 : 0.3}rem 0 ${(this.buttons.length * 60 + 30) / 100}rem`
    };
  }

  open() {
    if (!this.rendered) {
      this.rendered = true;
    }

    const props = this.option;

    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
    clearTimeout(this._openTimer);

    const openDelay = Number(props.openDelay);
    if (openDelay > 0) {
      this._openTimer = setTimeout(() => {
        this._openTimer = null;
        this.doOpen(props);
      }, openDelay);
    } else {
      this.doOpen(props);
    }
  }

  doOpen(props: ObjectAny) {
    if (this.opened) return;

    this._opening = true;

    const dom = this.$el as HTMLElement;
    const zIndex = props.zIndex;

    if (zIndex) {
      (PopupManager as ObjectAny).zIndex = zIndex;
    }

    if (this._closing) {
      PopupManager.closeModal(this._popupId);
      this._closing = false;
    }

    PopupManager.openModal(
      this._popupId,
      PopupManager.nextZIndex(),
      this.option.modalAppendToBody ? undefined : dom
    );

    if (getComputedStyle(dom).position === "static") {
      dom.style.position = "absolute";
    }

    dom.style.zIndex = PopupManager.nextZIndex();
    this.opened = true;

    // this.onOpen && this.onOpen();

    this.doAfterOpen();
  }

  doAfterOpen() {
    this._opening = false;
  }

  close() {
    if (this._openTimer !== null) {
      clearTimeout(this._openTimer);
      this._openTimer = null;
    }
    clearTimeout(this._closeTimer);

    const closeDelay = Number(this.option.closeDelay);

    if (closeDelay > 0) {
      this._closeTimer = setTimeout(() => {
        this._closeTimer = null;
        this.doClose();
      }, closeDelay);
    } else {
      this.doClose();
    }
  }

  doClose() {
    this._closing = true;

    //this.onClose && this.onClose();

    this.opened = false;

    this.doAfterClose();
  }

  doAfterClose() {
    PopupManager.closeModal(this._popupId);
    this._closing = false;
  }

  proxyHandle(fun: Function) {
    return () => {
      let outData = true;
      if (fun) {
        outData = fun() !== false;
      }
      outData && this.hide();
    };
  }
  hide() {
    this.$emit("hide", false);
  }

  popClose() {
    if (this.option.closeOnClickModal) {
      this.hide();
    }
  }

  @Watch("visible")
  onVisibleChange(val: boolean) {
    if (val) {
      if (this._opening) return;
      if (!this.rendered) {
        this.rendered = true;
        this.$nextTick(() => {
          this.open();
        });
      } else {
        this.open();
      }
    } else {
      this.close();
    }
  }
}
</script>

