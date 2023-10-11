<template>
  <view class="cart-container" v-if="cart.length !== 0"> 
    <!-- 收货地址组件 -->
    <my-address></my-address>
    <view class="cart-title">
      <!-- 左侧图标 -->
      <uni-icons type="shop" size="18"></uni-icons>
      <text class="cart-title-text">购物车</text>
    </view>

    <!-- 商品列表区域 -->
   <uni-swipe-action>
      <uni-swipe-action-item :right-options="options" @click="swipeItemClickHandler(goods)">
        <my-goods :goods='goodsTest' :showRadio="true" :showNum="true" @radio-change="radioChangeHandler"
          @num_change="numberChangeHandler">
        </my-goods>
      </uni-swipe-action-item>
    </uni-swipe-action>

    <uni-swipe-action>
      <block v-for="(goods,i) in cart" :key="i">
        <uni-swipe-action-item :right-options="options"
          @click="swipeItemClickHandler(goods)">
          <my-goods :goods='goods' :showRadio="true" :showNum="true" 
            @radio-change="radioChangeHandler"
            @num_change="numberChangeHandler">
          </my-goods>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>
    <!-- 自定义结算组件 -->
    <my-settle></my-settle>
  </view>
  <!-- 空白购物车 -->
  <view class="empty-cart" v-else>
    <image src="/static/images/14.png" class="empty-img"></image>
    <text class="tip-text">做咩部车是空既？</text>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabber-badge.js'
  import {
    mapState,
    mapMutations
  } from 'vuex'
  export default {
    mixins: [badgeMix],
    computed: {
      ...mapState('m_cart', ['cart'])
    },
    data() {
      return {
        options: [{
          text: '删除',
          style: {
            backgroundColor: "#30B1DE"
          }
        }],
        goodsTest: {
          goods_count: 1,
          goods_id: 11,
          goods_name: "兹拉(非卖品)(测试专用)",
          goods_price: 0,
          goods_small_logo: '../../static/images/14.png',
          goods_state: true
        }
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount','removeGoodsByID']),
      radioChangeHandler(e) {
        // this.$store.commit('m_cart/updateGoodsState',e)
        this.updateGoodsState(e)
      },
      numberChangeHandler(e) {
        this.updateGoodsCount(e)
      },
      swipeItemClickHandler(goods){
        this.removeGoodsByID(goods.goods_id)
      }
    }
  }
</script>

<style lang="scss">
  .cart-container{
    padding-bottom: 50px;
  }
  .cart-title {
    height: 40px;
    display: flex;
    align-items: center;
    padding-left: 5px;
    border-bottom: 1px solid #efefef;
  }

  .cart-title-text {
    font-size: 14px;
    margin-left: 10px;
  }
  .empty-cart{
    display: flex;
    flex-direction: column;
    align-items: center;
      padding-top: 150px;
    .empty-img{
      border-radius: 50%;
      width: 90px;
      height: 90px;
    }
    .tip-text{
      font-size: 12px;
      color: gray;
      margin-top: 15px;
    }
  }
</style>