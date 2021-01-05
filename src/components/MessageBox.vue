<template>
<transition name="pop-fade">
    <div class="dialog" v-if="isShowMessageBox">
      <div class="overlay" @click="isShowMessageBox = false;"></div>
      <div class="dialog-container message-content">
        <div class="dialog-content">
          <div class="dialog-title">
            <span>{{title}}</span>
            <span class="dialog-close v-icon-close" @click="isShowMessageBox = false;"></span>
          </div>
          <div class="content">
            <div class="content-tips" v-if="parseHtml" v-html="content"></div>
            <div class="content-tips" v-else>{{content}}</div>
          </div>
          <div class="btn-group">
            <button v-show="hasCancel" class="btn" @click="cancel()">{{cancelText}}</button> &nbsp;&nbsp;
            <button class="btn btn-primary" @click="confirm()">{{okText}}</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class MessageBox extends Vue {
    title = "";
    isShowMessageBox = false;
    parseHtml = false;
    okText = _("OK");
    cancelText = _("Cancel");
    content = "";
    resolve: Function = function() {};
    reject: Function = function() {};
    hasCancel = true;
    promise: any; // 保存promise对象

    confirm() {
      this.isShowMessageBox = false;
      this.resolve(true);
    }
    cancel() {
      this.isShowMessageBox = false;
      if (this.hasCancel) {
        this.reject();
      }
    }
    showMsgBox() {
      this.isShowMessageBox = true;
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
      // 返回promise对象
      return this.promise;
    }
}
</script>

