<template>
  <div id='app'>
    <router-view />
    <loading :active.sync="isLoading"></loading>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    isLoading() {
      return this.$store.state.isLoading;
    },
  },
};
</script>

<style lang='scss'>
@import './assets/all';
// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
//   margin-top: 60px;
// }
</style>
