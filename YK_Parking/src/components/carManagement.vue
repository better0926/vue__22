<template>
  <div class="warp">
    <div class="content">
      <div>
        <div class="carList" v-for="(item, index) in monthlyCar" :key="index">
          <div class="car">
            <span class="licensePlateNumber">{{item.licensePlateNumber}}</span>
            <span class="color1">{{item.color}}</span>
          </div>
          <div class="buttonBox">
            <span class="cutOff btn-center" @click="deleteCar(index, 1)">删除</span>
            <span @click='gotoOrder(index)' class="seeOrder btn-center">查看包月订单</span>
          </div>
        </div>
      </div>
      <div>
        <div class="carList" v-for="(item, index) in carYardName" :key="index">
          <div class="car">
            <span class="licensePlateNumber">{{item.licensePlateNumber}}</span>
            <span class="color">{{item.color}}</span>
          </div>
          <div @click="deleteCar(index, 2)" class="delete btn-center">删除</div>
        </div>
      </div>
      <div @click="addCar" class="button btn-center">新增车辆</div>
      <div class="mask" v-if="flag">
        <div @click="abolish" class="blank"></div>
        <div class="popUp">
          <div class="sureTip">{{"确认删除" +tempCar +"?" }}</div>
          <div class="selectButton">
            <div @click="abolish" class="abolish">取消</div>
            <div @click="remove" class="sure">确认</div>
          </div>
        </div>
      </div>
      <div class="mask" v-if="show">
        <div @click="cancel" class="blank"></div>
        <div class="maskWrap">
          <div class="content">
            <div class="inputBox">
              <input type="text" placeholder="车牌" class="inputText" v-model="inputValue" ref="inputFocus">
              <div class="transparentButton" @click="selectCar"></div>
            </div>
            <div class="forExample">例:苏A8888</div>
            <div class="promptText">选择颜色</div>
            <div class="carColorList">
              <div class="colorList" v-for="(item,index) in carColor" :key="index">
                <div @click="select(index)" :class="selectIndex === index?'selectColor':'carColor'">{{item.color}}</div>
              </div>
            </div>
          </div>
          <div class="select">
            <div @click="cancel" class="cancel">取消</div>
            <div @click="confirm" class="confirm">确认</div>
          </div>
        </div>
      </div>
    </div>
    <tip-mes :msg="message" v-if="isDisplay"></tip-mes>
    <place-name v-if="isPlace" @onselect="onSelect($event)" @onclose="onClose($event)"></place-name>
  </div>
</template>
<script>
import TipMes from "@/components/common/tipMes";
import PlaceName from "@/components/common/placeName";
import XHR from "@/utils/request";
import API from "@/utils/api.js";
export default {
  mounted() {
    this.getCarList();
    document.querySelector("title").innerText = "车辆管理";
  },
  activated() {
    this.getCarList();
    document.querySelector("title").innerText = "车辆管理";
    this.inputValue = null;
  },
  components: {
    TipMes,
    PlaceName
  },
  name: "CarManagement",
  data() {
    return {
      carColor: [
        { color: "黑色" },
        { color: "白色" },
        { color: "红色" },
        { color: "绿色" },
        { color: "蓝色" },
        { color: "黄色" },
        { color: "紫色" },
        { color: "棕色" },
        { color: "青色" },
        { color: "其他" }
      ],
      carYardName: [], // 无包月车辆列表
      monthlyCar: [], // 包月车辆列表
      flag: false, // 删除提示弹窗
      show: false, // 新增提示弹窗
      isPlace: false,
      isDisplay: false, // tip
      selectIndex: 0, // 颜色index
      carId: null, // 车辆Id
      color: null, // 车辆颜色
      inputValue: null, // 输入框文本
      tempCar: null // 删除对应车
    };
  },
  methods: {
    async getCarList() {
      // 获取车辆列表
      const result = await XHR.get(window.admin + API.getVehicleList + "?userId=" + window.workid);
      const dataList = JSON.parse(result).data || [];
      const monthCar = [];
      const NoMonthCar = [];
      dataList.forEach(el => {
        if (el.hasOwnProperty("endTime") === false) {
          NoMonthCar.push({
            color: el.colour,
            licensePlateNumber: el.licensePlateNumber.replace(/\s/gi, ""),
            id: el.id
          });
        }
        if (el.hasOwnProperty("endTime") === true) {
          monthCar.push({
            color: el.colour,
            licensePlateNumber: el.licensePlateNumber.replace(/\s/gi, ""),
            id: el.id
          });
        }
      });
      this.carYardName = NoMonthCar;
      this.monthlyCar = monthCar;
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
    gotoOrder(i) {
      // 挑转到包月订单
      window.flag = true;
      window.tempCarNumber = this.monthlyCar[i].licensePlateNumber;
      this.$router.push({ path: "/monthlyOrders" });
    },
    deleteCar(index, isMonth) {
      // 弹出删除提示
      if (isMonth === 2) {
        this.carId = this.carYardName[index].id;
        this.tempCar = this.carYardName[index].licensePlateNumber;
      } else {
        this.carId = this.monthlyCar[index].id;
        this.tempCar = this.monthlyCar[index].licensePlateNumber;
      }
      this.flag = true;
    },
    async remove() {
      // 删除车辆
      const result = await XHR.post(window.admin + API.deleteVehicle + "?id=" + this.carId);
      const dataResult = JSON.parse(result);
      if (dataResult.status === 200) {
        this.flag = false;
        this.getCarList();
      } else {
        alert(dataResult.msg);
      }
    },
    abolish() {
      // 取消
      this.flag = false;
    },
    addCar() {
      // 添加车辆
      this.show = true;
      this.inputValue = null;
      this.selectIndex = 0;
    },
    select(index) {
      // 选择颜色
      this.selectIndex = index;
    },
    cancel() {
      // 取消新增
      this.show = false;
    },
    async confirm() {
      // 确认添加
      if (!this.inputValue) {
        this.message = "请输入车牌号";
        this.isDisplay = true;
        setTimeout(() => {
          this.isDisplay = false;
        }, 1.5e3);
        return false;
      }
      this.color = this.carColor[this.selectIndex].color;
      const result = await XHR.post(window.admin + API.addVehicle, {
        colour: this.color,
        licensePlateNumber: this.inputValue.replace(/\s/gi, ""),
        phone: window.workPhone,
        userId: window.workid
      });
      if (JSON.parse(result).status === 200) {
        this.show = false;
        this.getCarList();
      } else {
        alert(JSON.parse(result).msg);
      }
    }
  }
};
</script>
<style scoped>
.wrap {
  width: 750px;
}
.delete,
.cutOff {
  width: 116px;
  height: 56px;
  font-size: 26px;
  border: 2px solid #e8e8e8;
  border-radius: 4px;
  color: #999;
}
.seeOrder {
  width: 196px;
  margin-left: 20px;
  height: 56px;
  font-size: 26px;
  border: 2px solid #c6defc;
  border-radius: 4px;
  color: #62a2f7;
}
.carList {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 118px;
  padding: 0 30px;
  border-bottom: 2px solid #f7f7f7;
}
.car {
  font-size: 30px;
  color: #000;
}
.licensePlateNumber {
  display: inline-block;
  width: 168px;
}
.color {
  margin-left: 20px;
  color: #8e8e8e;
}
.color1 {
  display: inline-block;
  margin-left: 30px;
  color: #8e8e8e;
}
.buttonBox {
  display: inherit;
}
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
  height: 208px;
  margin-top: 326px;
  border-radius: 5px;
  font-size: 34px;
  background: #fff;
  overflow: hidden;
}
.sureTip {
  width: 100%;
  margin: 40px 0 60px;
  text-indent: 30px;
  font-size: 30px;
  line-height: 30px;
  color: #000;
  background: #fff;
}
.selectButton,
.select {
  display: flex;
  justify-content: space-around;
  width: 100%;
  font-size: 30px;
}
.selectButton {
  height: 80px;
}
.select {
  height: 100px;
}
.abolish,
.sure {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  border-top: 2px solid #f7f7f7;
}
.abolish,
.cancel {
  color: #999999;
  background: #fff;
}
.sure,
.confirm {
  color: #fff;
  background: #569bf6;
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
.button {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  text-align: center;
  font-size: 30px;
  color: #fff;
  background: #569bf6;
}
.maskWrap {
  z-index: 101;
  position: fixed;
  left: 0;
  bottom: 0;
  background: #fff;
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
  margin-bottom: 22px;
}
.carColorList {
  padding: 0 16px 50px;
}
.colorList {
  display: inline-block;
}
.carColor {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 56px;
  width: 143px;
  margin: 15px 15px;
  border: 2px solid #e8e8e8;
  border-radius: 4px;
  text-align: center;
  font-size: 30px;
  color: #000;
}
.selectColor {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 56px;
  width: 143px;
  margin: 15px 15px;
  font-size: 30px;
  color: #96c1f9;
  background: url("../../static/images/btn_min.png") no-repeat;
  background-size: 143px 56px;
}
.transparentButton {
  position: absolute;
  top: 0;
  left: 0;
  width: 750px;
  height: 118px;
}
.btn-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
