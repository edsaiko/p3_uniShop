export default {
  namespaced: true,

  state: () => ({
    //购物车数组，存储购物车中每个商品的信息对象
    //每个商品的信息对象，包含如下6个属性
    //{goods_id,goods_name,goods_price,goods_count,goods_small_logo,goods_state}
    cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
  }),
  mutations: {
    addToCart(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      console.log(findResult)
      if (!findResult) {
        state.cart.push(goods)
      } else {
        console.log('else')
        findResult.goods_count++
      }
      console.log(state.cart)
      this.commit('m_cart/saveToStorage')
    },
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 更新购物车中商品的勾选状态
    updateGoodsState(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_state = goods.goods_state
        this.commit('m_cart/saveToStorage')
      }
    },
    //更新商品数量
    updateGoodsCount(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_count = goods.goods_count
        this.commit('m_cart/saveToStorage')
      }
    },
    //根据Id 删除对应的商品
    removeGoodsByID(state, goods_id) {
      state.cart = state.cart.filter(x => x.goods_id !== goods_id)
      this.commit('m_cart/saveToStorage')
    },
    //购物车商品选中状态跟随全选按钮
    updateAllGoodsState(state, newState) {
      state.cart.forEach(x => x.goods_state = newState)
      this.commit('m_cart/saveToStorage')
    }
  },
  getters: {
    total(state) {
      //计算返回商品的总数量
      // let c = 0
      // state.cart.forEach(x => c += x.goods_count)
      // return c
      return state.cart.reduce((total, item) =>
        total += item.goods_count, 0)
    },
    checkedCount(state) {
      //js的运用，勾选商品求和
      return state.cart.filter(x => x.goods_state)
        .reduce((total, item) => total += item.goods_count, 0)
    },
    checkedGoodsAmount(state) {
      return state.cart.filter(x => x.goods_state).reduce((total, item) => 
      total += item.goods_count * item.goods_price, 0).toFixed(2)
    }
  }
}