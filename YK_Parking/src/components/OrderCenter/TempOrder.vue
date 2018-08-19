<template>
  <div class="layout layoutBottom">
    <div class="cell" :key="index" v-for="(item,index) in items">
      <div class="center">
        <img class="cellImage" :src="require('@/assets/images/icon_order.png')" alt="">
      </div>
      <div class="columnContent">
        <div class="flexContent center textFont textColor">
          <span class="carNO">{{item.licensePlateNumber}}</span>
          <span class="flexContent priceText">{{item.money}}元</span>
          <span>{{item.duration}}小时</span>
        </div>
        <div class="flexContent center detailTextFont">
          <span class="flexContent textColor">{{item.parkingGarageName}}</span>
          <span class="detailTextColor">{{item.startTime}} - {{item.endTime}}</span>
        </div>
      </div>
    </div>
    <span class="footBtn textFont center" @click="addTempOreder">
      新增临停订单
    </span>
  </div>
</template>

<script>
import XHR from "@/utils/request";
import API from "@/utils/api.js";
import "@/assets/css/publicStyle.css";
export default {
  mounted() {
    this.getTemporaryOrderList();
    document.querySelector("title").innerText = "临停订单";
  },
  activated() {
    this.getTemporaryOrderList();
    document.querySelector("title").innerText = "临停订单";
  },
  name: "TempOrder",
  data() {
    return {
      items: []
    };
  },
  methods: {
    addTempOreder() {
      // 新增临停订单
      this.$router.push({ path: "/temporaryPay" });
    },
    async getTemporaryOrderList() {
      // 获取临停订单
      var tempArray = [];
      const result = await XHR.get(window.admin + API.getTemporaryOrderList + "?userId=" + window.workid);
      const dataList = JSON.parse(result).data;
      dataList.forEach(el => {
        tempArray.push({
          startTime: el.startTime.slice(0, 16).replace(/-/g, "."),
          endTime:
            String(el.endTime.slice(0, 10)) === String(el.startTime.slice(0, 10)) ? el.endTime.slice(11, 16) : el.endTime.slice(6, 16).replace(/-/g, "."),
          money: el.money / 100,
          duration: parseInt(el.duration / 60),
          licensePlateNumber: el.licensePlateNumber.replace(/\s/gi, ""),
          parkingGarageName: el.parkingGarageName,
          id: el.id
        });
      });
      this.items = tempArray;
    }
  }
};
</script>
<style scoped>
.layoutBottom {
  margin-bottom: 100px;
}
.cell {
  height: 150px;
  padding: 30px;
  border-bottom: 2px solid #f3f3f3;
}
.cellImage {
  width: 40px;
  height: 40px;
  margin-right: 30px;
}
.carNO {
  width: 180px;
}
.priceText {
  margin-left: 10px;
  color: #5a9df3;
}
</style>
