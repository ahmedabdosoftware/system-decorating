<template>
  <div class="sidebar">
    <div :class="{ 'dark-mode-content': getDarkMode }" class="content">
      <div :class="{ 'dark-mode-header': getDarkMode }" class="header">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeyjanmXwnnw7x5aS6nIg_ssKuT1kC0RgjkA&usqp=CAU"
        />
        <div>
          <p>admin</p>
          <p>locascanstyle</p>
        </div>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTUgxG9z03WuK9OPQ64aptvJjEyyPz2Cnhcw&usqp=CAU"
        />
      </div>
      <div class="links">
        <div :class="{ 'dark-mode-content': getDarkMode }">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2srGxhD6w3lhTN62veAyoSsFyIbdbjYQQUQ&usqp=CAU"
          />
          <router-link to="/">
            <p class="link">dashboard</p>
          </router-link>
          <img
            class="arrow"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl6Jx0lu0D-qLbrrZtaMbMhb54XRiQHabqH9kXIesQhzX1fPbcM5O6OvGZzxZE9qqhHgM&usqp=CAU"
          />
        </div>
        <div :class="{ 'dark-mode-content': getDarkMode }">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLiqfpqLBM2Kj32rBRpIeMKImhTVpHbmd7FA&usqp=CAU"
          />
          <!-- Reviews -->
          <router-link to="/Product">
            <p class="link">products</p>
          </router-link>
          <img
            class="arrow"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl6Jx0lu0D-qLbrrZtaMbMhb54XRiQHabqH9kXIesQhzX1fPbcM5O6OvGZzxZE9qqhHgM&usqp=CAU"
          />
        </div>
        <div :class="{ 'dark-mode-content': getDarkMode }">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrlQuPMstROyoT6gk3SvbEq1iSTS5pFPItmw&usqp=CAU"
          />
          <div :class="{ 'dark-mode-content': getDarkMode }">
            <p class="link">orders</p>
          </div>
          <img
            class="arrow"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl6Jx0lu0D-qLbrrZtaMbMhb54XRiQHabqH9kXIesQhzX1fPbcM5O6OvGZzxZE9qqhHgM&usqp=CAU"
          />
        </div>

        <div :class="{ 'dark-mode-content': getDarkMode }">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTa4sZNYJaNSGf_dcep8Itrl0e87vLvtaYVQ&usqp=CAU"
          />
          <router-link to="/Category">
            <p class="link">catogery</p>
          </router-link>
          <img
            class="arrow"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl6Jx0lu0D-qLbrrZtaMbMhb54XRiQHabqH9kXIesQhzX1fPbcM5O6OvGZzxZE9qqhHgM&usqp=CAU"
          />
        </div>
        <div :class="{ 'dark-mode-content': getDarkMode }">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK5SVZyPZ9FutKKbuGHMdONvMIjDyLdKBgIA&usqp=CAU"
          />
          <div :class="{ 'dark-mode-content': getDarkMode }">
            <p class="link">hot offeer</p>
          </div>
          <img
            class="arrow"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl6Jx0lu0D-qLbrrZtaMbMhb54XRiQHabqH9kXIesQhzX1fPbcM5O6OvGZzxZE9qqhHgM&usqp=CAU"
          />
        </div>
        <div :class="{ 'dark-mode-content': getDarkMode }" class="reveiws">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxfoGlgf3gYPBvGM0Cx1Aef5jtxAoXlhB7KQ&usqp=CAU"
          />
          <router-link class="" to="/Reviews">
            <p class="link">reveiws</p>
          </router-link>
          <img
            class="arrow"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl6Jx0lu0D-qLbrrZtaMbMhb54XRiQHabqH9kXIesQhzX1fPbcM5O6OvGZzxZE9qqhHgM&usqp=CAU"
          />
        </div>
        <div :class="{ 'dark-mode-content': getDarkMode }" class="theme">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxGbVv52K780Hx6qydYtIvoXy9NTiaCLqixA&usqp=CAU"
          />
          <div :class="{ 'dark-mode-content': getDarkMode }">
            <p @click="theme()" class="link theme">theme</p>
            <p v-font :class="{ mood: getDarkMode }">{{ mood }}</p>
          </div>
          <img
            class="arrow"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl6Jx0lu0D-qLbrrZtaMbMhb54XRiQHabqH9kXIesQhzX1fPbcM5O6OvGZzxZE9qqhHgM&usqp=CAU"
          />
        </div>
        <div :class="{ 'dark-mode-content': getDarkMode }" class="setting">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_XSDJ3W3SotE-UCiHeXCP5IjlGvMy4HSoyw&usqp=CAU"
          />
          <div :class="{ 'dark-mode-content': getDarkMode }">
            <p class="link">setting</p>
          </div>
          <img
            class="arrow"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl6Jx0lu0D-qLbrrZtaMbMhb54XRiQHabqH9kXIesQhzX1fPbcM5O6OvGZzxZE9qqhHgM&usqp=CAU"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // discPage: "this is sidbar",
    };
  },
  name: "Sidebar",
  computed: {
    getDarkMode() {
      return this.$store.state.darkMode;
    },
    mood() {
      return this.$store.state.mood;
    },
  },
  methods: {
    theme() {
      this.$store.commit("toggleDarkMode");
    },
    // cliked(index) {
    // let sidbar = document.querySelectorAll(".links >div");
    // sidbar.forEach((element) => {
    //   // nothing => 6
    //   if (index == 6) {
    //     console.log("nothing");
    //   } else {
    //     element.classList.remove("cliked");
    //     element.children[1].classList.remove("cliked");
    //     element.children[1].children[0].classList.remove("active");
    //   }
    // });
    // // nothing => 6
    // if (index == 6) {
    //   console.log("nothing");
    // } else {
    //   // normal mood
    //   if (this.getDarkMode == false) {
    //     sidbar[index].classList.add("cliked");
    //     sidbar[index].children[1].classList.add("cliked");
    //   }
    //   sidbar[index].children[1].children[0].classList.add("active");
    // }
    // if (index == 6) {
    //   this.$store.commit("toggleDarkMode");
    // }
    // },
  },
};
</script>

<style lang="scss">
.sidebar {
  width: 15%;
  height: 100vh;
  background-color: rgb(238, 232, 232);
  background-color: rgb(205, 133, 133);
  position: fixed;
  left: 0px;
  top: 0px;
}
.sidebar > div {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  display: flex;
  flex-wrap: wrap;
  background-color: white;
  // background-color: rgb(205, 133, 133);
}
.header {
  width: 100%;
  height: 10%;
  // background-color: firebrick;
  display: flex;
  align-items: center;
  border-bottom: 2px solid rgb(215, 213, 213);
  div {
    width: 30%;
    height: 100%;
    // background-color: rebeccapurple;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    p:first-child {
      color: blue;
      text-transform: capitalize;
      font-size: 18px;
      font-weight: 600;
      font-family: Arial, Helvetica, sans-serif;
    }
    p:nth-child(2) {
      font-size: 10px;
      color: rgb(121, 120, 120);
    }
  }
  img {
    width: 40px;
    height: 100%;
  }
  img:first-child {
    margin-left: 5px;
  }
  img:nth-child(3) {
    margin-left: 60px;
  }
}
.links {
  width: 100%;
  height: 90%;
  // background-color: skyblue;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  div:hover {
    background-color: rgb(220, 220, 245);
  }
  div:hover > div {
    background-color: rgb(220, 220, 245);
  }
  div {
    position: relative;
    border-radius: 5px;
    width: 100%;
    height: 10%;
    margin-bottom: 2px;
    background-color: white;
    display: flex;
    align-items: center;
    cursor: pointer;
    img:first-child {
      width: 35px;
      height: 35px;
      margin-left: 20px;
    }
    img:nth-of-type(2) {
      width: 20px;
      height: 20px;
      margin-left: 30px;
    }
    div {
      p {
        font-size: 17px;
        text-transform: capitalize;
        padding-left: 6px;
        font-weight: 600;
        cursor: pointer;
        // color:rgb(121, 120, 120);
      }
    }
  }
}
.arrow {
  position: absolute;
  right: 10px;
  width: 15px !important;
  height: 15px !important;
}
// .router-link-exact-active {
//   p {
//     color: blue;
//   }
//   // background-color: rgb(175, 175, 243);
// }
// .theme {
//   margin-top: 20px;
// }
// .reveiws {
//   border-bottom: 1px solid rgb(149, 147, 147);
//   height: 14% !important;
//   // background-color: red !important;
//   img,
//   p {
//     margin-bottom: 18px;
//   }
//   img:first-child {
//     width: 50px !important;
//     height: 50px !important;
//   }
// }
.setting {
  border-top: 1px solid rgb(149, 147, 147);
}
// .cliked {
//   background-color: rgb(220, 220, 245) !important;
// }
// .active {
// color: blue !important;
// }
.router-link-exact-active {
  p {
    color: blue !important;
  }
}
.dark-mode-header {
  border-bottom: 2px solid rgb(26, 26, 26) !important;
}
.dark-mode-content {
  background-color: black !important;
}
.links-div {
  background-color: black !important;
}
.moodd {
  font-size: 13px;
}
.mood {
  color: white;
}
</style>
