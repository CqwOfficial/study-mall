import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/views/GoodsList'
import Cart from '@/views/Cart';
import Address from '@/views/Address'
import OrderConfirm from '@/views/OrderConfirm'
import OrderSuccess from '@/views/OrderSuccess'

Vue.use(Router)

var addff = 'goodsId';

export let router = new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      components: {
        default:GoodsList
      }
    },
    {
      path: '/cart',
      name: 'Cart',
      components: {
        default:Cart
      }
    },
    {
      path: '/address',
      name: 'Address',
      components: {
        default:Address
      }
    },
    {
      path: '/orderConfirm',
      name: 'OrderConfirm',
      components: {
        default:OrderConfirm
      }
    },
    {
      path: '/orderSuccess',
      name: 'OrderSuccess',
      components: {
        default:OrderSuccess
      }
    }
  ]
})
