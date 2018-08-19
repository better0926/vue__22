// 导入公共头尾
import cartHeader from '@/components/common/header'
import cartFooter from '@/components/common/footer'

// 加减商品 组件
import addGoods from '@/components/addgoods/addgoods'
export default {
  name: 'cart',
  data () {
    return {
      addCartList: []
    }
  },
  created() {
    // 渲染购物车列表数据
    // 结构store中的 id2Data(返回了一个对象，对象中有count，isSelected)
    // ids 返回了id
    const { ids, id2Data } = this.$store.getters
    //console.log(ids, id2Data);

    this.$http
      .get(`/api/home?_r=${Math.random()}&cart_pids=${encodeURIComponent(ids)}&location=121.5721941391567%2C31.21168025925351`)
      // .get(`http://m.beequick.cn/data/home?_r=0.10487448529559651&cart_pids=${encodeURIComponent(ids)}&location=121.5721941391567%2C31.21168025925351`)
      .then (res => {
        //console.log(res)
        const { data } = res.data
        this.addCartList = data.cart_ids.map(item => {
          return {
            ...item,
            count: id2Data[item.id].count,
            isSelected: id2Data[item.id].isSelected
          }
        })
      }).catch(function(){})
  },
  watch: {
    // 监听addCartList
    addCartList: {
      handler(curList) {
        curList.some((item, index) => {
          if (item.count <= 0) {
            curList.splice(index, 1)
            return true
          }
        })

        const cartList = curList.map(item => {
          return {
            id: item.id,
            count: item.count,
            isSelected: item.isSelected
          }
        })
        // 更新数据，同步
        this.$store.commit('updateCart', cartList)
      },
      deep: true
    },
    // 更新count数据

  },
  methods: {
    // 商品选中和反选
    toggleId (id) {
      const currentId = this.addCartList.find(item => item.id === id)
      console.log(currentId);
      currentId.isSelected = !currentId.isSelected
    },
    // 全选反选
    toggleAll () {
      this.addCartList.forEach(item => {
        item.isSelected = !this.$store.getters.selectedAll
        console.log(item.isSelected);

      })
    }

  },
  computed:{
    // 计算总价
    totalPrice () {
      return this.addCartList.reduce((price,item) => {
        if(item.isSelected) {
          price += item.count * item.price
        }
        return price
      },0)
    }
  },
  // 导入公共头尾组件
  components: {
    cartHeader,
    cartFooter,
    addGoods
  }
}
