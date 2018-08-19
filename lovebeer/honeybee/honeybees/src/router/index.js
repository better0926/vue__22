import Vue from 'vue'
import Router from 'vue-router'
import beesList from '@/components/beeslist'
// import parents from '@/components/vuex-teml/parents'
import Cart from '@/components/cart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/beeslist',
      name: 'beesList',
      component: beesList
    },
    // 购物车路由
    {
      path: '/cart',
      name: 'cart',
      component: Cart
    }// ,
    // {
    //   path: '/vuex',
    //   component: parents
    // }
  ]
})
