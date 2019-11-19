<template>
  <nav class="col-md-2 d-none d-md-block bg-light sidebar">
    <div class="sidebar-sticky">
      <ul class="nav flex-column">
        <li class="nav-item">
          <div class="nav-link text-secondary">
            <span data-feather="home"></span>
            管理員
            <span class="sr-only">(current)</span>
          </div>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/admin/Products">
            <i class="fas fa-box-open fa-fw"></i>
            <span data-feather="file"></span>
            產品列表
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/admin/OrderList">
            <i class="fas fa-clipboard-list fa-fw"></i>
            <span data-feather="shopping-cart"></span>
            訂單列表
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/admin/Coupon">
          <i class="fas fa-ticket-alt fa-fw"></i>
            <span data-feather="users"></span>
            優惠券
          </router-link>
        </li>
      </ul>

      <h6
        class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
      >
        <span>模擬功能</span>
        <a class="d-flex align-items-center text-muted" href="#">
          <span data-feather="plus-circle"></span>
        </a>
      </h6>
      <ul class="nav flex-column mb-2">
        <li class="nav-item">
          <router-link class="nav-link" to="/customer-order">
          <i class="far fa-credit-card fa-fw"></i>
            <span data-feather="file-text"></span>
            模擬訂單
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>