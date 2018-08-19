const API = {
  getVehicleList: '/api/vehicle/getVehicleList', // 获取绑定车辆
  deleteVehicle: '/api/vehicle/deleteVehicle', // 解绑车辆
  addVehicle: '/api/vehicle/addVehicle', // 新增车辆
  getTemporaryOrderList: '/api/temporaryOrder/getTemporaryOrderList', // 获取临停订单列表
  getReplaceOrderList: '/api/replaceOrder/getReplaceOrderList', // 获取代缴订单列表
  getNotificationList: '/api/notification/getNotificationList', // 获取通知列表
  getMonthlyPlansOrderList: '/api/monthlyPlansOrder/getMonthlyPlansOrderList', // 获取包月订单列表
  getParkingLotList: '/api/getParkingLotList', // 获取停车场列表
  getCarCardInfo: '/api/getCarCardInfo', // 固定车查询
  getCarCardFee: '/api/getCarCardFee', // 固定车充值订单查询
  payCarCardFee: '/api/payCarCardFee', // 固定车充值
  getParkingPaymentInfo: '/api/getParkingPaymentInfo', // 获取停车费账单
  temporaryPayParkingFee: '/api/temporaryPayParkingFee', // 临停车费账单支付
  replacePayParkingFee: '/api/replacePayParkingFee' // 代缴车费账单支付
}
export default API
