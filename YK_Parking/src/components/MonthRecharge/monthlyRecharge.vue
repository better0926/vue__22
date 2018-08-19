<template>
  <div class="wrap">
    <div class="content">
      <div class="optionList">
        <div class="option">
          <div class="optionName">车牌</div>
          <div class="optionData">{{carNum}}</div>
        </div>
        <div class="option">
          <div class="optionName">所在车场</div>
          <div class="optionData">{{carYard}}</div>
        </div>
        <div class="option">
          <div class="optionName">到期时间</div>
          <div class="optionData">{{expiryTime}}</div>
        </div>
      </div>
      <div class="promptText">续费时长</div>
      <div class="carYardList">
        <div class="carName" v-for="(item,index) in renewalLength" :key='index'>
          <div @click="select(index)" :class="selectIndex === index?'selectYard':'carYard'">
            {{item.ruleFee/100}}元/{{item.ruleAmount==1?"":item.ruleAmount}}月
          </div>
        </div>
      </div>
    </div>
    <div class="bottomBox">
      <div class="cancel" @click="back">取消</div>
      <div @click="confirmPay" class="confirm">确认支付</div>
    </div>
    <loading v-if="isLoading"></loading>
  </div>
</template>
<script>
import XHR from "@/utils/request";
import API from "@/utils/api.js";
import Loading from "@/components/common/loading";
export default {
  mounted() {
    this.getCarCardInfo();
    document.querySelector("title").innerText = "包月充值";
  },
  activated() {
    this.getCarCardInfo();
    document.querySelector("title").innerText = "包月充值";
  },
  name: "MonthlyRecharge",
  components: {
    Loading
  },
  data() {
    return {
      carNum: null,
      carYard: null,
      expiryTime: null,
      renewalLength: [],
      selectIndex: 0,
      parkId: null,
      rechargeRule: null,
      cardId: null,
      ruleId: null,
      time: null,
      isLoading: false
    };
  },
  methods: {
    async getCarCardInfo() {
      // 固定车查询
      this.isLoading = true;
      let store = JSON.parse(window.sessionStorage.getItem("dataList"));
      const result = await XHR.get(
        window.admin + API.getCarCardInfo + "?licensePlateNumber=" + encodeURI(store.licensePlateNumber) + "&parkId=" + store.parkId
      );
      const dataResult = JSON.parse(result).data;
      if (JSON.parse(result).ok) {
        this.carNum = store.licensePlateNumber;
        this.carYard = store.parkName;
        this.expiryTime = dataResult.chargeFrom.slice(0, 10);
        this.renewalLength = dataResult.rechargeRule;
        this.time = dataResult.chargeFrom;
        this.parkId = store.parkId;
        this.rechargeRule = dataResult.rechargeRule;
        this.cardId = dataResult.cardId;
        this.ruleId = dataResult.ruleId;
        this.isLoading = false;
      } else {
        this.message = "抱歉，未找到该车辆包月信息";
        this.isLoading = false;
        this.isDisplay = true;
        setTimeout(() => {
          this.isDisplay = false;
        }, 1.5e3);
      }
    },
    select(index) {
      this.selectIndex = index;
    },
    back() {
      // 返回上一页
      window.history.go(-1);
    },
    async payCarCardFee(dataResult) {
      const data = await XHR.post(window.admin + API.payCarCardFee, {
        duration: parseInt(this.renewalLength[this.selectIndex].ruleAmount),
        licensePlateNumber: this.carNum,
        money: dataResult.payable,
        orderNo: dataResult.orderNo,
        parkId: this.parkId,
        parkingGarageName: this.carYard,
        startTime: this.time,
        userId: window.workid
      });
      const dataState = JSON.parse(data);
      if (parseInt(dataState.status) === 200) {
        this.$router.push({ path: "/monthlyOrders" });
      } else {
        alert(dataState.msg);
      }
    },
    async confirmPay() {
      const result = await XHR.post(window.admin + API.getCarCardFee, {
        cardId: parseInt(this.cardId),
        chargeCount: parseInt(this.renewalLength[this.selectIndex].ruleAmount),
        chargeFrom: this.time,
        parkId: parseInt(this.parkId),
        ruleId: parseInt(this.ruleId)
      });
      const valueResult = JSON.parse(result).data[0];
      if (JSON.parse(result).status === 200) {
        window.workgo.createPayOrder(valueResult.orderNo, window.deviceSn, "停车付款", "付款", valueResult.payable, "www.junl.cn", data => {
          if (data["success"]) {
            this.payCarCardFee(valueResult);
          } else {
            alert(data["errMsg"]);
          }
        });
      } else {
        alert(valueResult.msg);
      }
    }
  }
};
</script>
<style scoped>
.wrap {
  width: 750px;
  margin-top: 32px;
}
.optionList {
  padding: 0 30px;
}
.option {
  margin-bottom: 56px;
}
.optionName {
  font-size: 26px;
  color: #b8b8b8;
  margin-bottom: 20px;
}
.optionData {
  font-size: 30px;
  color: #000;
}
.carYardList {
  padding: 0 16px;
}
.promptText {
  text-indent: 30px;
  font-size: 26px;
  color: #bbbbbb;
  margin-bottom: 16px;
}
.carYard {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 86px;
  width: 328px;
  margin: 15px 13px;
  border: 2px solid #e8e8e8;
  border-radius: 4px;
  text-align: center;
  font-size: 30px;
  color: #000;
}
.selectYard {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 86px;
  width: 328px;
  margin: 15px 13px;
  text-align: center;
  font-size: 30px;
  color: #569bf6;
  background: url("../../../static/images/btn_selected.png") no-repeat;
  background-size: 330px 86px;
}
.bottomBox {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-around;
  width: 100%;
  font-size: 30px;
  color: #fff;
}
.cancel,
.confirm {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 50%;
  border-top: 2px solid #f7f7f7;
}
.cancel {
  color: #999999;
  background: #fff;
}
.confirm {
  color: #fff;
  background: #569bf6;
}
.carName {
  display: inline-block;
}
</style>
