<template>
  <div class="addCategory">
    <div class="title">
      <p :class="{ 'dark-mode-title': getDarkMode }">edit category</p>
    </div>
    <div :class="{ 'dark-moode': getDarkMode }" class="allContent">
      <div>
        <h3 :class="{ 'dark-mode-title': getDarkMode }">edit category</h3>
      </div>
      <form class="cont-form">
        <div>
          <label :class="{ 'dark-mode-title': getDarkMode }">fill name</label>
          <input
            v-model="categoryName"
            type="text"
            placeholder="name category"
            required
          />
        </div>
        <div>
          <label :class="{ 'dark-mode-title': getDarkMode }">description</label>
          <input
            v-model="description"
            type="text"
            placeholder="description category"
          />
          <p class="note">you will be able to edit it later.</p>
        </div>
        <div>
          <label> imge</label>
          <input v-model="imageUrl" type="text" placeholder="url category" />
        </div>
        <div>
          <router-link to="/Category"> <button>cancle</button> </router-link>
          <button @click="updateCategory">update</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import sweetalert from "sweetalert";

export default {
  name: "AddCatagory",
  //   its not stil work
  props: ["category"],
  components: {},
  data() {
    return {
      id: null,
      categoryName:null,
      //   its not stil work
      catagory: null,
    };
  },
  computed: {
    getDarkMode() {
      return this.$store.state.darkMode;
    },
  },
  methods: {
    updateCategory(e) {
      e.preventDefault();
      console.log("hi");
      // const baseUrl = "limitless-lake-55070.herokuapp.com/";
      let body = {
        name: this.categoryName,
        // description: this.description,
        // image: this.imageUrl,
      };
      axios
        .put(`https://api.escuelajs.co/api/v1/categories/${this.id}`, body, {
          headers: {
            "content-type": "application/json",
          },
        })
        .then((res) => {
          // this.$emit("update");
          this.$router.push({ name: "Category" });
          sweetalert({
            text: "updated",
            icon: "success",
          });
          console.log(res);
        })
        .catch((error) => {
          sweetalert({
            text: `unupdated: ${error}`,
            icon: "error",
          });
          console.log(error);
        });
    },
  },
  mounted() {
    this.id = this.$route.params.id;
  },
};
</script>
<style scoped lang="scss">
.addCategory {
  // background-color: blueviolet;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}
.allContent {
  width: 370px;
  display: flex;
  flex-wrap: wrap;
  height: 440px;
  background-color: white;
  border-radius: 10px;
  border: solid 1px rgb(181, 179, 179);
  // background-color: forestgreen;
}
// title.....
.allContent > div:first-child {
  width: 100%;
  height: 70px;
  //   background-color: forestgreen;
}

h3 {
  text-align: center;
  line-height: 70px;
  text-transform: capitalize;
}
// cont-form.....
.allContent form {
  width: 100%;
  height: 370px;
  // background-color: seagreen;
  display: flex;
  flex-wrap: wrap;
}
.allContent form > div {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding-left: 20px;
  input {
    width: 80%;
    height: 30px;
    border-radius: 5px;
  }
}

.cont-form > div:first-child {
  width: 100%;
  height: 23%;
  // background-color: red;
}
.cont-form > div:nth-child(2) {
  width: 100%;
  height: 33%;
  // background-color: sandybrown;
  input {
    height: 50px;
  }
}
.cont-form > div:nth-child(3) {
  width: 100%;
  height: 27%;
  // background-color: seagreen;
}
.cont-form > div:nth-child(3) input {
  height: 50px;
  border: 2px dotted rgb(67, 67, 227);
}
.cont-form > div:nth-child(3) input:focus {
  outline: none;
}
.cont-form > div:nth-child(4) {
  width: 100%;
  height: 17%;
  //   background-color: saddlebrown;
  //   border-top: solid 1px rgb(181, 179, 179);
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  button:nth-child(2) {
    background-color: rgb(67, 67, 227);
    width: 120px;
    // cursor: pointer;
    margin-right: 7px;
    // border: none;
    color: white;
    // font-weight: bold;
  }
}
button {
  margin-right: 7px;
  border-radius: 5px;
  width: 70px;
  height: 30px;
  text-transform: capitalize;
  font-weight: bold;
  cursor: pointer;
}

.note {
  font-size: 15px;
  padding-left: 3px;
  color: rgb(181, 179, 179);
}
.note::first-letter {
  text-transform: capitalize;
}
.title {
  width: 15%;
  height: 50px;
  // background-color: red;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  p {
    text-transform: capitalize;
    font-size: 18px;
    font-weight: 600;
  }
}
.dark-mode-title {
  color: white !important;
}
.dark-moode {
  background-color: black !important;
  border: solid 1px rgb(28, 27, 27) !important;
}
</style>
<!-- let formData = new FormData();
  formData.append("title", this.categoryTitle);
  formData.append("price", this.price);
  formData.append("description", this.description);
  formData.append("images", this.imageUrl);
  formData.append("categoryId","2"); -->
