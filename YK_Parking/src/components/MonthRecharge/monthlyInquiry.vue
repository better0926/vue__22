<template>
  <div class="warp">
    <div class="content">
      <div class="inputBox">
        <input type="text" placeholder="车牌" class="inputText" v-model="inputText" ref="inputFocus">
        <div class="transparentButton" @click="selectCar"></div>
      </div>
      <div class="forExample">例:苏A8888</div>
      <div class="promptText">选择车场</div>
      <div class="carYardList">
        <div class="carName" v-for="(item,index) in carYardName" :key="index">
          <div @click="select(index)" :class="selectIndex === index?'selectYard':'carYard'">{{item.name}}</div>
        </div>
      </div>
    </div>
    <div @click="getCarCardInfo" class="button btn-center">查询</div>
    <tip-mes :msg="message" v-if="isDisplay"></tip-mes>
    <place-name v-if="isPlace" @onselect="onSelect($event)" @onclose="onClose($event)"></place-name>
    <loading v-if="isLoading"></loading>
  </div>
</template>
<script>
import TipMes from "@/components/common/tipMes";
import PlaceName from "@/components/common/placeName";
import Loading from "@/components/common/loading";
import XHR from "@/utils/request";
import API from "@/utils/api.js";

export default {
  mounted() {
    this.getParkingLotList();
    document.querySelector("title").innerText = "包月查询";
  },
  activated() {
    document.querySelector("title").innerText = "包月查询";
    this.selectIndex = 0;
    this.inputText = null;
  },
  name: "MonthlyInquiry",
  components: {
    TipMes,
    PlaceName,
    Loading
  },
  data() {
    return {
      carYardName: [],
      message: null,
      isDisplay: false,
      isLoading: false,
      selectIndex: 0,
      isPlace: false,
      inputText: null
    };
  },
  methods: {
    select(index) {
      // 选择车场
      this.selectIndex = index;
    },
    selectCar() {
      if (this.inputText === null || this.inputText === "") {
        this.isPlace = true;
      } else {
        this.$refs.inputFocus.focus();
      }
    },
    onSelect(placeName) {
      this.$refs.inputFocus.focus();
      this.isPlace = false;
      this.inputText = placeName;
    },
    onClose(state) {
      this.isPlace = state;
    },
    removeSpace(str) {
      // 移除空格
      if (str) {
        return str.replace(/\s/gi, "");
      }
    },
    async getCarCardInfo() {
      // 固定车查询
      if (!this.inputText) {
        this.message = "请输入车牌号";
        this.isDisplay = true;
        setTimeout(() => {
          this.isDisplay = false;
        }, 1.5e3);
        return false;
      }
      this.isLoading = true;
      const result = await XHR.get(
        window.admin +
          API.getCarCardInfo +
          "?licensePlateNumber=" +
          encodeURI(this.removeSpace(this.inputText)) +
          "&parkId=" +
          this.carYardName[this.selectIndex].parkId
      );
      if (JSON.parse(result).ok) {
        let dataList = {
          licensePlateNumber: this.removeSpace(this.inputText),
          parkName: this.carYardName[this.selectIndex].name,
          parkId: this.carYardName[this.selectIndex].parkId
        };
        this.isLoading = false;
        window.sessionStorage.setItem("dataList", JSON.stringify(dataList));
        this.$router.push({ path: "/monthlyRecharge" });
      } else {
        this.isLoading = false;
        this.message = "抱歉，未找到该车辆包月信息";
        this.isDisplay = true;
        setTimeout(() => {
          this.isDisplay = false;
        }, 1.5e3);
      }
    },
    async getParkingLotList() {
      // 车场
      const result = await XHR.get(window.admin + API.getParkingLotList);
      const dataList = JSON.parse(result).data;
      dataList.forEach(el => {
        this.carYardName.push({
          name: el.parkName,
          parkId: el.parkId
        });
      });
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
.forExample,
.promptText {
  text-indent: 30px;
  font-size: 26px;
  color: #bbbbbb;
}
.forExample {
  margin: 20px 0 58px;
}
.promptText {
  margin-bottom: 16px;
}
.carYardList {
  padding: 0 16px;
}
.carName {
  display: inline-block;
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
.button {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  font-size: 30px;
  color: #fff;
  background: #569bf6;
}
</style>
