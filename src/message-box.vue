<template>
<transition name="fade">
    <div class="dialog" v-show="show">
      <div class="dialog-container message">
        <div class="dialog-content">
          <div class="dialog-title"></div>
          <div class="content">
            <div class="status" :class="css"></div>
            <div class="tips">{{ content }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "v-message",
  data() {
    return {
      show: false,
      content: "",
      css: ""
    };
  }
};
</script>

<style lang="scss">
.message {
  width: 360px;
  .dialog-title {
    border: none;
  }
  .status {
    font-size: 48px;
  }
  .tips {
    padding: 40px;
    font-size: 18px;
  }
}
</style>

