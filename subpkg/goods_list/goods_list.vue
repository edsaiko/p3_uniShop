<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods,i) in goodsList" :key="i" @click="goToDetail(goods)">
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        //请求参数对象
        queryObj: {
          query: '',
          cid: '',
          pagenum: 1,
          pagesize: 10
        },
        goodsList: [],
        total: 0,
        isLoading: false, //节流阀
      };
    },
    onLoad(options) {
      //传入的options中带有传入的参数，这里的vue要回顾一下
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''

      this.getGoodsList()
    },
    methods: {
      //获取商品列表数据
      async getGoodsList(cb) {
        this.isLoading = true
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        this.isLoading = false

        cb && cb()
        if (res.meta.status !== 200) return uni.$showMsg()
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
      },
      goToDetail(goods){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id='+goods.goods_id
        })
      }
    },
    onReachBottom() {
      if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg("银子：哪有这么多商品啊这年头")
      if (this.isLoading) return
      //让页码值自增1
      this.queryObj.pagenum++
      this.getGoodsList()
    },
    onPullDownRefresh() {
      //重置关键数据
      this.queryObj.pagenum = 1
      this.total = 0
      this.isLoading = false
      this.goodsList = []
      //重新发起数据请求,传了一个停止下拉刷新的函数
      this.getGoodsList(() => uni.stopPullDownRefresh())
    }
  }
</script>

<style lang="scss">

</style>