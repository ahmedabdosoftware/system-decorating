import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// vuex
import store from "./store";

//pinia
import { createPinia, PiniaVuePlugin } from "pinia";
import { useUserStore } from "@/store/auth/auth.js";

//plugins

//FontAwesomeIcon
import FontAwesomeIcon from "./plugins/fontawesome";
Vue.component("font-awesome-icon", FontAwesomeIcon);

// Vuetify
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";

Vue.use(Vuetify);

//scss
import "../src/scss/main.scss";

// global filter => orgnization
import "../src/filter";

Vue.config.productionTip = false;

//use pinia
Vue.use(PiniaVuePlugin);
const pinia = createPinia();

// vee-validate
import { ValidationObserver, ValidationProvider } from "vee-validate";
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);

// directive
Vue.directive("font", {
  bind: function (el) {
    el.style.fontSize = `13px`;
  },
});

// إنشاء Vuetify instance
const vuetify = new Vuetify();

new Vue({
  render: (h) => h(App),
  pinia,
  router,
  store,
  vuetify,
}).$mount("#app");

// call handleAuthStateChanged with every reload
const userStore = useUserStore();
userStore.handleAuthStateChanged();
