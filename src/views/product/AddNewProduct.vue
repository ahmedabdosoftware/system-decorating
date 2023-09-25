<template>
  <div class="addProduct">
    <div class="title">
      <p :class="{ 'dark-mode-title': getDarkMode }">create product</p>
    </div>
    <div :class="{ 'dark-moode': getDarkMode }" class="allContentt">
      <form class="cont-form">
        <div class="name">
          <label :class="{ 'dark-mode-title': getDarkMode }"
            >product title</label
          >
          <input
            v-model="categoryTitle"
            type="text"
            placeholder="title product"
          />
        </div>
        <div class="description">
          <label :class="{ 'dark-mode-title': getDarkMode }">description</label>
          <input
            v-model="description"
            type="text"
            placeholder="description product"
          />
          <p class="note">you will be able to edit it later.</p>
        </div>
        <div class="imgeCont">
          <input
            v-on:change="pushOnArray()"
            id="inputField"
            type="file"
            placeholder="url category"
          />
          <div class="uploadCont uploadContImge">
            <img id="up" class="upload" v-bind:src="imageUrl[0]" />
          </div>
          <div class="uploadCont uploadContImge">
            <img id="up" class="upload" v-bind:src="imageUrl[1]" />
          </div>
          <div class="uploadCont uploadContImge">
            <img id="up" class="upload" v-bind:src="imageUrl[2]" />
          </div>
          <div v-on:click="click()" id="btn" class="uploadCont uploadImge">
            <img
              class="upload"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbQN9NvIcWwtddjv-IerO_kox9AJ0cCFU2Ew&usqp=CAU"
            />
            <span class="upUnderImge">upload</span>
          </div>
        </div>
        <div class="tags">
          <label>tags</label>
          <input v-model="tags" type="text" placeholder="enter tags" />
        </div>
        <div class="contCatoSup">
          <div class="cato">
            <label :class="{ 'dark-mode-title': getDarkMode }">catogery</label>
            <select>
              <option>phone</option>
              <option>screen</option>
              <option>ipad</option>
            </select>
          </div>
          <div class="sup">
            <label>sup catogery</label>
            <select>
              <option>iphone</option>
              <option>samsung</option>
              <option>dell</option>
              <option>hpp</option>
            </select>
          </div>
        </div>
        <div>
          <div class="price">
            <label :class="{ 'dark-mode-title': getDarkMode }">price</label>
            <input v-model="price" placeholder="type here" type="text" />
          </div>
          <div class="price type">
            <select>
              <option>USD</option>
              <option>EGP</option>
              <option>EURO</option>
            </select>
          </div>
        </div>
        <div></div>
        <div>
          <div class="puplish-cont">
            <img
              class="puplish"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb7SOrFrM0RaPa7ttuu-j-V5kD-Sdxlkb5FOsSQ4PJIdI2puYqEyTiOGHSnushuXmnLmE&usqp=CAU"
            />
          </div>
          <span :class="{ 'dark-mode-title': getDarkMode }"
            >puplish on site</span
          >
        </div>
        <div></div>

        <div>
          <button class="supmit" @click="creatNewProduct">supmit item</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import sweetalert from "sweetalert";

export default {
  name: "AddNewProduct",
  components: {},
  data() {
    return {
      categoryTitle: "",
      description: "",
      imageUrl: [],
      tags: "",
      price: "",
    };
  },
  computed: {
    getDarkMode() {
      return this.$store.state.darkMode;
    },
  },
  methods: {
    pushOnArray: function () {
      this.imageUrl.push(
        URL.createObjectURL(document.getElementById("inputField").files[0])
      );
      console.log(this.imageUrl);
      console.log(document.getElementById("up"));
    },
    click(el) {
      document.getElementById("inputField").click();
      el.preventDefault();
    },
    creatNewProduct(e) {
      e.preventDefault();
      console.log("send");
      let body = {
        title: this.categoryTitle,
        price: parseInt(this.price),
        description: this.description,
        categoryId: 1,
        images: ["https://placeimg.com/640/480/any"],
      };
      axios
        .post(`https://api.escuelajs.co/api/v1/products/`, body, {
          headers: {
            "content-type": "application/json",
          },
        })
        .then((res) => {
          sweetalert({
            text: "created",
            icon: "success",
          });
          console.log(res);
        })
        .catch((error) => {
          sweetalert({
            text: "uncreated",
            icon: "error",
          });
          console.log(error);
        });
    },
  },
};
</script>
<style scoped lang="scss">
.addProduct {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}
.title {
  width: 470px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  p {
    text-transform: capitalize;
    font-size: 22px;
    font-weight: 600;
  }
}
.allContentt {
  width: 470px;
  display: flex;
  flex-wrap: wrap;
  height: 740px;
  background-color: white;
  border-radius: 10px;
  border: solid 1px rgb(181, 179, 179);
}
.puplish-cont {
  width: 25px;
  height: 25px;
  margin-left: 10px;
  background-color: white;
  border-radius: 12.5px;
  position: relative;
}
.allContentt form {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-evenly;
  > div {
    width: 100%;
  }
  > div:nth-child(1) {
    margin-top: 20px;
  }
  > div:nth-child(7),
  > div:nth-child(8),
  > div:nth-child(9) {
    display: flex;
    width: 35%;
    align-items: center;
    justify-content: space-around;
    > div .puplish {
      width: 180%;
      height: 180%;
      mix-blend-mode: multiply;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  > div:nth-child(10) {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 40%;
    .supmit {
      width: 60%;
      height: 40%;
      background-color: blue;
      text-transform: capitalize;
      color: white;
      margin-left: 20px;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  > div:nth-child(6) {
    width: 40%;
    .type {
      select {
        margin-top: 23px;
      }
    }
  }
  > div:nth-child(5),
  > div:nth-child(6) {
    padding-left: 20px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    > div {
      display: flex;
      flex-wrap: wrap;
      align-content: space-evenly;
      width: 49%;
      height: 90%;
      > select,
      > input {
        width: 90%;
        border-radius: 5px;
      }
    }
  }
  > div:nth-child(1),
  > div:nth-child(2),
  > div:nth-child(4) {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding-left: 20px;
    input {
      width: 90%;
      border-radius: 5px;
    }
  }
}
.allContentt form > div:nth-child(2),
.allContentt form > div:nth-child(3) {
  height: 15%;
}
.allContentt
  form
  > div:not(
    .allContentt form > div:nth-child(2),
    .allContentt form > div:nth-child(3)
  ) {
  height: 10%;
}
.description {
  input {
    height: 50%;
  }
}
.name,
.tags,
.cato,
.price,
.sup {
  input:focus {
    outline: none;
  }
  input,
  select {
    height: 30px;
  }
}
input[type="file"] {
  border: 2px solid rgb(198, 195, 195);
  width: 90%;
  display: none;
}

.imgeCont {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  > .uploadCont {
    background-color: rgb(181, 179, 179);
    border-radius: 5px;
    width: 20% !important;
    height: 80%;
    > button {
      background-color: rgb(181, 179, 179);
      font-size: 19px;
      width: 70px;
      height: 40px;
    }
  }

  > .uploadContImge {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    border: solid rgb(181, 179, 179) 1px;
  }
  > .uploadImge {
    cursor: pointer;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: space-evenly;
  }
}

.upload {
  width: 50px;
  height: 40%;
}
#up {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}
.upUnderImge {
  text-transform: capitalize;
}
.dark-mode-title {
  color: white !important;
}
.dark-moode {
  background-color: black !important;
  border: solid 1px rgb(28, 27, 27) !important;
}
// title.....
</style>
