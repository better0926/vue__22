<template>
  <div class="tipBox">
    <div class="tip">{{msg}}</div>
  </div>
</template>
<script>
export default {
  name: "TipMes",
  props: ["msg"],
  data() {
    return {};
  }
};
</script>
<style scoped>
.tipBox {
  z-index: 100;
  position: fixed;
  left: 0;
  bottom: 215px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 106px;
  margin: 0 auto;
}
.tip {
  width: 73%;
  border-radius: 54px;
  text-align: center;
  line-height: 106px;
  font-size: 34px;
  color: #fff;
  background: #4c4c4c;
}
</style>
