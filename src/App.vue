<template>
  <div :class="{ 'dark-mode': getDarkMode }" id="app">
    <!-- header component -->
    <HeaderAdmin></HeaderAdmin>
    <!-- Sidebar component -->
    <Sidebar></Sidebar>
    <router-view class="content-view" :class="{ 'dark-mode': getDarkMode }"  />
  </div>
</template>

<script>
import HeaderAdmin from "../src/components/global/HeaderAdmin.vue";
import Sidebar from "../src/components/global/Sidebar.vue";
export default {
  name: "App",
  components: {
    HeaderAdmin,
    Sidebar,
  },
  computed: {
    getDarkMode() {
      return this.$store.state.darkMode;
    },
  },
  // router,
};
</script>

<style scoped lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  min-height: 800px;
  // background-color: antiquewhite;
}

.content-view {
  min-height: 600px;
  background-color: #f9f7f7;
  margin-left: 15%;
  box-sizing: border-box;
}
.dark-mode {
  // background-color: rgb(237, 93, 93) !important;
  background-color: rgb(19, 19, 19);
}
</style>
