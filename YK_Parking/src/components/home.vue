<template>
  <div class="wrap">
    <div class="item" v-for="(item, index) in itemName" :key="index">
      <router-link class="linkTo" :to='item.link'>
        <div class="single">
          <img class="photo" v-bind:src="item.photoSrc" alt="">
          <div class="text">{{item.text}}</div>
        </div>
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: "Home",
  mounted() {
    setTimeout(() => {
      window.workgo.getAuth(window.appId, window.APPSercet, result => {
        if (result.success) {
          this.workGoUser();
        } else {
          alert(result.errMsg);
        }
      });
    }, 100);
    document.querySelector("title").innerText = "首页";
  },
  activated() {
    document.querySelector("title").innerText = "首页";
  },
  methods: {
    workGoUser() {
      // 获取用户信息
      window.workgo.getUserInfo(result => {
        window.workPhone = result.mobile;
        window.workid = result.userId;
      });
    }
  },
  data() {
    return {
      itemName: [
        {
          photoSrc: require("@/assets/images/home_month.png"),
          text: "包月充值",
          link: "/monthlyInquiry"
        },
        {
          photoSrc: require("@/assets/images/home_temp.png"),
          text: "临停缴费",
          link: "/temporaryPay"
        },
        {
          photoSrc: require("@/assets/images/home_substitute.png"),
          text: "代缴",
          link: "/surrender"
        },
        {
          photoSrc: require("@/assets/images/home_cars.png"),
          text: "车辆管理",
          link: "/carManagement"
        },
        {
          photoSrc: require("@/assets/images/home_orders.png"),
          text: "订单中心",
          link: "/personal"
        },
        {
          photoSrc: require("@/assets/images/home_msgs.png"),
          text: "消息",
          link: "/noticeReminding"
        }
      ]
    };
  }
};
</script>
<style scoped>
.wrap {
  height: 100%;
  width: 750px;
  background: #fff;
}
.item {
  display: inline-block;
  width: 248px;
  height: 250px;
  border-right: 2px solid #f3f3f3;
  border-bottom: 2px solid #f3f3f3;
}
.single {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.photo {
  display: inline-block;
  width: 98px;
  height: 98px;
  margin: 60px 0 35px;
}
.text {
  font-size: 30px;
  line-height: 30px;
  color: #000;
}
.linkTo {
  text-decoration: none;
}
</style>
