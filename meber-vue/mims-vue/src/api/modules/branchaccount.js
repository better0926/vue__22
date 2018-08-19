import request from "../request";
import requestUrl from "../requestUrl";
import requestParam from "../requestParam";
// import isInteger from "lodash/isInteger";

// 获取列表
export function list(params) {
  return request({
    url: requestUrl("/account/branchaccount/list"),
    method: "get",
    params: requestParam(params, "get")
  });
}

// 不是自己门店的持卡消费信息
export function branchAccount(params) {
  return request({
    url: requestUrl("/order/miorderpay/branchAccount"),
    method: "get",
    params: requestParam(params, "get")
  });
}

// 获取信息
export function info(id) {
  return request({
    url: requestUrl("/account/branchaccount/info/" + id),
    method: "get",
    params: requestParam({}, "get")
  });
}

// 添加
export function add(params) {
  return request({
    url: requestUrl("/account/branchaccount/save"),
    method: "post",
    data: requestParam(params)
  });
}

// 修改
export function update(params) {
  return request({
    url: requestUrl("/account/branchaccount/update"),
    method: "post",
    data: requestParam(params)
  });
}

// 删除
export function del(params) {
  return request({
    url: requestUrl("/account/branchaccount/delete"),
    method: "post",
    data: requestParam(params, "post", false)
  });
}
