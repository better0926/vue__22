# vue 项目实训

## 快速开始

- 1 开启接口服务器（itcast_vue_server（列表接口））：`node app.js`
- 2 开启脚手架（vuecli_lovebeen）：`npm start` 或者 `npm run dev`

## API 文档

- 商品列表页面
  - [接口地址](http://localhost:3008/list)
  - 使用说明：需要通过 JSONP 方式来*跨域*获取数据

- 购物车页面
  - [接口地址](http://m.beequick.cn/data/home?_r=0.10487448529559651&cart_pids=ids&location=121.5721941391567%2C31.21168025925351)
  - 参数r格式:  是一个随机数
  - 参数 *ids* 格式：`encodeURIComponent('2435,2436,10645')` URI编码

## 项目功能点思路讲解

- 1 列表页面
  - 1.1 左侧侧边栏菜单 - 展示（*）
  - 1.2 右侧商品列表项 - 展示（*）
  - 1.3 切换菜单展示不同商品列表（**）
  - 1.4 加入购物车
- 2 购物车页面
  - 注意：购物车页面的数据，都是根据已选商品的id获取到的，然后，再展示的
  - 2.1 渲染购物车页面数据

## 跨域的问题

- 1 JSONP跨域
- 2 代理
  - 面试中的一个问题：vue中你是怎么实现跨域的？？？

```html
只要是通过 webpack 构建工具搭建的项目，都可以通过 webpack-dev-server 中的代理来解决跨域的问题

vue-cli 中如何配置代理？？？
  在 config/index.js 中配置 proxyTable，来实现代理的功能
  
  proxyTable: {
  // 代理规则
  '/api': {
    // 代理的目标服务器地址
    target: 'http://m.beequick.cn/data/',
    // https请求需要该设置
    secure: false,
    // 必须设置该项
    changeOrigin: true,
    // 将 '/api' 替换成 ''
    pathRewrite: { "^/api": "" }
  }
}

```

### *v-model的第二种用法**

  v-model用于表单数据的双向绑定，其实它就是一个语法糖，这个背后就做了两个操作： 
  1. v-bind绑定一个value属性 
  2. v-on指令给当前元素绑定input事件

  自定义组件使用v-model，应该有以下操作： 
  1. 接收一个value prop 
  2. 触发input事件，并传入新值

  在原生表单元素中： 
  `<input v-model="inputValue">`

  相当于 
  `<input v-bind:value="inputValue" v-on:input="inputValue = $event.target.value">`

  在自定义组件中 
  `<my-component v-model="inputValue"></my-component>`

  相当于 
  `<my-component v-bind:value="inputValue" v-on:input="inputValue = argument[0]"></my-component>`

  这个时候，inputValue接受的值就是input事件的回调函数的第一个参数，所以在自定义组件中，要实现数据   		绑定，还需要$emit去触发input的事件。 
  `this.$emit('input', value)`