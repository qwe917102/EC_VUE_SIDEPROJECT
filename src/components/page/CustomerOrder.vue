<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <div
            style="height: 150px; background-size: cover; background-position: center"
            :style="{backgroundImage: `url(${item.imageUrl})`}"
          ></div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{ item.title }}</a>
            </h5>
            <p class="card-text">{{ item.content }}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <!-- <div class="h5">2,800 元</div> -->
              <del class="h6">原價 {{ item.origin_price }} 元</del>
              <div class="h5">現在只要 {{ item.price }} 元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click.prevent="getProduct(item.id)"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem == item.id"></i>
              查看更多
            </button>
            <button
              type="button"
              class="btn btn-outline-danger btn-sm ml-auto"
              @click.prevent="addToCart(item.id)"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem == item.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.imageUrl" class="img-fluid" alt />
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ product.content }}</p>
              <footer class="blockquote-footer text-right">{{ product.description }}</footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
              <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
              <div class="h4" v-if="product.price">現在只要 {{ product.price }} 元</div>
            </div>
            <select name class="form-control mt-3" v-model="product.num">
              <option :value="num" v-for="num in 10" :key="num">選購 {{num}} {{product.unit}}</option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計
              <strong>{{ product.num * product.price }}</strong> 元
            </div>
            <button
              type="button"
              class="btn btn-primary"
              @click="addToCart(product.id, product.num)"
            >
              <i class="fas fa-spinner fa-spin" v-if="product.id == status.loadingItem"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-7 mx-auto" v-if="cartsProduct.total > 0">
      <table class="table">
        <thead>
          <th></th>
          <th>品名</th>
          <th>數量</th>
          <th>單價</th>
        </thead>
        <tbody>
          <tr v-for="(item) in cartsProduct.carts" :key="item.id">
            <td>
              <button class="btn btn-outline-danger" @click="removeCartItem(item.id)">
                <i class="far fa-trash-alt"></i>
              </button>
            </td>
            <td>
              <span>{{ item.product.title }}</span>
              <div class="text-success">優惠券以套用</div>
            </td>
            <td class="text-right">{{ item.qty}}</td>
            <td class="text-right">{{ item.total }}</td>
          </tr>
          <tr>
            <td colspan="3" class="text-right">總計</td>
            <td class="text-right">{{ cartsProduct.total }}</td>
          </tr>
          <tr class="text-success" v-if="cartsProduct.total !== cartsProduct.final_total">
            <td colspan="3" class="text-right">折扣價</td>
            <td class="text-right">{{ cartsProduct.final_total }}</td>
          </tr>
        </tbody>
      </table>
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="請輸入優惠碼"
          aria-label="Recipient's username"
          aria-describedby="button-addon2"
        />
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" id="button-addon2">套用優惠碼</button>
        </div>
      </div>
    </div>
    <div class="my-5 row justify-content-center">
      <form class="col-md-6" @submit.prevent="createOrder">
        <div class="form-group">
          <label for="useremail">Email</label>
          <input
            type="email"
            class="form-control"
            name="email"
            id="useremail"
            placeholder="請輸入 Email"
            required
          />
          <span class="text-danger"></span>
        </div>

        <div class="form-group">
          <label for="username">收件人姓名</label>
          <input type="text" class="form-control" name="name" id="username" placeholder="輸入姓名" />
          <span class="text-danger"></span>
        </div>

        <div class="form-group">
          <label for="usertel">收件人電話</label>
          <input type="tel" class="form-control" id="usertel" placeholder="請輸入電話" />
        </div>

        <div class="form-group">
          <label for="useraddress">收件人地址</label>
          <input
            type="text"
            class="form-control"
            name="address"
            id="useraddress"
            v
            placeholder="請輸入地址"
          />
          <span class="text-danger">地址欄位不得留空</span>
        </div>

        <div class="form-group">
          <label for="comment">留言</label>
          <textarea name id="comment" class="form-control" cols="30" rows="10"></textarea>
        </div>
        <div class="text-right">
          <button class="btn btn-danger">送出訂單</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      products: [],
      product: {},
      cartsProduct: {},
      status: {
        loadingItem: ""
      },
      isLoading: false,
      couponCode: "",
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: ""
        },
        message: ""
      }
    };
  },
  methods: {
    getProducts() {
      //取得遠端商品資訊
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        console.log(response.data);
        vm.isLoading = false;
        vm.products = response.data.products;
      });
    },
    getProduct(id) {
      //取得單一商品資訊
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
      const vm = this;
      vm.status.loadingItem = id;
      this.$http.get(api).then(response => {
        // console.log(response.data);
        vm.status.loadingItem = "";
        vm.product = response.data.product;
        $("#productModal").modal("show");
      });
    },
    addToCart(id, qty = 1) {
      //送出購買商品資訊
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const vm = this;
      const cart = {
        product_id: id,
        qty
      };
      vm.status.loadingItem = id;
      this.$http.post(api, { data: cart }).then(response => {
        // console.log(response.data);
        vm.status.loadingItem = "";
        vm.getCart();
        // vm.product = response.data.product;
        $("#productModal").modal("hide");
      });
    },
    getCart() {
      //取得購物車資訊
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        // console.log(response.data.data);
        vm.isLoading = false;
        vm.cartsProduct = response.data.data;
      });
    },
    removeCartItem(id) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      const vm = this;
      vm.isLoading = true;
      this.$http.delete(api).then(response => {
        // console.log(response.data.data);
        vm.getCart();
        vm.isLoading = false;
      });
    },
    addCouponCode() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
      const vm = this;
      const coupon = {
        code: vm.couponCode
      };
      vm.isLoading = true;
      this.$http.post(api, { data: coupon }).then(response => {
        console.log(response);
        if (response.data.success) {
          vm.$bus.$emit("message:push", "優惠券已成功套用", "success");
        } else {
          vm.$bus.$emit(
            "message:push",
            "優惠券套用失敗,請確認優惠券代碼",
            "danger"
          );
        }
        vm.getCart();
        vm.isLoading = false;
      });
    },
    createOrder() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;
      const vm = this;
      const order = vm.form;
      //   vm.isLoading = true;
      this.$http.post(api, { data: order }).then(response => {
        console.log(response);
        // vm.getCart();
        // vm.isLoading = false;
      });
    }
  },
  created() {
    this.getProducts();
    this.getCart();
  }
};
</script>