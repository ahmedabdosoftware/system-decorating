<template>
  <!-- /* eslint-disable */ -->
  <div class="category">
    <div class="title">
      <div>
        <div class="contTitle">
          <div>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfifgpU6f6DdemdITBpg_essXRVuwWFaTnhJgl9QGDvchprPgRpZFDLgAZhDRlBiYvEd8&usqp=CAU"
            />
          </div>
          <p :class="{ 'dark-mode-title': getDarkMode }">category grid</p>
        </div>
        <div>
          <div class="export">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmvEXj1Sr-tzeKuEP9PgzajIUDvR_-L-zfkg&usqp=CAU"
            />
            <button>export</button>
          </div>
          <router-link to="/addcatagory">
            <button class="add">+ add catagory</button>
          </router-link>
        </div>
      </div>
      <div :class="{ 'dark-mode-box': getDarkMode }">
        <input
          :class="{ 'dark-mode-search': getDarkMode }"
          placeholder="search"
          type="search"
        />
        <div :class="{ 'dark-mode-box': getDarkMode }">
          <div>
            <button>category</button>
            <img
              class="arroow"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl6Jx0lu0D-qLbrrZtaMbMhb54XRiQHabqH9kXIesQhzX1fPbcM5O6OvGZzxZE9qqhHgM&usqp=CAU"
            />
          </div>
          <div>
            <button>last aded</button>
            <img
              class="arroow aded"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_HHn9uGD0sPLHcGzdjI_WX8Au22ap-x1b1Q&usqp=CAU"
            />
          </div>
        </div>
      </div>
    </div>
    <div :class="{ 'dark-mode-box': getDarkMode }" class="allContent">
      <div v-for="category in categories" :key="category.id">
        <BoxCatogery
          v-on:update="fetchData()"
          :category="category"
        ></BoxCatogery>
      </div>
    </div>
    <div id="loader">
      <div class="lds-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import BoxCatogery from "@/components/global/BoxCatogery.vue";
export default {
  name: "Category",
  components: {
    BoxCatogery,
  },
  methods: {
    // ============loader => start=============================================
    loaderToggle: function (show) {
      let loader = document.getElementById("loader");
      if (show) {
        loader.style.visibility = "visible";
      } else {
        loader.style.visibility = "hidden";
      }
    },
    // ============loader => end=============================================
    fetchData() {
      this.loaderToggle(true);
      axios
        .get("https://api.escuelajs.co/api/v1/categories")
        .then((res) => {
          console.log(res.data);
          this.categories = res.data;
          this.loaderToggle(false);
        })
        .catch((error) => {
          this.loaderToggle(false);
          console.log(error);
        });
    },
  },
  computed: {
    getDarkMode() {
      return this.$store.state.darkMode;
    },
  },
  data() {
    return {
      categories: [],
      staticCategories: [
        {
          name: "summer collection",
          kind: "keyboard",
          price: 498,
          key: 1,
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB8CyDKJBg1Idxh1pQV0BwaSeZE3Z7u1M5tA&usqp=CAU",
        },
        {
          name: "summer collection",
          kind: "maous",
          price: 298,
          key: 2,
          // img: "https://cdn.shopify.com/s/files/1/0517/5590/9295/products/zero-zr6806-keyboard-mouse-combo_1024x1024.jpg?v=1670316801",
          img: "https://m.media-amazon.com/images/I/71SmrOjHDFL.__AC_SX300_SY300_QL70_ML2_.jpg",
        },
        {
          name: "summer collection",
          kind: "computer bag",
          price: 198,
          key: 3,
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5YlbBb2_c54i-Pv_cLx85is081ot1ARhgOA&usqp=CAU",
        },
        {
          name: "summer collection",
          kind: "computer bag",
          price: 198,
          key: 4,
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQkQSy_sjvfzpe_aVbE7GZQATp0ULZfFLtjg&usqp=CAU",
        },
        {
          name: "summer collection",
          kind: "keyboard",
          price: 198,
          key: 5,
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFBTrs0_O2lDfrv1LlWOTvPWrOlBr10gYa-A&usqp=CAU",
        },
        {
          name: "summer collection",
          kind: "screen",
          price: 198,
          key: 6,
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZl463wq1QoTxeTN-GVsJJEbEK1_HcGzh6lw&usqp=CAU",
        },
        {
          name: "summer collection",
          kind: "screen",
          price: 198,
          key: 7,
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSTtGWOI8blbxRNJVsPxep8Oz86Lz7cZWXqg&usqp=CAU",
        },
        {
          name: "summer collection",
          kind: "screen",
          price: 198,
          key: 8,
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk0UOArKhz2BFiNUjwofg72xda44ARg20nEQ&usqp=CAU",
        },
        {
          name: "summer collection",
          kind: "keyboard",
          price: 198,
          key: 9,
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUof-4StmY-ULSCWvJivM-lYA7XoYDwmvBRw&usqp=CAU",
        },
        {
          name: "summer collection",
          kind: "pools",
          price: 338,
          key: 10,
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxAexdVWH5im3_naeoYOew94UBxRFMnut34A&usqp=CAU",
        },
        {
          name: "summer collection",
          kind: "pools",
          price: 338,
          key: 11,
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgtneQOCZmzYS1uZMDtQg3ehKDxP_hHVSByQ&usqp=CAU",
        },
        {
          name: "summer collection",
          kind: "pools",
          price: 338,
          key: 12,
          img: "https://m.media-amazon.com/images/I/61kCTnNQe6L._AC_SX569_.jpg",
        },
      ],
    };
  },
  mounted() {
    this.fetchData();
  },
};
</script>
<style scoped lang="scss">
.category {
  // background-color: aqua;
  display: flex;
  flex-wrap: wrap;
  width: 85%;
  // justify-content: flex-end;
}
.title {
  width: 100%;
  height: 180px;
  display: flex;
  // background-color: red;
  flex-wrap: wrap;
  // margin-top: 5px;
  > div:first-child {
    width: 100%;
    height: 60%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div:first-child {
      background-color: blue;
      height: 40px;
      width: 196px;
      display: flex;
      align-items: center;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      div {
        width: 35px;
        height: 35px;
        border-radius: 17.5px;
        margin-left: 10px;
        background-color: white;

        img {
          width: 100%;
          height: 100%;
        }
      }
      p {
        text-transform: capitalize;
        text-align: center;
        margin-left: 20px;
        font-size: 18px;
        font-weight: 600;
        color: white;
        margin-right: 10px;
      }
    }
    > div:nth-of-type(2) {
      width: 340px;
      height: 80px;
      // background-color: greenyellow;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      > div {
        width: 100px;
        height: 40px;
        background-color: white;
        border-radius: 4px;
        button {
          width: 60px;
          background-color: white;
          color: black;
        }
        img {
          width: 20px;
          height: 20px;
          margin-left: 10px;
        }
      }
    }
  }
  > div:nth-of-type(2) {
    width: 96%;
    height: 40%;
    margin-left: 4%;
    background-color: white;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    input {
      width: 300px;
      height: 30px;
      margin-left: 20px;
      padding-left: 5px;
      color: rgb(233, 230, 230);
      border: solid 2px rgb(233, 230, 230);
      border-radius: 5px;
      // font-size: 18px;
      // font-weight: 600;
    }
    input:focus {
      outline: none;
    }
    > div {
      width: 250px;
      height: 40px;
      // background-color: red;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      div {
        width: 45%;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        height: 80%;
        border-radius: 3px;
        background-color: white;
        border: 2px solid rgb(222, 218, 218);
        button {
          background-color: white;
        }
      }
    }
  }
}
.arroow {
  width: 15px;
  height: 15px;
}

.allContent {
  width: 96%;
  min-height: 400px;
  background-color: white;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-content: flex-start;
  margin-left: 4%;
  margin-top: 2px;
}
.allContent > div {
  width: 300px;
  height: 380px;
  margin-top: 15px;
  margin-bottom: 15px;
  // background-color: red;
}
.add {
  width: 140px;
  height: 40px;
  background-color: blue;
  cursor: pointer;
  // margin-left: 80%;
  // margin-top: 60px;
  border-radius: 5px;
  font-size: 17px;
  font-weight: 600;
  font-family: Arial, Helvetica, sans-serif;
  text-transform: capitalize;
  color: white;
}
.add::first-letter {
  font-weight: 500;
  font-size: 19px;
}
/* loader => start  */
.lds-spinner {
  color: official;
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-spinner div {
  transform-origin: 40px 40px;
  animation: lds-spinner 1.2s linear infinite;
}
.lds-spinner div:after {
  content: " ";
  display: block;
  position: absolute;
  top: 3px;
  left: 37px;
  width: 6px;
  height: 18px;
  border-radius: 20%;
  background: rgb(27, 25, 25);
}
.lds-spinner div:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: -1.1s;
}
.lds-spinner div:nth-child(2) {
  transform: rotate(30deg);
  animation-delay: -1s;
}
.lds-spinner div:nth-child(3) {
  transform: rotate(60deg);
  animation-delay: -0.9s;
}
.lds-spinner div:nth-child(4) {
  transform: rotate(90deg);
  animation-delay: -0.8s;
}
.lds-spinner div:nth-child(5) {
  transform: rotate(120deg);
  animation-delay: -0.7s;
}
.lds-spinner div:nth-child(6) {
  transform: rotate(150deg);
  animation-delay: -0.6s;
}
.lds-spinner div:nth-child(7) {
  transform: rotate(180deg);
  animation-delay: -0.5s;
}
.lds-spinner div:nth-child(8) {
  transform: rotate(210deg);
  animation-delay: -0.4s;
}
.lds-spinner div:nth-child(9) {
  transform: rotate(240deg);
  animation-delay: -0.3s;
}
.lds-spinner div:nth-child(10) {
  transform: rotate(270deg);
  animation-delay: -0.2s;
}
.lds-spinner div:nth-child(11) {
  transform: rotate(300deg);
  animation-delay: -0.1s;
}
.lds-spinner div:nth-child(12) {
  transform: rotate(330deg);
  animation-delay: 0s;
}
@keyframes lds-spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
#loader {
  width: 500px;
  height: 500px;
  visibility: hidden;
  /* background-color: slategray; */
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}
/* loader => end  */
// .aded{
//   width: 30px;
//   height: 30px;
// }
.dark-mode-search {
  background-color: rgb(36, 36, 36);
  border: none !important;
}
.dark-mode {
  background-color: rgb(9, 9, 9) !important;
}
.dark-mode-title {
  color: white !important;
}
.dark-mode-box {
  background-color: black !important;
  box-shadow: 0 0 5px rgb(17, 16, 16);
}
// phone
@media (max-width: 477px) {
  .title {
    > div:nth-of-type(2) {
      input {
        width: 130px;
      }
    }
  }

  .title {
    height: 210px;
    // background-color: red;
    > div:first-child {
      height: 60%;
      flex-direction: column;
      > div:first-child {
        align-self: flex-start;
        margin-top: 15px;
      }
      > div:nth-of-type(2) {
        align-self: flex-end;
      }
    }
  }
}
</style>
