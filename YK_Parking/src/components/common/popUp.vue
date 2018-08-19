<template>
  <div class="mask">
    <div @click="cancel(isCancel)" class="blank"></div>
    <div class="popUp">
      <div class="dataList">
        <div class="data">
          <div class="dataName">手机号</div>
          <input class="inputBox" type="text" placeholder="可输入手机号" v-model="data[0].result">
        </div>
        <div class="data" v-for="(item, index) in data.slice(1)" :key="index">
          <div class="dataName">{{item.name}}</div>
          <div class="dataResult">{{item.result}}</div>
        </div>
      </div>
      <div class="tip">请于缴费成功后的15分钟内离场哦</div>
      <div class="selectButton">
        <div @click="cancel(isCancel)" class="abolish">取消</div>
        <div @click="confirmPay(data)" class="sure">确认支付</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "PopUp",
  props: ["data"],
  data() {
    return {
      isCancel: false
      // inputValue: this.data[0].result
    };
  },
  methods: {
    cancel(state) {
      this.$emit("oncancel", state);
    },
    confirmPay(payData) {
      this.$emit("onconfire", payData);
    }
  }
};
</script>
<style scoped>
.mask,
.blank {
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
  z-index: 100;
}
.popUp {
  position: relative;
  z-index: 101;
  width: 73%;
  height: 509px;
  margin-top: 332px;
  border-radius: 5px;
  font-size: 34px;
  background: #fff;
  overflow: hidden;
}
.dataList {
  padding: 24px 30px 16px;
}
.data {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  font-size: 30px;
}
.dataName {
  color: #b3b3b3;
}
.inputBox {
  width: 198px;
  color: #000;
  outline: none;
  border: none;
  background: transparent;
  -webkit-appearance: none;
}
.dataResult {
  color: #000;
}
.tip {
  width: 100%;
  /* margin-bottom: 1px; */
  text-align: center;
  line-height: 40px;
  font-size: 24px;
  color: #7997c0;
  background: #cce1fc;
}
.selectButton {
  display: flex;
  justify-content: space-around;
  width: 100%;
  font-size: 30px;
  color: #fff;
}
.abolish,
.sure {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  width: 50%;
  border-top: 2px solid #f7f7f7;
}
.abolish {
  color: #999999;
  background: #fff;
}
.sure {
  color: #fff;
  background: #569bf6;
}
.inputBox::-webkit-input-placeholder {
  color: #777777;
}
</style>
