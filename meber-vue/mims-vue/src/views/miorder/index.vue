<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.orderNo" placeholder="请输入订单号" clearable @clear="getDataListPage1()"></el-input>
      </el-form-item>
      <el-select v-model="dataForm.officeId" placeholder="请选择门店">
        <el-option v-for="item in filter.officeList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="dataForm.memberId" placeholder="请选择或搜索会员" filterable style="width:300px;">
        <el-option v-for="item in filter.memberList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-form-item>
        开单时间:
        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="dataForm.startTime" placeholder="开始日期"></el-date-picker>~
        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="dataForm.endTime" placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataListPage1()">查询</el-button>
        <!-- <el-button v-if="isAuth('order:miorder:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('order:miorder:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <el-card class="box-card" v-for="item in dataList" :key="item.id">
      <div class="title-bar">
        <span>[{{item.orderType | orderTypeCh}}]&emsp;所属门店：{{item.officeName || "无"}}</span>
        <!-- 1、待付款 2、已付款 3、尾款单 4、已取消 5、已退单 -->
        <span class="status" v-if="item.status==1">待付款</span>
        <span class="status" v-else-if="item.status==2">已付款</span>
        <span class="status" v-else-if="item.status==3">尾款单</span>
        <span class="status" v-else-if="item.status==4">已取消</span>
        <span class="status" v-else-if="item.status==5">已退单</span>
        <span class="status" v-else>未知</span>
      </div>
      <el-row>
        <el-col :span="6">
          <div>会员信息：</div>
          <div class="user-info">
            <div class="user-info-ctn">
              <div class="username">{{item.member ? item.member.name : '无'}}</div>
              <div class="userphone">{{item.member ? item.member.mobile : '无'}}</div>
              <div class="userno">会员号：{{item.member ? item.member.memberno : '无'}}</div>
            </div>
            <img v-if="item.member" class="user-img" :src="parseUrl(item.member.headimage)" alt="">
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-title">订单号/下单时间</div>
          <div>{{item.orderNo}}</div>
          <div>{{item.createDate}}</div>
        </el-col>
        <el-col :span="6">
          <div class="info-title">订单内容</div>
          <div v-for="detail in item.detailList" :key="detail.id">{{detail.serviceName}}x{{detail.nums}}</div>
        </el-col>
        <el-col :span="6">
          <div class="info-title">服务人员</div>
          <div v-for="detail in item.detailList" :key="detail.id">{{detail.serviceTechnician}}</div>
        </el-col>
      </el-row>
      <div class="bot-bar">
        &nbsp;
        <span class="right-btns">
          <template v-if="item.orderType == 1">
            <el-button v-if="item.status == 1" type="info" @click="goOrderCreatePage(item.id, 'order')">收银</el-button>
            <el-button v-if="item.status == 3" type="info" @click="goOrderCreatePage(item.id, 'repayment')">还款</el-button>
          </template>
          <template v-if="item.orderType == 2">
            <el-button v-if="item.status == 1" type="info" @click="goOrderCreatePage(item.id, 'order-card')">收银</el-button>
            <el-button v-if="item.status == 3" type="info" @click="goOrderCreatePage(item.id, 'repayment-card')">还款</el-button>
          </template>
          <el-button type="primary" @click="print(item)">打印小票</el-button>
          <el-button type="success" @click="showDetail(item.id)">详情</el-button>
          <!-- <el-button type="warning">修改</el-button> -->
          <el-button v-if="item.status == 1" type="danger" @click="changeOrderStatus(item.id, 4)">取消订单</el-button>
          <el-button v-if="item.status == 2 || item.status == 3" type="danger" @click="changeOrderStatus(item.id, 5)">退单</el-button>
        </span>
      </div>
    </el-card>

    <!-- <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column prop="id" header-align="center" align="center" label="">
      </el-table-column>
      <el-table-column prop="orderNo" header-align="center" align="center" label="订单号">
      </el-table-column>
      <el-table-column prop="orderType" header-align="center" align="center" label="订单类型：1、开单 2、开卡购卡 3、卡充值">
      </el-table-column>
      <el-table-column prop="memberId" header-align="center" align="center" label="会员ID">
      </el-table-column>
      <el-table-column prop="memberNums" header-align="center" align="center" label="会员数量">
      </el-table-column>
      <el-table-column prop="totalPrice" header-align="center" align="center" label="总价">
      </el-table-column>
      <el-table-column prop="realPrice" header-align="center" align="center" label="实际金额">
      </el-table-column>
      <el-table-column prop="needPay" header-align="center" align="center" label="剩余支付费用">
      </el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="状态：1、待付款 2、已付款 3、尾款单 4、已取消 5、已退单">
      </el-table-column>
      <el-table-column prop="officeId" header-align="center" align="center" label="所属门店">
      </el-table-column>
      <el-table-column prop="serialNo" header-align="center" align="center" label="流水单号">
      </el-table-column>
      <el-table-column prop="payTime" header-align="center" align="center" label="支付时间">
      </el-table-column>
      <el-table-column prop="refundTime" header-align="center" align="center" label="退单时间">
      </el-table-column>
      <el-table-column prop="createBy" header-align="center" align="center" label="创建者">
      </el-table-column>
      <el-table-column prop="createDate" header-align="center" align="center" label="创建时间">
      </el-table-column>
      <el-table-column prop="updateBy" header-align="center" align="center" label="更新者">
      </el-table-column>
      <el-table-column prop="updateDate" header-align="center" align="center" label="更新时间">
      </el-table-column>
      <el-table-column prop="remarks" header-align="center" align="center" label="备注信息">
      </el-table-column>
      <el-table-column prop="delFlag" header-align="center" align="center" label="删除标记">
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table> -->
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <detail v-if="detailVisible" ref="detail" @refreshDataList="getDataList"></detail>
    <div style="display:none;" ref="printHtml">
      <print-info :printitem="item"></print-info>
    </div>

  </div>
</template>


<script>
import { mapMutations } from "vuex";
import API from "@/api";
import parseUrl from "@/utils/parseUrl";
import detail from "./detail";
import print from "./print";
import printInfo from "./printInfo";
export default {
  data() {
    return {
      active: false,
      filter: {
        userList: [],
        memberList: [],
        officeList: []
      },
      dataForm: {
        orderNo: "",
        officeId: "",
        memberId: "",
        startTime: "",
        endTime: ""
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      detailVisible: false,
      item: {}
    };
  },
  props: ["status", "history"],
  filters: {
    orderTypeCh(type) {
      if (+type === 1) {
        return "综合消费";
      } else if (+type === 2) {
        return "购卡";
      } else if (+type === 3) {
        return "卡充值";
      } else {
        return "未知";
      }
    }
  },
  components: {
    detail,
    printInfo
  },
  mounted() {
    if (!this.active) {
      this.getMemberList();
      this.getOfficeList();
      this.getDataList();
    }
    this.active = true;
  },
  activated() {
    if (this.active) {
      this.getDataList();
    }
  },
  methods: {
    ...mapMutations(["UPDATE_MENU_NAV_ACTIVE_NAME"]),
    parseUrl,
    print,
    goOrderCreatePage(orderId, type) {
      this.$router.push({
        path: "/createorder/" + type + "/" + orderId
      });
      this.UPDATE_MENU_NAV_ACTIVE_NAME({ name: "159" });
    },
    getDataListPage1() {
      this.pageIndex = 1;
      this.getDataList();
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      var params = {
        page: this.pageIndex,
        limit: this.pageSize,
        orderNo: this.dataForm.orderNo,
        memberId: this.dataForm.memberId,
        officeId: this.dataForm.officeId,
        startTime: this.dataForm.startTime,
        endTime: this.dataForm.endTime
      };
      if (this.status) {
        params.status = this.status;
      }
      if (this.history) {
        params.history = true;
      }
      API.miorder.list(params).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    showDetail(id) {
      this.detailVisible = true;
      this.$nextTick(() => {
        this.$refs.detail.init(id);
      });
    },
    changeOrderStatus(id, status) {
      this.$confirm(`确定取消订单?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var params = {
          id: id,
          status: status
        };
        API.miorder.update(params).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getDataList();
              }
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    getMemberList() {
      API.member.queryMemberList().then(({ data }) => {
        if (data && data.code === 0) {
          this.filter.memberList = data.list;
        } else {
          this.filter.memberList = [];
        }
      });
    },
    getOfficeList() {
      API.common.getOfficeList().then(({ data }) => {
        if (data && data.code === 0) {
          this.filter.officeList = data.list;
        } else {
          this.filter.officeList = [];
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.title-bar {
  margin-bottom: 10px;
}
.status {
  float: right;
  color: red;
}
.info-title {
  margin-bottom: 10px;
}
.user-info {
  position: relative;
  &-ctn {
    margin-left: 60px;
    margin-top: 10px;
  }
  .user-img {
    position: absolute;
    left: 0;
    top: 0;
    background-color: #eee;
    display: inline-block;
    height: 50px;
    width: 50px;
    border-radius: 50%;
  }
}
.bot-bar {
  line-height: 40px;
  .right-btns {
    float: right;
  }
}
.box-card {
  margin-bottom: 10px;
}
</style>