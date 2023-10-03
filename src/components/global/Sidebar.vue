<template>
  <div id="sidebar" class="sidebar">
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
          class="loggo"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTUgxG9z03WuK9OPQ64aptvJjEyyPz2Cnhcw&usqp=CAU"
        />
        <span v-on:click="disappear()" class="x">x</span>
      </div>
      <div class="links">
        <div :class="{ 'dark-mode-content': getDarkMode }">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2srGxhD6w3lhTN62veAyoSsFyIbdbjYQQUQ&usqp=CAU"
          />
          <div :class="{ 'dark-mode-content': getDarkMode }">
            <p class="link">dashboard</p>
          </div>
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
          <router-link to="/">
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
        <div :class="{ 'dark-mode-content': getDarkMode }" class="log-out">
          <div
            :class="{ 'dark-mode-content': getDarkMode }"
            class="profile-cont"
          >
            <div class="contImge">
              <img
                class="profile"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlo1-fGoWrSZLpqx-_GVEOJJRTi3xtkFdl6Q&usqp=CAU"
              />
            </div>
          </div>
          <div
            class="log-out-word"
            :class="{ 'dark-mode-content': getDarkMode }"
          >
            <p class="link">log out</p>
          </div>
          <img
            class="log"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRebt6fBmYJPznKOuWjagvttAYLUb0XE9j-9A&usqp=CAU"
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
    disappear() {
      document.getElementById("sidebar").style.cssText = "left:-100%;";
    },
  },
};
</script>

<style lang="scss">
.sidebar {
  width: 15%;
  height: 100vh;
  background-color: rgb(238, 232, 232);
  // background-color: rgb(205, 133, 133);
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
  height: 63px;
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
    height: 63px;
    margin-bottom: 2px;
    background-color: white;
    display: flex;
    align-items: center;
    cursor: pointer;
    > img:first-child {
      width: 35px;
      height: 35px;
      margin-left: 20px;
    }
    img:nth-of-type(2) {
      width: 20px;
      height: 20px;
      margin-left: 30px;
    }
    .profile-cont {
      width: 70px;
      height: 50px;
      // background-color: salmon;
      .contImge {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        background-color: white;
        margin-left: 20px;
        margin-top: 6px;
        .profile {
          width: 100%;
          height: 100%;
          border-radius: 20px;
          margin-left: 0px;

        }
      }
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
.log-out {
  margin-top: 20px;
  position: relative;
}
.log-out::after {
  content: "";
  position: absolute;
  top: -10px;
  left: 0px;
  width: 100%;
  height: 1px;
  background-color: rgb(181, 181, 182);
}
.log {
  width: 35px;
  height: 35px;
}

.log-out-word {
  width: 100px !important;
  p {
    padding-left: 5px !important;
  }
}
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
.x {
  width: 35px;
  height: 35px;
  display: none;
  background-color: rgb(200, 199, 199);
  margin-left: 70px;
  text-align: center;
  line-height: 35px;
  font-size: 22px;
  text-transform: capitalize;
  border-radius: 17.5px;
}
/* media => ipad */
@media (max-width: 821px) {
  .sidebar {
    left: -100%;
    transition: 0.5s;
    z-index: 4;
    width: 35vw;
    top: 0px;
  }
  .x {
    display: block;
  }
  .loggo {
    display: none;
  }
}
// phone
@media (max-width: 477px) {
  .sidebar {
    width: 60vw !important;
  }
}
</style>
