import request from "../request";
import requestUrl from "../requestUrl";
import requestParam from "../requestParam";
import isInteger from "lodash/isInteger";

// 获取列表
export function list(params) {
  return request({
    url: requestUrl("/sys/sysoffice/list"),
    method: "get",
    params: requestParam(params, "get")
  });
}

// 获取信息
export function info(id) {
  return request({
    url: requestUrl("/sys/sysoffice/info" + (isInteger(id) ? `/${id}` : "")),
    method: "get",
    params: requestParam({}, "get")
  });
}

// 添加
export function add(params) {
  return request({
    url: requestUrl("/sys/sysoffice/save"),
    method: "post",
    data: requestParam(params)
  });
}

// 修改
export function update(params) {
  return request({
    url: requestUrl("/sys/sysoffice/update"),
    method: "post",
    data: requestParam(params)
  });
}

// 设置员工账号数
export function setAddpersons(params) {
  return request({
    url: requestUrl("/sys/sysoffice/setAddpersons"),
    method: "post",
    data: requestParam(params)
  });
}
// 删除
export function del(params) {
  return request({
    url: requestUrl("/sys/sysoffice/delete"),
    method: "post",
    data: requestParam(params, "post", false)
  });
}
