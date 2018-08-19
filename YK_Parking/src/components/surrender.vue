<template>
  <div class="warp">
    <div class="content">
      <div class="inputBox">
        <input type="text" placeholder="车牌" class="inputText" v-model="inputValue" ref="inputFocus">
        <div class="transparentButton" @click="selectCar"></div>
      </div>
      <div class="forExample">例:苏A8888</div>
      <div class="phoneBox">
        <input type="text" placeholder="被代缴方手机号" class="phone" v-model="inputPhone">
        <div class="option">选填</div>
      </div>
    </div>
    <div class="bottomBox">
      <div @click="back" class="cancel">取消</div>
      <div @click="query(inputValue)" class="confirm">查询</div>
    </div>
    <mask-box :data="dataRuselt" v-if="isShow" @oncancel="onCancel($event)" @onconfire="onConfire($event)"></mask-box>
    <tip-mes :msg="message" v-if="isDisplay"></tip-mes>
    <place-name v-if="isPlace" @onselect="onSelect($event)" @onclose="onClose($event)"></place-name>
    <loading v-if="isLoading"></loading>
  </div>
</template>
<script>
import MaskBox from "@/components/common/maskBox";
import TipMes from "@/components/common/tipMes";
import PlaceName from "@/components/common/placeName";
import Loading from "@/components/common/loading";
import XHR from "@/utils/request";
import API from "@/utils/api.js";
export default {
  name: "Surrender",
  components: {
    MaskBox,
    TipMes,
    PlaceName,
    Loading
  },
  mounted() {
    document.querySelector("title").innerText = "临停代缴";
  },
  activated() {
    this.inputValue = null;
    this.inputPhone = null;
    document.querySelector("title").innerText = "临停代缴";
  },
  data() {
    return {
      dataRuselt: [],
      isShow: false,
      isPlace: false,
      inputValue: null,
      inputPhone: null,
      message: null,
      isDisplay: false,
      isLoading: false
    };
  },
  methods: {
    payment() {
      this.isShow = true;
    },
    onCancel(isState) {
      this.isShow = isState;
    },
    selectCar() {
      // 选择省份
      if (this.inputValue === null || this.inputValue === "") {
        this.isPlace = true;
      } else {
        this.$refs.inputFocus.focus();
      }
    },
    onSelect(placeName) {
      this.$refs.inputFocus.focus();
      this.isPlace = false;
      this.inputValue = placeName;
    },
    onClose(state) {
      this.isPlace = state;
    },
    back() {
      // 取消
      window.history.go(-1);
    },
    async replacePayParkingFee(dataValue, carName) {
      const valueData = await XHR.post(window.admin + API.replacePayParkingFee, {
        licensePlateNumber: carName,
        money: dataValue.payable,
        duration: dataValue.elapsedTime,
        orderNo: dataValue.orderNo,
        parkingGarageName: dataValue.parkName,
        phone: this.inputPhone,
        userId: window.workid
      });
      if (JSON.parse(valueData).status === 200) {
        this.isShow = false;
        this.$router.push({ path: "/personal/substitute" });
      } else {
        alert(JSON.parse(valueData).msg);
      }
    },
    async onConfire(payResult) {
      const dataArray = [];
      payResult.forEach(ev => {
        dataArray.push(ev.result);
      });
      const result = await XHR.get(window.admin + API.getParkingPaymentInfo + "?licensePlateNumber=" + encodeURI(dataArray[0]));
      const valueResult = JSON.parse(result).data[0];
      if (JSON.parse(result).status === 200) {
        if (parseInt(valueResult.payable, 10) === 0) {
          this.message = "该车辆已缴费";
          this.isDisplay = true;
          setTimeout(() => {
            this.isDisplay = false;
          }, 1.5e3);
          return false;
        } else {
          window.workgo.createPayOrder(valueResult.orderNo, window.deviceSn, "停车付款", "付款", valueResult.payable, "www.junl.cn", data => {
            if (data["success"]) {
              this.replacePayParkingFee(valueResult, dataArray[0]);
            } else {
              alert(data["errMsg"]);
            }
          });
        }
      } else {
        alert(JSON.parse(result).msg);
      }
    },
    removeSpace(str) {
      // 移除空格
      return str.replace(/\s/gi, "");
    },
    async query(carName) {
      // 查询
      if (!carName) {
        this.message = "请输入车牌号";
        this.isDisplay = true;
        setTimeout(() => {
          this.isDisplay = false;
        }, 1.5e3);
        return false;
      }
      this.isLoading = true;
      const result = await XHR.get(window.admin + API.getParkingPaymentInfo + "?licensePlateNumber=" + encodeURI(this.removeSpace(carName)));
      if (JSON.parse(result).status === 200) {
        const dataResult = JSON.parse(result).data[0];
        this.dataRuselt = [
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
    }
  }
};
</script>
<style scoped>
.wrap {
  width: 750px;
}
.inputBox {
  display: flex;
  align-items: center;
  height: 118px;
  border-bottom: 2px solid #f7f7f7;
}
.inputText::-webkit-input-placeholder {
  color: #777777;
}
.inputText {
  width: 100%;
  height: 40px;
  padding: 0;
  font-size: 30px;
  text-indent: 30px;
  line-height: 40px;
  color: #000;
  outline: none;
  border: none;
  background: transparent;
  -webkit-appearance: none;
}
.transparentButton {
  position: absolute;
  top: 0;
  left: 0;
  width: 750px;
  height: 118px;
}
.forExample {
  text-indent: 30px;
  font-size: 26px;
  color: #bbbbbb;
}
.forExample {
  margin: 20px 0 32px;
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
.phoneBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 110px;
  padding: 0 30px;
  border-bottom: 2px solid #f7f7f7;
}
.phone::-webkit-input-placeholder {
  color: #777777;
}
.phone {
  width: 80%;
  padding: 0;
  font-size: 30px;
  line-height: 30px;
  color: #000;
  outline: none;
  border: none;
  background: transparent;
  -webkit-appearance: none;
}
.option {
  color: #bdbdbd;
  font-size: 26px;
}
</style>
