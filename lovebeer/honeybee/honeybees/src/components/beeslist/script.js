


import beesHeader from '../common/header'
import beesFooter from '../common/footer'
// 导入添加商品组件
import addGoods from '../addgoods/addgoods'
export default {
  name: 'beeslist',
  data () {
    return {
      // 左侧菜单栏
      categories: [],
      selectGoods: [],
      products:[],
      // 菜单栏切换索引号
      cateIndex: 0
    }
  },
  created () {
    // 获取左侧菜单栏数据
    this.getAliderList()
  },
  watch:{
    selectGoods:{
        deep: true,
        handler(v){
            this.handlerCount(v);
        }
    }
  },
  methods: {
    handlerCount(val){
      console.log(val)
    },
    //  获取左侧菜单栏数据
    getAliderList () {
      this.$http
        .jsonp('http://localhost:3008/list')
        .then(res => {
          console.log(res);
          const { categories, products } = res.data
          this.products = products
          // 作用：用来显示已选择商品的数量
          const id2Data = this.$store.getters.id2Data
          // 侧边栏数据
          this.categories = categories

          // main对应展示商品
          this.selectGoods = products[categories[0].id].map(item => {
            return {
              ...item,
              count: (id2Data[item.id] && id2Data[item.id].count) || 0
            }
          })
        })
    },
    // tab栏，选中当前菜单
    selectTab (index,id) {
      this.cateIndex = index
      // 点击切换右侧显示内容
      this.selectGoods = this.products[id]

    },
    // 添加或减少商品
    selecttedgods(id) {
      // count 表示当前商品已选择的数量

      const count = this.selectGoods.find(item => item.id === id).count
      // 完成添加购物车的操作
      this.$store.commit('addCart', {
        count,
        id
      })
    }
  },
  // 引入公共 头尾组件
  components: {
    beesHeader,
    beesFooter,
    // 添加商品组件
    addGoods
  }
}
