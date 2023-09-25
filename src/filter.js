import Vue from "vue";
Vue.filter("sub", function (text) {
  return text.substring(0, 35) + "...";
});
