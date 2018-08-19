<template>
  <div class="mask">
    <div @click="closeButton(false)" class="blank"></div>
    <div class="maskWrap">
      <div class="prompt">
        <div class="promptText">选择省简称</div>
        <div @click="closeButton(false)" class="close">关闭</div>
      </div>
      <div class="carColorList">
        <div @click="selectProvince(item.province)" class="carColor" v-for="(item,index) in provinceList" :key="index">{{item.province}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "PlaceName",
  data() {
    return {
      provinceList: [
        { province: "京" },
        { province: "沪" },
        { province: "粤" },
        { province: "津" },
        { province: "冀" },
        { province: "豫" },
        { province: "云" },
        { province: "辽" },
        { province: "黑" },
        { province: "湘" },
        { province: "皖" },
        { province: "鲁" },
        { province: "新" },
        { province: "苏" },
        { province: "浙" },
        { province: "赣" },
        { province: "鄂" },
        { province: "桂" },
        { province: "甘" },
        { province: "晋" },
        { province: "蒙" },
        { province: "陕" },
        { province: "吉" },
        { province: "闽" },
        { province: "贵" },
        { province: "渝" },
        { province: "川" },
        { province: "青" },
        { province: "藏" },
        { province: "琼" },
        { province: "宁" },
        { province: "港" },
        { province: "澳" },
        { province: "台" }
      ]
      // selectIndex: 0
    };
  },
  methods: {
    selectProvince(mes) {
      // this.selectIndex = index;
      this.$emit("onselect", mes);
    },
    closeButton(state) {
      this.$emit("onclose", state);
    }
  }
};
</script>
<style scoped>
.mask,
.blank {
  z-index: 100;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
}
.mask {
  z-index: 99;
  background: rgba(0, 0, 0, 0.3);
}
.blank {
  z-index: 108;
}
.maskWrap {
  z-index: 110;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #fff;
}

.prompt {
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  margin: 22px 0;
  font-size: 26px;
}
.promptText {
  color: #bbbbbb;
}
.close {
  color: #96c1f9;
}
.carColorList {
  padding: 0 16px 50px;
}
.carColor {
  display: inline-block;
  width: 55px;
  margin: 10px 10px;
  padding: 10px 0px;
  border: 2px solid #e8e8e8;
  border-radius: 4px;
  text-align: center;
  font-size: 30px;
  color: #000;
}
</style>
