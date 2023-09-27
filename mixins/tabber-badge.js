import { mapGetters } from 'vuex'

export default{
  computed:{
    ...mapGetters('m_cart',['total'])
  },
  watch:{
    total(){
      this.setBadge()
    }
  },
  onShow(){
    this.setBadge()
  },
  methods:{
    setBadge(){
      uni.setTabBarBadge({
        index:2,
        text:this.total+''//加上一个字符串转换为字符串，text只能为字符串
      })
    }
  }
}