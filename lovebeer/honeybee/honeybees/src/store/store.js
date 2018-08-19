import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  // 存储数据
  state: {
    // 用一个数组来存储购物车信息 ids，count
    cartList: JSON.parse(localStorage.getItem('cartList')) || []
    // [
      // {
      //   id: '2435',        // 商品id
      //   count: 1,          // 已选择商品的数量
      //   isSelected: true   // 商品是否选中
      // },
      // {
      //   id: '6834',
      //   count: 1,
      //   isSelected: true
      // },
      // {
      //   id: '9045',
      //   count: 1,
      //   isSelected: true
      // }
    //]
  },
  mutations: {
    addCart (state,addgoods) {0
      // 当前选中的商品
      // 遍历已选中商品的数组，如果已选中上的id包含在商品列表中，那么就让count+1，
      //否则就在cartList中push不包含的商品
      const curGoods = state.cartList.find( item => {
        return item.id === addgoods.id
      })

      if (curGoods) {
        curGoods.count = addgoods.count
      }else {
        state.cartList.push({ ...addgoods, isSelected: true})
      }
      // 将选中的数据存储到localStorage中
      localStorage.setItem('cartList', JSON.stringify(state.cartList))
    },
    updateCart(state, curList) {
      state.cartList = curList.map(item => ({ ...item }))
      localStorage.setItem('cartList', JSON.stringify(state.cartList))
    }
  },
  // getters相当于vue中的计算属性
  getters: {
    // 将数组以 逗号 分隔
    ids (state) {
      return state.cartList.map(item => item.id).join(",")
    },

    // 计算添加商品的总数
    addTotal (state) {
      return state.cartList.reduce((count,item) => {
        count += item.count
        return count
      },0)
    },
    id2Data(state) {
      /*
        {
          id1: { count: 3, isSelected: true },
          id2: { count: 1, isSelected: true },
        }
      */
      return state.cartList.reduce((data, item) => {
        data[item.id] = {
          count: item.count,
          isSelected: item.isSelected
        }

        return data
      }, {})
    },
    // 全选反选
    selectedAll (state) {
      return state.cartList.every(item => item.isSelected)
    }
  }
})
