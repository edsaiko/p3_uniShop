<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- open-type="getUserInfo"属性固定写法，表要拿到用户信息 -->
    <!--   <button type="primary" class="btn-login" open-type="getUserInfo" 
    @getuserinfo="getUserProfile">一键登录</button> -->
    <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
    <text class="tips-text">快D登录啦！</text>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-login",
    data() {
      return {
        fakeUserInfo: {
          avatarUrl: "../../static/images/14.png",
          city: "第三世纪",
          country: "月纪",
          gender: "1",
          is_demote: true,
          language: "",
          nickName: "假发",
          province: "稻妻"
        }
      };
    },
    computed: {
      ...mapState('m_user', ['redirectInfo'])
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedinectInfo']),
      // 用户授权后，获取用户信息
      // getUserProfile(e){
      //   console.log(e)
      // },
      getUserProfile() {
        uni.getUserProfile({
          desc: "登录",
          success: (res) => {
            //将信息存到vuex中
            console.log("getUserProfile success.", res)
            // this.updateUserInfo(res.userInfo)
            this.updateUserInfo(this.fakeUserInfo)
            this.getToken(res)
          },
          fail: (res) => {
            return uni.$showMsg('您取消了登录授权')
          }
        })
      },
      async getToken(info) {
        //获取 code 对应的值
        const [err, res] = await uni.login().catch(err => err)
        if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败')
        //准备参数
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        console.log("query", query)
        const {
          data: loginResult
        } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        console.log(loginResult)
        // if(loginResult.meta.status!==200) return uni.$showMsg('登录失败')
        uni.$showMsg('登录成功')
        //把token保存到vuex中
        this.updateToken('fake token')
        this.navigateBack()
      },
      navigateBack() {
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.switchTab({
            url: this.redirectInfo.from,
            complete: () => {
              this.updateRedinectInfo(null)
            }
          })
        }
      }
    }
  }
  // 接口问题：只有被管理员配置为小程序的开发者以后，学生才能调用成功登录，支付这些特殊的接口。而且这个开发者权限人数只有几十个，无法给各位学生分配权限，因此会调用失败。可以先跟着视频了解如何调用这些接口
  //access_token
</script>

<style lang="scss">
  .login-container {
    height: 750rpx;
    background-color: #FBFBFB;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    &::after {
      //底部半圆
      content: '';
      display: block;
      width: 100%;
      height: 40px;
      position: absolute;
      background-color: white;
      bottom: 0;
      left: 0;
      border-radius: 100%;
      transform: translateY(50%);

    }

    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #30B1DE;
    }

    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>