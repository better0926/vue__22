<template>
  <!-- 选中商品 -- ++ -->
  <div class="count flexbox pd-r">
    <div :class="{ selected: !isSelected }">
      <span class="minus" @click="minus">
        <i class="fa fa-minus fa-fw"></i>
      </span>
      <span>{{selectedCount}}</span>
    </div>
    <div>
      <span class="plus" @click="add">
        <i class="fa fa-plus fa-fw"></i>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value'],
  data () {
    return {
      selectedCount: this.value
    }
  },
  // 监听selectedCount的数据变化
  //
  watch: {
    selectedCount (curCount) {
      //将子组件中数据的改变，同步到父组件中去

      this.$emit('input',curCount)

      // 调用vuex中addCart方法,数据同步到购物车
      this.$emit('selecttedgods')
    }
  },
  computed: {
    isSelected () {
      return this.selectedCount > 0
    }
  },
  methods: {
    add () {
      this.selectedCount++
    },
    minus() {
      this.selectedCount--
    }
  }

}
</script>

<style lang="less">

  .count {
    .minus,
    .plus {
      width: .444444rem /* 24/54 */;
      height: .444444rem /* 24/54 */;
      border-radius: 50%;
      border: 1px solid red;
      display: inline-block;
      text-align: center;
      i {
        font-size: .222222rem /* 12/54 */;
        color: red;
        line-height: .444444rem /* 24/54 */;
      }
    }
    .selected {
      display: none;
    }
  }
</style>

