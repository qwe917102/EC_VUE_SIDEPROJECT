<template>
  <div>
    <div class="text-right my-3">
      <button class="btn btn-primary" @click="openModal(true)">新增優惠券</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>優惠券名稱</th>
          <th>優惠碼</th>
          <th>折扣百分比</th>
          <th>狀態</th>
          <th>到期日</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in coupons" :key="key">
          <td>{{ item.title }}</td>
          <td>{{ item.code }}</td>
          <td>{{ item.percent }}%</td>
          <td>
            <span v-if="item.is_enabled" :true-value="1" :false-value="0">已啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>{{ item.due_date | date }}</td>
          <td>
            <button class="btn btn-outline-primary" @click="openModal(false, item)">編輯</button>
            <button class="btn btn-outline-danger" @click="openDeleteModal(item)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      class="modal fade"
      id="couponCreateModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel" v-if="isNew">添加優惠券</h5>
            <h5 class="modal-title" id="exampleModalLabel" v-else>編輯優惠券</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="col-12 my-2">
            <label for="title">優惠券名稱</label>
            <input
              class="form-control"
              id="title"
              type="text"
              placeholder="輸入優惠券名稱"
              v-model="tempcoupon.title"
            />
          </div>
          <div class="col-12 my-2">
            <label for="percent">折扣百分比</label>
            <input
              class="form-control"
              id="percent"
              type="text"
              placeholder="輸入折扣幅度"
              v-model="tempcoupon.percent"
            />
          </div>
          <div class="col-12 my-2">
            <label for="due_date">到期日</label>
            <input class="form-control" id="due_date" type="date" v-model="due_date" />
          </div>
          <div class="col-12 my-2">
            <label for="code">優惠碼</label>
            <input
              class="form-control"
              id="code"
              type="text"
              placeholder="設定優惠代碼"
              v-model="tempcoupon.code"
            />
          </div>
          <div class="col-12 my-2">
            <input
              id="is_enabled"
              type="checkbox"
              name
              v-model="tempcoupon.is_enabled"
              :true-value="1"
              :false-value="0"
            />
            <label for="is_enabled" v-if="!tempcoupon.is_enabled">未啟用</label>
            <label for="is_enabled" v-else>已啟用</label>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal">取消</button>
            <button
              type="button"
              class="btn btn-primary"
              @click="updateCoupon()"
              v-if="isNew">新增</button>
            <button
            type="button"
            class="btn btn-primary"
            @click="updateCoupon()"
            v-else>確認修改</button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">刪除優惠券</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">確定要刪除此張優惠券嗎？</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="deletedItem()">確定</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      tempcoupon: {
        title: '',
        is_enabled: 0,
        percent: 100,
        due_date: 0,
        code: '',
      },
      due_date: new Date(),
      isNew: false,
    };
  },
  watch: {
    due_date() {
      const vm = this;
      const timestamp = Math.floor(new Date(vm.due_date) / 1000);
      vm.tempcoupon.due_date = timestamp;
    },
  },
  methods: {
    getCoupon() {
      this.$store.dispatch('getCoupon');
    },
    openModal(isNew, item) {
      const vm = this;
      vm.isNew = isNew;
      $('#couponCreateModal').modal('show');
      if (vm.isNew) {
        vm.tempcoupon = {};
      } else {
        vm.tempcoupon = Object.assign({}, item);
      }
    },
    updateCoupon() {
      const vm = this;
      if (vm.isNew) {
        const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
        this.$http.post(api, { data: vm.tempcoupon }).then(() => {
          // console.log(response.data);
          $('#couponCreateModal').modal('hide');
          vm.getCoupon();
          vm.$bus.$emit('message:push', '優惠券已成功添加', 'success');
        });
      } else {
        const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempcoupon.id}`;
        this.$http.put(api, { data: vm.tempcoupon }).then(() => {
          // console.log(response.data);
          $('#couponCreateModal').modal('hide');
          vm.getCoupon();
          vm.$bus.$emit('message:push', '優惠券資訊修改完成', 'success');
        });
      }
    },
    openDeleteModal(item) {
      $('#deleteModal').modal('show');
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons`;
      this.$http.get(api).then(() => {
        vm.tempcoupon = Object.assign({}, item);
        // console.log(response.data);
        //   $("#couponCreateModal").modal("hide");
        //   vm.getCoupon();
      });
    },
    deletedItem() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempcoupon.id}`;
      this.$http.delete(api).then(() => {
        // console.log(response.data);
        $('#deleteModal').modal('hide');
        vm.getCoupon();
        vm.$bus.$emit('message:push', '優惠券已成功刪除', 'success');
      });
    },
  },
  computed: {
    ...mapGetters(["coupons"]),
  },
  created() {
    this.getCoupon();
  },
};
</script>
