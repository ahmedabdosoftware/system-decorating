<template>
  <header>
    <div class="logo-cont">
      <span class="logo">nostra</span>
    </div>
    <ul id="nav">
      <li>
        <div class="countShop">
          <router-link exact to="/"> shop</router-link>
          <img
            class="icon"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl6Jx0lu0D-qLbrrZtaMbMhb54XRiQHabqH9kXIesQhzX1fPbcM5O6OvGZzxZE9qqhHgM&usqp=CAU"
          />
        </div>
      </li>
      <li>
        <router-link to="/Category">catagory</router-link>
      </li>
      <li>
        <router-link to="/about">products</router-link>
      </li>
      <li>
        <router-link to="/about">brands</router-link>
      </li>
    </ul>
    <div>
      <div>
        <img
          class="searchIcon"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzOOcc8zmCDsFQDkDQKfSwt-zN9jKB0xYhjg&usqp=CAU&reload=on"
        />
        <input placeholder="search" type="search" />
      </div>
      <img
        class="icon"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwXcISt7cOkMUmbjZKhqGyUU2ab9-Y0wR9Ww&usqp=CAU"
      />
      <img
        v-on:click="apearaCounts()"
        class="icon"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZTQ3UJipAxvQpwl7MffTRf5Ia0InpL_IZZw&usqp=CAU"
      />
    </div>
    <div class="acounts" id="acounts">
      <div>
        <p>admin</p>
        <p>login</p>
        <p>regester</p>
      </div>
      <div>
        <span v-on:click="disApearaCounts()" id="x" class="x">x</span>
      </div>
    </div>
  </header>
</template>
<script>
// import router from "./router";
export default {
  name: "HeaderComp",
  methods: {
    apearaCounts: function () {
      let acounts = document.getElementById("acounts");
      acounts.style.visibility = "visible";
    },
    disApearaCounts: function () {
      let acounts = document.getElementById("acounts");
      acounts.style.visibility = "hidden";
    },
  },
};
</script>

<style scoped lang="scss">
header {
  width: 100%;
  height: 100px;
  background-color: rgb(238, 232, 232);
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: sticky;
  top: 0px;
  z-index: 2;
}
ul {
  width: 30%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 30px;
  // margin-right: 70px;
  // background-color: red;
}
.logo-cont {
  width: 150px;
  height: 40px;
  // background-color:red;
  margin-right: 50px;
  //   scss code
  span {
    text-align: center;
    line-height: 40px;
    color: black;
    font-weight: bold;
    font-size: 24px;
    text-transform: uppercase;
    font-family: "Dancing Script", cursive;
  }
}
header > div:nth-child(3) {
  width: 28%;
  height: 40px;
  // background-color: white;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  div {
    display: flex;
    align-items: center;
    width: 70%;
    height: 100%;
    background-color: rgb(233, 236, 235);
    // background-color: salmon;
    border-radius: 5px;
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
      background-color: rgb(233, 236, 235);
    }
    input:focus {
      outline: none;
    }
  }
}
.icon {
  width: 20px;
  height: 20px;
  mix-blend-mode: multiply;
  cursor: pointer;
}
.countShop {
  width: 70px;
  height: 100%;
  // background-color: silver;
  display: flex;
  align-items: center;
}
.acounts {
  width: 120px;
  height: 115px;
  position: absolute;
  right: 20px;
  top: 80%;
  background-color: rgb(223, 215, 214);
  border-radius: 5px;
  visibility: hidden;
}
.acounts > div:first-child{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  font-size: 18px;
  font-weight: 500;
  font-family: Arial, Helvetica, sans-serif;
  text-transform: capitalize;
  // background-color: goldenrod;
  p{
    cursor: pointer;
  }
}
.acounts div:nth-child(2) {
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color:rgb(190, 188, 188);
  position: absolute;
  top: 6px;
  right: 6px;
  text-align: center;
  .x {
    line-height: 20px;
    cursor: pointer;
  }
}
.router-link-exact-active {
  color:black;
}
</style>
