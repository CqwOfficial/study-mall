import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import {router} from './router' // {router ：router} import实际导入形式
import store from './store'
// import { sum, minus } from './util' // 非default形式引入（逐个引入）
import * as util from './util' // 非暴露形式引入

import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'

import test from '@/components/test/index'

console.log(`sum:${util.sum(1,6)}`); // 非暴露形式调用
console.log(`minus:${util.minus(10,2)}`); // 非暴露形式调用

Vue.config.productionTip = false

Vue.use(Vuex);
Vue.filter("currency",currency);

Vue.use(infiniteScroll)

Vue.use(VueLazyLoad,{
  loading:"/static/loading-svg/loading-balls.svg"
})

Vue.use(test)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// AMD规范简单到只有一个API
// define函数 define([module-name?], [array-of-dependencies?], [module-factory-or-object]); 

// define('util', function () {
//   return {
//     sum: function () {
      
//     },
//     minus: function () {
      
//     }
//   }  
// });


// CMD 同步加载机制，就近依赖规范 即用即返回，同步概念
// 所有模块都通过define 定义
// 格式如下
// define(function(require, exports, module){
//   var $ = require('jquery');
//   var sp = require('./spinning')
// })

// commonjs规范 后端规范 服务端模块划分，
// module.exports 匿名输出 export.area 带名输出
// export.area = function (r) {
//   return Math.PI * r * r;
// }

// ES6 export/default
// 引入就是import('地址')
