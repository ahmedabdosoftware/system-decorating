<template>
  <header class="header-app" :class="[{ scrolled: isScrolled, 'dark-mode-header': getDarkMode }]">
    <div :class="{ 'dark-mode': getDarkMode }">
      <div class="cont-threeLines">
        <img
          v-on:click="appearMenue()"
          class="threeLines"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDcuD37EZ7RcuSCK-xgiviaswyxNkGoXYggQ&usqp=CAU"
        />
      </div>
      <!-- Search Input -->
      <div class="search-container">
        <img class="icon-search" :src="require('@/assets/icons/search.png')" />
        <input type="text" placeholder="Search" />
        <button class="shortcut">⌘K</button>
      </div>
    </div>
    <div>
      <!-- shop link  -->
      <!-- <div class="icon-noti">
        <a href="https://ahmedabdosoftware.github.io/websiteUpdated-DSD/">
          <img
              class="icon "
              :src="require('@/assets/icons/shop.png')"   
          />
        </a>
      </div> -->

      <!-- langauge  -->
      <div class="icon-noti">
        <!-- <font-awesome-icon class="icon" icon="globe" /> -->
        <!-- <img
            class="icon talk"
            :src="require('@/assets/icons/talk_2.png')"   
        /> -->
        <img class="icon" :src="require('@/assets/icons/langauge.png')" />
      </div>
      <!-- Dark mode  -->
      <div class="icon-noti dark-mode-icon-cont">
        <img
          class="icon dark-mode-icon"
          :src="require('@/assets/icons/dark-mode.png')"
        />
      </div>
      <!-- active  -->
      <div class="icon-noti">
        <img class="icon" :src="require('@/assets/icons/active.png')" />
      </div>
      <!-- Profile  -->
      <div class="profile_header">
        <img src="https://i.pravatar.cc/300" alt="User Profile" />
        <span class="status-dot"></span>
      </div>
    </div>
  </header>
</template>
<script>
// import router from "./router";
export default {
  name: "HeaderAdmin",
  data() {
    return {
      isScrolled: false,
    };
  },

  methods: {
    appearMenue() {
      document.getElementById("sidebar").style.cssText = "left:0%;";
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 10;
    },
  },
  computed: {
    getDarkMode() {
      return this.$store.state.darkMode;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style scoped lang="scss">
.header-app {
  width: 100%;
  height: 63px;
  background-color: #f7f7f9;
  // background-color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0px;
  z-index: 2;
  transition: box-shadow 0.3s ease, border-radius 0.3s ease;

  // border-bottom: 2px solid rgb(215, 213, 213);
}
.header-app.scrolled {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}
.header-app > div:nth-child(1) {
  min-width: 28%;
  height: 40px;
  // background-color: black;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 4px;
  margin-left: 15px;
  > div:first-child {
    width: 20px;
    height: 20px;
    // background-color: white;
    border-radius: 10px;
  }
  > div:nth-child(2) {
    display: flex;
    align-items: center;
    width: 70%;
    height: 100%;
    border-radius: 5px;
    margin-left: 20px;

    img {
      width: 20%;
      height: 30px;
      mix-blend-mode: multiply;
    }
    input {
      border-radius: 5px;
      width: 80%;
      height: 100%;
      padding-left: 10px;
      border: none;
    }
    input:focus {
      outline: none;
    }
  }
}
.header-app > div:nth-child(2) {
  width: 170px;
  height: 100%;
  // background-color: red;
  display: flex;
  flex-direction: row !important;
  justify-content: space-evenly;
  align-items: center;
}
.icon-noti {
  width: 20px;
  height: 20px;
  // background-color: white;
  border-radius: 10px;
}
.icon {
  width: 20px;
  height: 20px;
}

.talk {
  width: 23px;
  height: 23px;
}

.dark-mode-icon {
  width: 23px;
  height: 23px;
}
.threeLines {
  width: 20px;
  height: 20px;
  display: none;
}
.cont-threeLines {
  display: none;
}

/* Search Container */
.search-container {
  display: flex;
  flex-direction: row !important;
  align-items: center !important;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 5px 10px;
  width: 250px;
  margin-right: 15px;

  .icon-search {
    width: 20px !important;
    height: 20px !important;
  }
}

/* Profile Section */
.profile_header {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.profile_header img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background-color: #28a745;
  border: 2px solid #ffffff;
  border-radius: 50%;
}

@media print {
  .header-app {
    display: none;
  }
}

/* media => ipad */
@media (max-width: 821px) {
  .header-app {
    width: 100%;
    right: 0%;
  }
  .threeLines {
    display: block;
  }
  .cont-threeLines {
    display: block;
  }
}
// phone
@media (max-width: 477px) {
  .header-app {
    > div:first-child {
      // background-color: darkcyan;
      > div:nth-child(2) {
        // background-color: red;
        width: 170px !important;
      }
      > div:nth-child(1) {
        // background-color: aqua;
      }
    }
  }
  .dark-mode-icon-cont {
    display: none;
  }
}
</style>
