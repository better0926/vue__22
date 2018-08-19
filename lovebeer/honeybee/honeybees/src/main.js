// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// rem布局
import 'lib-flexible/flexible.js'

// 公共css
import './components/common/base.less'
// font-awesome 字体图标
import 'font-awesome/css/font-awesome.min.css'

import store from '@/store/store.js'

// 引入axios
import axios from 'axios'
// 引入tools跨域jsonp
import './tools'

// 给vue的原型上添加一个http请求方法
Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
