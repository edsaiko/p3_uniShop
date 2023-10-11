<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio" @click="changeAllstate">
      <radio color="#30B1DE" :checked="isFullCheck" /><text>全选</text>
    </label>
    <!-- 合计 -->
    <view class="amount-box">
      合计：<text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>
    <!-- 结算按钮 -->
    <view class="btn-settle" @click="settlement">
      结算（{{checkedCount}}）
    </view>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-settle",
    data() {
      return {
        //倒计时的秒数
      seconds:3,
      fakePayInfo:{
        nonceStr:"IYKlc5iscUgZIfxj",
        package: "prepay_id=wx011604003115645ec1be4d48174ea70000",
        paySign: "ADO4ED5A386852864E176A5DF26CF436",
        signType:"MD5",
        timeStamp: "1598947444"
      }
      };
    },
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      ...mapGetters('m_user', ['addstr']),
      ...mapState('m_user', ['token']),
      ...mapState('m_cart',['cart']),
      //是否全选
      isFullCheck() {
        return this.total === this.checkedCount
      },
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      ...mapMutations('m_user',['updateRedinectInfo']),
      changeAllstate() {
        // console.log(!this.isFullCheck)
        this.updateAllGoodsState(!this.isFullCheck)
      },
      //用户点击结算按钮
      settlement() {
        if (!this.checkedCount) return uni.$showMsg('没有选中任何商品欸！')
        if (!this.addstr) return uni.$showMsg('没有选择收获地址欸！')
        if (!this.token) return this.delayNavigate(this.seconds)
        this.payOrder()
      },
      async payOrder(){
        console.log('支付部分token存在问题，详见payOrder函数')
        // //1.创建订单
        // //1.1组织订单的信息对象
        // const orderInfo={
        //   // order_price:this.checkedGoodsAmount,
        //   order_price:0.01,
        //   consignee_addr:this.addstr,
        //   goods:this.cart.filter(x=>x.goods_state).map(x=>({
        //     goods_id:x.goods_id,
        //     goods_number:x.goods_count,
        //     goods_orice:x.goods_price
        //   }))
        // }
        // //1.2发起请求创建订单
        // const{data:res}=await uni.$http.post('/api/public/v1/my/orders/create',orderInfo)
        // console.log(res)
        // if(res.status!==200) return uni.$showMsg('创建订单失败！')
        // //1.3得到服务器响应的“订单编号”
        // const orderNumber=res.message.order_number
        // //2.订单预支付
        // //2.1发起请求获得订单的支付信息
        // const {data:res2} = await uni.$http.post
        // ('/api/public/v1/my/orders/req_unifiedorder',{order_number:orderNumber})
        // //2.2预付订单生成失败
        // if(res2.meta.status!==200) return uni.$showMsg('预付订单生成失败')
        // //2.3得到订单支付相关的必要参数
        // // const payInfo=res2.message.pay
        // const payInfo=this.fakePayInfo
        
        // //3.发起微信支付
        // //3.1调用Uni.requestPayment()发起微信支付
        // const [err,succ]=await uni.requestPayment(payInfo)
        // //3.2 完成支付
        // if (err) return uni.$showMsg('订单未支付')
        // //3.3 完成支付，i那一步查询支付的结果
        // const {data:res3} =await uni.$http.post('/api/public/v1/my/orders.chkOrder',{order_number:orderNumber})
        // //3.4 检测到订单未支付
        // if(res3.meta.status!==200) return uni.$showMsg('订单未支付')
        // //3.5 检测到订单支付完成
        // uni.showToast({
        //   title:'订单支付完成',
        //   tcon:'success'
        // })
      },
      //延时导航到my页面
      delayNavigate(seconds){
        console.log('outside:',seconds)
        this.showTip(seconds)
        var mytimer=setInterval(()=>{
          console.log('inside:',seconds)
          seconds--
          if(seconds<=0){
            clearInterval(this.timer)
            uni.switchTab({
              url:'/pages/my/my',
              success:()=>{
                this.updateRedinectInfo({
                  openType:'switchTab',
                  from:'/pages/cart/cart'
                })
              }
            })
            seconds=3
            // 不清楚计时器即使跳转并返回后仍在计时，很
            clearInterval(mytimer)
            return
          }
          this.showTip(seconds)
        },1000)
      },
      //显示倒计时的提示消息,mask的防止点击穿透（相当于模态框那种，有提示时，后面按钮不能点击）
      showTip(n) {
        uni.showToast({
          icon: 'none',
          title: '请登录后再结算' + n + '秒后自动跳转到登录页',
          mask:true,
          duration:1500
        })
      }
    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;

    .radio {
      display: flex;
      align-items: center;
    }

    .amount-box {
      .amount {
        color: #30B1DE;
        font-weight: bold;
      }
    }

    .btn-settle {
      background-color: #30B1DE;
      height: 50px;
      color: white;
      line-height: 50px;
      padding: 0 10px;
      min-width: 100px;
      text-align: center;
    }
  }
</style>