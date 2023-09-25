import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // start with normal mode
    darkMode: false,
    mood: "normal",
  },
  mutations: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      if (state.darkMode == true) {
        state.mood = "dark";
      }else {
        state.mood = "normal";
      }
    },
  },
  actions: {},
  modules: {},
});
