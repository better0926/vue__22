<template>
  <div class="warp">
    <div class="validOrder">
      <div class="single" v-for="(item, index) in orderList" :key="index">
        <img class="photo" :src="require('../../assets/images/icon_order.png')" alt="">
        <div class="information">
          <div class="carNum">{{item.licensePlateNumber}}</div>
          <div class="placeName">
            <span>{{item.parkingGarageName}}</span>
            <span class="timeslot">{{item.startTime}} - {{item.endTime}}</span>
          </div>
        </div>
        <div @click="Renewals(item.licensePlateNumber, item.parkingGarageName, item.parkId)" class="renew btn-center">续费</div>
      </div>
    </div>
    <div class="invalidOrder">
      <div class="item" v-for="(item,index) in backOrder" :key="index">
        <img class="photoGray" :src="require('../../assets/images/iconLight.png')" alt="">
        <div class="information">
          <div class="carNumGray">{{item.licensePlateNumber}}</div>
          <div class="placeNameGray">
            <span>{{item.parkingGarageName}}</span>
            <span class="time">{{item.startTime}} - {{item.endTime}}</span>
          </div>
          <div class="text">该包月套餐已到期,请前往车场管理处重新开通。</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import XHR from "@/utils/request";
import API from "@/utils/api.js";
export default {
  mounted() {
    this.getMonthlyPlansOrderList();
    document.querySelector("title").innerText = "包月订单";
  },
  activated() {
    this.getMonthlyPlansOrderList();
    document.querySelector("title").innerText = "包月订单";
  },
  beforeDestroy() {
    window.tempCarNumber = null;
  },
  name: "MonthlyOrders",
  data() {
    return {
      orderList: [],
      backOrder: []
    };
  },
  methods: {
    Renewals(carName, carYard, carYardId) {
      // 固定车查询
      let dataList = {
        licensePlateNumber: carName,
        parkName: carYard,
        parkId: carYardId
      };
      window.sessionStorage.setItem("dataList", JSON.stringify(dataList));
      this.$router.push({ path: "/monthlyRecharge" });
    },
    async getMonthlyPlansOrderList() {
      // 获取包月订单列表
      const tempOrder = [];
      const overdueOrder = [];
      if (window.flag) {
        var result = await XHR.get(
          window.admin + API.getMonthlyPlansOrderList + "?userId=" + window.workid + "&licensePlateNumber=" + encodeURI(window.tempCarNumber)
        );
        window.flag = false;
      } else {
        var result = await XHR.get(window.admin + API.getMonthlyPlansOrderList + "?userId=" + window.workid);
      }
      const dataList = JSON.parse(result).data;
      dataList.forEach(el => {
        if (el.identifying === 1) {
          tempOrder.push({
            startTime: el.startTime.slice(0, 10).replace(/-/g, "."),
            endTime: el.endTime.slice(0, 10).replace(/-/g, "."),
            licensePlateNumber: el.licensePlateNumber.replace(/\s/gi, ""),
            parkingGarageName: el.parkingGarageName,
            parkId: el.parkId,
            id: el.id
          });
        }
        if (el.identifying === 2) {
          overdueOrder.push({
            startTime: el.startTime.slice(0, 10).replace(/-/g, "."),
            endTime: el.endTime.slice(0, 10).replace(/-/g, "."),
            licensePlateNumber: el.licensePlateNumber.replace(/\s/gi, ""),
            parkingGarageName: el.parkingGarageName,
            parkId: el.parkId,
            id: el.id
          });
        }
      });
      this.orderList = tempOrder;
      this.backOrder = overdueOrder;
    }
  }
};
</script>
<style scoped>
.wrap {
  width: 750px;
}
.single {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 150px;
  width: 690px;
  padding: 0 30px;
  border-bottom: 2px solid #f7f7f7;
}
.photo {
  display: inline-block;
  width: 41px;
  height: 41px;
}
.information {
  flex: 1;
  margin-left: 20px;
}
.carNum {
  font-size: 30px;
  color: #000;
  margin-bottom: 12px;
}
.placeName {
  font-size: 26px;
  color: #000;
}
.timeslot {
  display: inline-block;
  margin-left: 20px;
  color: #ababab;
}
.renew {
  width: 116px;
  height: 56px;
  border: 2px solid #5c9ef6;
  border-radius: 5px;
  font-size: 26px;
  color: #5c9ef6;
}
.item {
  display: flex;
  padding: 0 30px;
  border-bottom: 2px solid #f7f7f7;
}
.photoGray {
  display: inline-block;
  width: 41px;
  height: 41px;
  margin-top: 52px;
}
.carNumGray {
  margin-top: 34px;
  font-size: 30px;
  color: #d5d5d5;
  margin-bottom: 18px;
}
.placeNameGray {
  font-size: 26px;
  color: #d5d5d5;
}
.text {
  margin: 26px 0;
  font-size: 26px;
  color: #999;
}
.time {
  display: inline-block;
  margin-left: 20px;
}
</style>
