<template>
  <view class="goods-item">
    <!-- 左侧盒子 -->
    <view class="goods-item-left">
      <radio :checked="goods.goods_state" color="#30B1DE" v-if="showRadio" 
      @click="radioClickHandler"></radio>
      <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
      <!-- <image :src="defaultPic" class="goods-pic"></image> -->
    </view>
    <!-- 右侧盒子 -->
    <view class="goods-item-right">
      <view class="goods-name">{{goods.goods_name}}</view>
      <view class="goods-info-box">
        <view class="goods-price">￥{{goods.goods_price | tofixed}}</view>
        <uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" 
        @change="numChangeHandler">
        </uni-number-box>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-goods",
    props:{
      goods:{
        type:Object,
        default:{}
      },
      showRadio:{
        type:Boolean,
        deafult:false 
      },
      showNum:{
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        defaultPic: "../../static/images/14.png", //默认图片
      };
    },
    methods:{
      //radio 的点击处理函数
      radioClickHandler(){
        this.$emit('radio-change',{
          goods_id:this.goods.goods_id,
          goods_state:!this.goods.goods_state
        })
      },
      numChangeHandler(val){
        this.$emit('num_change',{
           goods_id:this.goods.goods_id,
           goods_count:+val//保证数据为数值
        })
      }
    },
    filters:{
      //过滤器，使价格带两位小数
      tofixed(num){
        return Number(num).toFixed(2)
      }
    }
  }
</script>

<style lang="scss">
  .goods-item {
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;

    .goods-item-left {
      margin-right: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .goods-pic {
        width: 100px;
        height: 100px;
        display: block;
      }
    }

    .goods-item-right {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
      }

      .goods-info-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .goods-price {
          color: #C00000;
          font-size: 16px;
        }
      }
    }
  }
</style>