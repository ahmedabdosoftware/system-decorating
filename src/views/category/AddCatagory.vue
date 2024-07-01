<template>
  <div class="addCategory">
    <div class="title">
      <p :class="{ 'dark-mode-title': getDarkMode }">creat category</p>
    </div>
    <div :class="{ 'dark-moode': getDarkMode }" class="allContent">
      <div>
        <h3 :class="{ 'dark-mode-title': getDarkMode }">add category</h3>
      </div>
      <form class="cont-form">
        <div>
          <label :class="{ 'dark-mode-title': getDarkMode }">fill name</label>
          <input
            v-model="categoryName"
            type="text"
            placeholder="name category"
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
          <input id="fileImage" class="filee" type="file" @change="handleFileUpload">
        </div>
        <div>
          <label id="Availability" :class="{ 'dark-mode-title': getDarkMode }">Availability</label>
          <div>
            <input type="radio" id="installation" value="تركيب" v-model="availability">
            <label for="installation">Installation</label>
          </div>
          <div>
            <input type="radio" id="sale" value="توريد" v-model="availability">
            <label for="sale">Sale</label>
          </div>
          <div>
            <input type="radio" id="both" value="تركيب وتوريد" v-model="availability">
            <label for="both">Both</label>
          </div>
        </div>
        <div>
          <router-link to="/Category"> <button>cancle</button> </router-link>
          <button class="creat" @click="creatNewCategory">creat</button>
        </div>
      </form>
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
// actions 
import {  mapActions } from 'pinia'
import { useCategoriesStore } from '@/store/categories/categories.js'

import sweetalert from "sweetalert";

export default {
  name: "AddCatagory",
  components: {},
  data() {
    return {
      categoryName: "",
      description: "",
      imageUrl: "",
      file: null,
      availability: "both", // Add availability here


    };
  },
  computed: {
    getDarkMode() {
      return this.$store.state.darkMode;
    },
  },
  methods: {

    
     // ============ my actions => start=======================================

     ...mapActions(useCategoriesStore, ['addCategory', 'uploadImage']),
     // ============ my actions => end==========================================
     
     // ============ handle File Upload => start==========================================
     handleFileUpload(event) {
       this.file = event.target.files[0];
     },
    // ============ handle File Upload => end==========================================
    // ============ loader Toggle => start ==============================================
     loaderToggle(show) {
          let loader = document.getElementById("loader");
          if (loader) {
            loader.style.visibility = show ? "visible" : "hidden";
          }
        },
    // ============ loader Toggle => end ==============================================
    // ============ creatNewCategory => start====================================
        
    async creatNewCategory(e) {
      e.preventDefault();
      try {
        this.loaderToggle(true)

        let imageUrl = "";
        if (this.file) {
          imageUrl = await this.uploadImage(this.file);
        }
        const obj = {
          name: this.categoryName,
          desc: this.description,
          imgUrl: imageUrl,
          availability: this.availability, // Add availability to the object

        };
        await this.addCategory(obj);
        sweetalert({
          text: "created",
          icon: "success",
        });
        this.loaderToggle(false)

      } catch (error) {
        sweetalert({
          text: "uncreated",
          icon: "error",
        });
        console.error(error);
        this.loaderToggle(false)

      }
    },
    // ============ creatNewCategory => end====================================
  },
};
</script>
<style scoped lang="scss">
%spichial_flex{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}
.addCategory {
  // background-color: blueviolet;
  @extend %spichial_flex;

}
.allContent {
  width: 370px;
  display: flex;
  flex-wrap: wrap;
  height: 640px;
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
  height: 570px;
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
  height: 18%;
   //background-color: red;
}
.cont-form > div:nth-child(2) {
  width: 100%;
  height: 27%;
 //background-color: sandybrown;
  input {
    height: 50px;
  }
}
.cont-form > div:nth-child(3) {
  width: 100%;
  height:15%;
  // background-color: seagreen;
}

.cont-form > div:nth-child(3) input {
  height: 50px;
 // border: 2px dotted rgb(59, 59, 63);
 
}

// input file
input[type="file"]{
        font-size: 19px;
        background-color: white;
        border-radius: 5px;
        border: 2px solid rgb(198, 195, 195);
        width: 90%;
      }
      input[type="file"]::-webkit-file-upload-button{
        background-color: rgb(198, 195, 195);
        /* border-radius: 5px; */
        /* style goes here */
        border: none;
        width: 120px;
        height: 50px;
        cursor: pointer;
        margin-left:-7px ;
 }

.cont-form > div:nth-child(3) input:focus {
  outline: none;
}

.cont-form > div:nth-child(4),.cont-form > div:nth-child(5) {
  width: 100%;
  height: 17%;
  //background-color: saddlebrown;
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

.cont-form > div:nth-child(4){
  > div{
    @extend %spichial_flex;
    //background-color: red;
    height: 60px;
    width: 100px;
  }
  #Availability{
    //margin-top: -26px;
    //background-color: red;
    margin-right: 20px;
    font: {
      size:19px;
      weight:600;
    }
    
  }
  
  input[ type="radio"]{
    width: 20px;
    height: 20px;
    background-color: red;

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
  margin-top: -80px;
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
  border: solid 1px rgb(28, 27, 27)  !important;
}
// phone
@media(max-width:477px){
  .title {
margin-left: 20px;
  }
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
  height: 900px;
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

</style>
<!-- let formData = new FormData();
formData.append("title", this.categoryTitle);
formData.append("price", this.price);
formData.append("description", this.description);
formData.append("images", this.imageUrl);
formData.append("categoryId","2"); -->
