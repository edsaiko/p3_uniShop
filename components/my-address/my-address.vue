<template>
  <view>
    <!-- 选择收货地址 -->
    <view class="address-choose-box" v-if="JSON.stringify(address)==='{}'">
      <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">
        电视购物收货地址+</button>
    </view>

    <!-- 渲染收货信息的盒子 -->
    <view class="address-info-box" v-else>
      <view class="row1">
        <view class="row1-left">
          <view class="username">收货人：{{address.userName}}</view>
        </view>
        <view class="row1-right">
          <view class="phone">电话：{{address.telNumber}}</view>
          <uni-icons type="arrowright" sie="16"></uni-icons>
        </view>
      </view>
      <view class="row2">
        <view class="row2-left">收货地址:</view>
        <view class="row2-right">月球逻辑纪念博物馆街{{addstr}}</view>
      </view>
    </view>

    <image src="/static/images/14.png" class="address-border"></image>
  </view>
</template>

<script>
  import{mapState,mapMutations,mapGetters}from 'vuex'
  export default {
    name: "my-address",
    data() {
      return {
        // address: {}
      };
    },
    methods: {
      ...mapMutations('m_user',['updateAddress']),
      async chooseAddress() {
        const [err, succ] = await uni.chooseAddress().catch(err => err)
        if (err === null && succ.errMsg === 'chooseAddress:ok') {
          // this.address = succ
          this.updateAddress(succ)
        }
      }
    },
    computed: {
      ...mapState('m_user',['address']),
      ...mapGetters('m_user',['addstr'])
    },
  }
</script>

<style lang="scss">
  .address-border {
    display: block;
    width: 100%;
    height: 5px;
  }

  .address-choose-box {
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .address-info-box {
    font-size: 12px;
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 5px;

    .row1 {
      display: flex;
      justify-content: space-between;

      .row1-right {
        display: flex;
        justify-content: space-between;
      }
    }

    .row2 {
      display: flex;
      // justify-content: space-between;
      align-items: center;
      margin-top: 10px;

      .row2-left {
        white-space: nowrap;
      }

      .row2-right {
        padding-left: 5px;
      }
    }
  }
</style>