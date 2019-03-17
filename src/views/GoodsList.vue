<template>
  <div>
    <nav-header></nav-header>
    <nav-bread></nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a @click="sortGoods" href="javascript:void(0)" class="price"  >Price <svg class="icon icon-arrow-short" :class="{'sort-dd':sortFlag}"><use xlink:href="#icon-arrow-short"></use></svg></a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show': filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" :class="{'cur':priceChecked === 'all'}" @click="priceChecked ='all'">All</a></dd>
              <dd v-for="(price, index) in priceFilter" :key="index" >
                <a href="javascript:void(0)" :class="{'cur': priceChecked === index}" @click="setPriceFilter(index)">{{price.startPrice}} - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul v-if="goods">
                <li v-for="(item, index) in goods" :key="index">
                  <div class="pic">
                    <a href="#">
                      <img v-lazy="item.productImage" alt="">
                      <!-- <span>{{item.productImage}}</span> -->
                      </a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.productPrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" @click="addCart(item.productId)" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div 
                v-infinite-scroll="loadMore" 
                infinite-scroll-disabled="busy" 
                infinite-scroll-distance="50">
                <img src="./../assets/loading-bubbles.svg" alt="" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></div>
    <modal :mdShow='mdShow' @close="closeModal">
      <p slot="message">
        请先登录，否则无法加入到购物车！
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
      </div>
    </modal>
    <modal :mdShow='mdShowCart' @close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>加入购物车成!</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
        <router-link class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>

      </div>
    </modal>
    <nav-footer></nav-footer>
    
  </div>
</template>

<script>
  import NavHeader from './../components/NavHeader'
  import NavFooter from './../components/NavFooter'
  import NavBread from './../components/NavBread'
  import Modal from './../components/Modal'
  import '../assets/css/base.css'
  import '../assets/css/product.css'
  import axios from 'axios'
  import { getGoods } from "api"
  

  export default {
    data(){
      return {
        mdShow:false,
        mdShowCart:false,
        sortFlag:1,
        url: '/static/',
        goods: [],
        busy: false,
        page:1,
        pageSize:8,
        loading: false,
        priceFilter: [// 1 定义数据
          {
            startPrice:'0.00',
            endPrice:'500.00'
          },
          {
            startPrice:'500.00',
            endPrice:'1000.00'
          },{
            startPrice:'1000.00',
            endPrice:'2000.00'
          }
        ],
        priceChecked: 'all',
        filterBy:false,
        overLayFlag: false
      }
    },
    components:{
      NavHeader,
      NavFooter,
      NavBread,
      Modal
    },
    created(){
      this._getGoods();
    },
    methods:{
      closeModal(){
        this.mdShow = false;
      },
      addCart(productId){
        axios.post("/retest/addCart",{
          productId:productId
        }).then((res)=> {
          if(res.data.status==0){
            this.mdShowCart = true;
            this.$store.commit("updateCartCount",1);
          }else{
            console.log(res)
            this.mdShow = true;
        }
        })
      },
      setPriceFilter(index){
        thi.priceChecked = index;
        this.page = 1;
        this._getGoods();
      },
      loadMore(){
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this._getGoods(true);

        }, 500);
      },
      _getGoods(flag){
        var param = {
          page : this.page,
          pageSize: this.pageSize,
          sort:this.sortFlag?1:-1,
          priceLevel:this.priceChecked
        }
        this.loading = true;
        getGoods(param).then((res) => {
          var r = res.list;
          if(flag){
            this.goods = this.goods.concat(r);
            if(res.count == 0){
              this.busy = true;
            }else{
              this.busy = false;
            }
          }else{
            this.goods = r;
            this.busy = false;
          }
          this.loading = false;
        })
      },
      sortGoods(){
        this.sortFlag = !this.sortFlag;
        this.page = 1;
        this._getGoods();
      },
      showFilterPop(){
        this.filterBy = true;
        this.overLayFlag = true;
      },
      closePop(){
        this.overLayFlag = false;
        this.filterBy = false;
      },
      setPriceFilter(index){
        this.priceChecked = index;
        this.closePop();
      }
    }
  }
</script>

<style scoped>
.sort-dd{
  transform: rotate(180deg);
  transition: all .3s ease-in-out;
}
.btn :hover{
  background-color: #e8f5ff;
  transition: all .3s ease-out;
}
</style>