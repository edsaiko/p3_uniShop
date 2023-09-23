<template>
  <view>
    <view class="search-box">
      <!-- 输入处理 圆角 隐藏取消按钮 -->
      <uni-search-bar @input="input" :radius="100" cancel-button="none"></uni-search-bar>
    </view>
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResult.length !==0">
      <view class="sugg-item" v-for="(item,i) in searchResult" :key="i" @click="goToDetail(item)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clean"></uni-icons>
      </view>
      <!-- 列表区 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item,i) in histories" :key="i" 
        @click="goToGoodsList(item)">
        </uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        timer: null,
        kw: '',
        searchResult: [], //搜索的结果列表
        historyList: [], //搜索栏历史记录
      };
    },
    onLoad(){
      this.historyList=JSON.parse(uni.getStorageSync('kw')||'[]')
    },
    methods: {
      //input输入事件的处理函数
      input(e) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.kw = e
          this.getSearchList()
        }, 500)
      },
      async getSearchList() {
        if (this.kw.length === 0) {
          this.searchResult = []
          return
        }
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.kw
        })
        if (res.meta.status !== 200) return uni.$showMsg()
        this.searchResult = res.message

        this.saveSearchHistory()
      },
      goToDetail(item) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      },
      saveSearchHistory() {
        // this.historyList.push(this.kw)
        //使用set的集合机制
        const set = new Set(this.historyList)
        //新关键词放栈顶
        set.delete(this.kw)
        set.add(this.kw)
        //把set转化为数组
        this.historyList = Array.from(set)
        
        //把搜索历史存到本地存储,直接自动就是顺序集合的存储机制
        //之前的保留原数组，计算逆序输出，因为是为了和本地存储一致
        uni.setStorageSync('kw',JSON.stringify(this.historyList))
      },
      clean(){
        //清空搜索历史
        this.historyList=[]
        uni.setStorageSync('kw','[]')
      },
      goToGoodsList(){
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?query='+kw
          })
      },
    },
    computed: {
      histories() {
        //逆序
        return [...this.historyList].reverse()
      }
    },
  }
</script>

<style lang="scss">
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }

  .sugg-list {
    padding: 0 5px;

    .sugg-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;

      .goods-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .history-box {
    padding: 0 5px;

    .history-title {
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }

    .history-list {
      display: flex;
      flex-wrap: wrap;

      // uni-app组件自带的类
      .uni-tag {
        display: block;
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>