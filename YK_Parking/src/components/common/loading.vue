<template>
  <div class="mask">
    <img class="loadingPhoto" :src="require('@/assets/images/loading.gif')" alt="">
  </div>
</template>
<script>
export default {
  name: "Loading"
};
</script>
<style scoped>
.mask {
  z-index: 200;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
}
.loadingPhoto {
  display: inline-block;
  height: 80px;
  width: 80px;
}
</style>
