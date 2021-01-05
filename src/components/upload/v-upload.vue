<template>
<div class="uploader-container">
    <form
      ref="iform"
      class="iform"
      method="POST"
      :action="uploadUrl"
      :target="targetFile"
      enctype="multipart/form-data"
    >
      <div class="clearfix">
        <div class="file-btn-group">
          <a class="btn icon-file-upload" :class="css">
            <span class="file-title">{{ _("Select a file") }}</span>
            <input ref="file" :name="name" type="file" class="file" @change="selectFile" />
          </a>
        </div>
        <div v-if="fileStr && hasTips" class="file-tips">
          <span class="v-icon-file"></span>
          <span>{{ fileStr }}</span>
        </div>
        <div v-if="fileStr == '' && hasTips" class="file-tips">
          <span>{{_('No file selected')}}</span>
        </div>
      </div>
      <v-button v-if="hasUpBtn" :title="btnVal" css="form-primary-btn" :callback="submit"></v-button>
      <slot></slot>
    </form>
    <iframe class="upload" ref="upload" :name="targetFile" width="1px" height="1px"></iframe>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Ref, Component } from "vue-property-decorator";

@Component
export default class VUpload extends Vue {
  @Prop() uploadUrl!: string; //上传URL
  @Prop({ default: _("Upload") }) btnVal!: string; //上传文件按钮显示文字
  @Prop({ default: false }) hasTips!: boolean; //是否显示文件名称信息
  @Prop({ default: false }) hasUpBtn!: boolean; //是否显示上传文件按钮
  @Prop({ default: "" }) css!: string;
  @Prop({ default: "file" }) name!: string;
  @Prop({ default: () => function() {} }) afterCallBack!: Function; //文件上传后事件
  @Prop({ default: () => function() {} }) changeCallBack!: Function; //选择文件后事件
  @Prop({ default: () => function() {} }) clickCallBack!: Function; //点击按钮后事件
  @Ref() upload!: HTMLIFrameElement;
  @Ref() iform!: HTMLFormElement;

  domain = "";
  fileStr = "";
  //file: {},
  targetFile = "";

  created() {
    this.targetFile = "upload?" + Math.random();
  }
  parseIframeResponse() {
    if (!this.upload.contentWindow) {
      return;
    }
    const elm = this.upload.contentWindow.document.body;
    const response = elm.innerText || elm.textContent;
    if (!response) {
      return false;
    }
    try {
      const jsonStr = JSON.parse(response);
      this.afterCallBack(jsonStr);
    } catch (err) {}
  }
  selectFile(e: MouseEvent) {
    let elm = e.target as HTMLInputElement;
    let fileArr = elm.value.split("\\");
    this.fileStr = fileArr.slice(-1)[0];

    this.changeCallBack(elm.value);
  }
  submit() {
    if (this.fileStr === "") {
      (this as any).$message(_("Please select a file"));
      return;
    }
    this.clickCallBack();
    this.iform.submit();
  }

  mounted() {
    this.upload.addEventListener("load", () => {
      this.parseIframeResponse();
    });
  }
}
</script>

