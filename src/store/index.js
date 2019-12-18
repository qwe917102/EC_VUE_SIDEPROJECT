import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false,
    products: [],
    coupons: {},
  },
  actions: {
    getCoupon(context) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons`;
      axios.get(api).then((response) => {
        // console.log(response);
        context.commit('GETCOUPON', response.data.coupons);
      });
    },
    upLoading(context, payload) {
      context.commit('LOADING', payload);
    },
    getProducts(context) {
      // 取得遠端商品資訊
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`;
      context.commit('LOADING', true);
      axios.get(api).then((response) => {
        // console.log(response.data);
        context.commit('LOADING', false);
        context.commit('PRODUCT', response.data.products);
      });
    },
  },
  mutations: {
    GETCOUPON(state, payload) {
      state.coupons = payload;
    },
    LOADING(state, payload) {
      state.isLoading = payload;
    },
    PRODUCT(state, payload) {
      state.products = payload;
    },
  },
  getters: {
    coupons: state => state.coupons,
  },
});
