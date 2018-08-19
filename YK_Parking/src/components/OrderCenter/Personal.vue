<template>
  <div>
    <div :key="index" v-for="(item,index) in list">
      <router-link class="linkTo" :to='item.link'>
        <div class="cell">
          <img class="cellImage" :src="item.icon" alt="" />
          <span class="flexContent textColor textFont">{{item.name}}</span>
          <img class="cellArrow" :src="require('@/assets/images/cell_arrow.png')" alt="" />
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import "@/assets/css/publicStyle.css";
export default {
  name: "Personal",
  mounted() {
    document.querySelector("title").innerText = "个人中心";
  },
  activated() {
    document.querySelector("title").innerText = "个人中心";
  },
  data() {
    return {
      list: [
        { name: "临停订单", icon: require("@/assets/images/personal_temp.png"), link: "/personal/temp" },
        { name: "包月订单", icon: require("@/assets/images/personal_month.png"), link: "/monthlyOrders" },
        { name: "代缴订单", icon: require("@/assets/images/personal_substitute.png"), link: "/personal/substitute" }
      ]
    };
  },
  methods: {}
};
</script>
<style>
.cell {
  height: 120px;
  display: flex;
  align-items: center;
  border-bottom: 2px solid #f3f3f3;
}
.cellImage {
  width: 50px;
  height: 50px;
  margin: 0px 25px 0px 25px;
}
.cellArrow {
  width: 15px;
  height: 25px;
  margin: 0px 25px 0px 25px;
}
.linkTo {
  display: inline-block;
  width: 100%;
  text-decoration: none;
}
</style>
