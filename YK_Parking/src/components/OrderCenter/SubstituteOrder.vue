<template>
  <div>
    <div class="layout layoutBottom">
      <div class="cell" :key="index" v-for="(item,index) in items">
        <div class="center">
          <img class="cellImage" :src="require('@/assets/images/icon_order.png')" alt="">
        </div>
        <div class="columnContent">
          <div class="flexContent center textFont textColor">
            <span class="carNO">{{item.licensePlateNumber}}</span>
            <span class="flexContent priceText">{{item.money}}元</span>
          </div>
          <div class="flexContent center detailTextFont">
            <span class="carName textColor">{{item.parkingGarageName}}</span>
            <span class="flexContent detailTextColor">{{item.creationTime}}</span>
          </div>
        </div>
        <div class="center">
          <div class="substituteBtn" @click='againSurrender(item.licensePlateNumber,item.phone)'>再次代缴</div>
        </div>
      </div>
      <span class="footBtn textFont center" @click="addSubstituteOrder">
        新增代缴订单
      </span>
    </div>
    <pop-up :data="dataRuselt" v-if="isShow" @oncancel="onCancel($event)" @onconfire="onConfire($event)"></pop-up>
    <tip-mes :msg="message" v-if="isDisplay"></tip-mes>
    <loading v-if="isLoading"></loading>
  </div>
</template>

<script>
import "@/assets/css/publicStyle.css";
import PopUp from "@/components/common/popUp";
import TipMes from "@/components/common/tipMes";
import Loading from "@/components/common/loading";
import XHR from "@/utils/request";
import API from "@/utils/api.js";
export default {
  mounted() {
    this.getReplaceOrderList();
    document.querySelector("title").innerText = "代缴订单";
  },
  activated() {
    this.getReplaceOrderList();
    document.querySelector("title").innerText = "代缴订单";
  },
  name: "SubstituteOrder",
  components: {
    PopUp,
    TipMes,
    Loading
  },
  data() {
    return {
      items: [],
      dataRuselt: [],
      isShow: false,
      isDisplay: false,
      isLoading: false,
      message: null
    };
  },
  methods: {
    async againSurrender(carName, phone) {
      // 再次代缴
      this.isLoading = true;
      const result = await XHR.get(window.admin + API.getParkingPaymentInfo + "?licensePlateNumber=" + encodeURI(this.removeSpace(carName)));
      if (JSON.parse(result).status === 200) {
        const dataResult = JSON.parse(result).data[0];
        this.dataRuselt = [
          { name: "手机号", result: phone || null },
          { name: "车牌", result: this.removeSpace(carName) },
          {
            name: "停车时长",
            result:
              dataResult.elapsedTime % 60 === 0
                ? dataResult.elapsedTime / 60 + "小时"
                : parseInt(dataResult.elapsedTime / 60) + "小时" + dataResult.elapsedTime % 60 + "分"
          },
          { name: "所在车场", result: dataResult.parkName },
          { name: "金额", result: dataResult.payable / 100 + "元" }
        ];
        this.isLoading = false;
        this.isShow = true;
      } else {
        this.isLoading = false;
        this.message = "抱歉，未找到该车辆停车信息";
        this.isDisplay = true;
        setTimeout(() => {
          this.isDisplay = false;
        }, 1.5e3);
      }
    },
    async replacePayParkingFee(dataValue, carName, userPhone) {
      const valueData = await XHR.post(window.admin + API.replacePayParkingFee, {
        duration: dataValue.elapsedTime,
        licensePlateNumber: carName,
        money: dataValue.payable,
        orderNo: dataValue.orderNo,
        parkingGarageName: dataValue.parkName,
        phone: userPhone,
        userId: window.workid
      });
      if (JSON.parse(valueData).status === 200) {
        this.isShow = false;
        this.getReplaceOrderList();
      } else {
        alert(JSON.parse(valueData).msg);
      }
    },
    async onConfire(payResult) {
      const dataArray = [];
      payResult.forEach(ev => {
        dataArray.push(ev.result);
      });
      console.log(dataArray);
      const result = await XHR.get(window.admin + API.getParkingPaymentInfo + "?licensePlateNumber=" + encodeURI(dataArray[1]));
      const valueResult = JSON.parse(result).data[0];
      if (JSON.parse(result).status === 200) {
        if (parseInt(valueResult.payable, 10) === 0) {
          this.message = "该车辆已缴费";
          this.isDisplay = true;
          setTimeout(() => {
            this.isDisplay = false;
          }, 1.5e3);
        } else {
          window.workgo.createPayOrder(valueResult.orderNo, window.deviceSn, "停车付款", "付款", valueResult.payable, "www.junl.cn", data => {
            if (data["success"]) {
              this.replacePayParkingFee(valueResult, dataArray[1], dataArray[0]);
            } else {
              alert(data["errMsg"]);
            }
          });
        }
      } else {
        alert(JSON.parse(result).msg);
      }
    },
    onCancel(isState) {
      // 取消
      this.isShow = isState;
    },
    removeSpace(str) {
      // 移除空格
      return str.replace(/\s/gi, "");
    },
    addSubstituteOrder() {
      // 新增代缴订单
      this.$router.push({ path: "/surrender" });
    },
    async getReplaceOrderList() {
      // 获取代缴订单
      var tempOrder = [];
      const result = await XHR.get(window.admin + API.getReplaceOrderList + "?userId=" + window.workid);
      const dataList = JSON.parse(result).data;
      dataList.forEach(el => {
        tempOrder.push({
          phone: el.phone,
          creationTime: el.creationTime.replace(/-/g, ".").slice(0, 16),
          money: el.money / 100,
          licensePlateNumber: el.licensePlateNumber.replace(/\s/gi, ""),
          parkingGarageName: el.parkingGarageName,
          id: el.id
        });
      });
      this.items = tempOrder;
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
.carName {
  margin-right: 20px;
}
.priceText {
  color: #5a9df3;
  margin-left: 10px;
}
.substituteBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 156px;
  height: 56px;
  border: 2px solid #5a9df3;
  border-radius: 4px;
  font-size: 28px;
  color: #5a9df3;
}
</style>
