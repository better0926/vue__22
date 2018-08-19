<template>
  <div class="warp">
    <div class="noticeList">
      <div class="noNews" v-if="isShow">暂无消息</div>
      <div class="notice" v-for="(item,index) in news" :key="index">
        <div class="text">{{item.text}}</div>
        <div class="time">{{item.date}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import XHR from "@/utils/request";
import API from "@/utils/api.js";
export default {
  mounted() {
    this.getNotificationList();
    document.querySelector("title").innerText = "通知提醒";
  },
  activated() {
    document.querySelector("title").innerText = "通知提醒";
  },
  name: "NoticeReminding",
  data() {
    return {
      news: [],
      isShow: false
    };
  },
  methods: {
    async getNotificationList() {
      const result = await XHR.get(window.admin + API.getNotificationList + "?userId=" + window.workid);
      const dataList = JSON.parse(result).data;
      if (dataList.length > 0) {
        dataList.forEach(el => {
          this.news.push({
            text: el.content,
            date: el.creationTime
          });
        });
      } else {
        this.isShow = true;
      }
    }
  }
};
</script>
<style scoped>
.wrap {
  width: 750px;
}
.notice {
  padding: 30px 30px 18px;
  border-bottom: 2px solid #f7f7f7;
}
.text {
  font-size: 30px;
  line-height: 38px;
  color: #000;
}
.time {
  margin: 14px 0;
  font-size: 26px;
  color: #b3b3b3;
}
.noNews {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  color: #000;
}
</style>
