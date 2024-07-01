import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// vuex
import store from "./store";

//pinia
import { createPinia, PiniaVuePlugin } from 'pinia'
import { useUserStore } from '@/store/auth/auth.js';


//scss
import "../src/scss/main.scss";

// global filter => orgnization
import "../src/filter";

Vue.config.productionTip = false;

//use pinia
Vue.use(PiniaVuePlugin)
const pinia = createPinia()

// directive
Vue.directive("font", {
  bind: function (el) {
    el.style.fontSize = `13px`;
  },
});

new Vue({
  router,
  pinia,
  store,
  render: (h) => h(App),
}).$mount("#app");

// call handleAuthStateChanged with every reload
const userStore = useUserStore();
userStore.handleAuthStateChanged();
