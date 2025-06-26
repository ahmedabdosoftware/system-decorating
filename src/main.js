import Vue from "vue";
import App from "./App.vue";
import router from "./router";


// i18n
import i18n from "./i18n";

// Toast
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

Vue.use(Toast, {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: i18n.locale === 'ar', // ← اتجاه التوست بناءً على اللغة
});

// vuex
import store from "./store";

//pinia
import { createPinia, PiniaVuePlugin } from "pinia";
import { useUserStore } from "@/store/auth/auth.js";
// import { useTemplateSettingsStore } from "@/store/portfolio/templates/template-portfolio";

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

// Swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css' // Swiper 5

Vue.use(VueAwesomeSwiper)

new Vue({
  render: (h) => h(App),
  i18n,
  pinia,
  router,
  store,
  vuetify,
}).$mount("#app");

// call handleAuthStateChanged with every reload
const userStore = useUserStore();
userStore.handleAuthStateChanged();
