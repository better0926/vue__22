<template>
  <footer class="foot">
    <ul class="wrap">
      <li>
        <router-link to="/">
          <i class="fa fa-home fa-fw"></i>
          <p>首页</p>
        </router-link>
      </li>
      <li>
        <router-link to="/beeslist">
          <i class="fa fa-bolt fa-fw activecur"></i>
          <p>闪电超市</p>
        </router-link>
      </li>
      <li class="rel">
        <router-link to="/cart">
          <i class="fa fa-cart-plus fa-fw activecur"></i>
          <p>购物车</p>
          <div class="coun-num abs">{{ $store.getters.addTotal }}</div>
        </router-link>
      </li>
      <li>
        <router-link to="/">
          <i class="fa fa-user fa-fw"></i>
          <p>我的</p>
        </router-link>
      </li>
    </ul>
  </footer>
</template>

<script>
export default {};
</script>
<style lang="less">
.foot {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1rem /* 54/54 */;
  background-color: rgba(246,246,246,0.95);
  .wrap {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  li {
    text-align: center;
    a {
      font-size: .259259rem /* 14/54 */;
      color: #666;
      i {
        font-size: .444444rem /* 24/54 */;
        color: #ccc;
      }
    }
    .router-link-exact-active .activecur {
      color: #090;
    }
  }
  .coun-num {
    top: 0;
    right: -.259259rem /* 14/54 */;
    width: .37037rem /* 20/54 */;
    height: .37037rem /* 20/54 */;
    background-color: red;
    color: #fff;
    border-radius: 50%;
    text-align: center;
    line-height: .37037rem /* 20/54 */;
    font-size: .222222rem /* 12/54 */;
  }
}
</style>


