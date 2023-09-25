import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "../src/scss/main.scss";
// global filter => orgnization
import "../src/filter";
Vue.config.productionTip = false;

Vue.directive("font", {
  bind: function (el) {
    el.style.fontSize = `13px`;
  },
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
