<template>
  <div class="editProduct">
    <div class="title">
      <p :class="{ 'dark-mode-title': getDarkMode }">edit product</p>
    </div>
    <div :class="{ 'dark-moode': getDarkMode }" class="allContentt">
      <form class="cont-form">
        <div class="name">
          <label :class="{ 'dark-mode-title': getDarkMode }"
            >product title</label
          >
          <input
            v-model="productTitle"
            type="text"
            placeholder="title product"
            required
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
            <select v-model="selectedCategoryId">
              <option v-for="category in categories" :value="category.id" :key="category.id">
                 {{ category.name }}
              </option>
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
            <label :class="{ 'dark-mode-title': getDarkMode }">price Material</label>
            <input v-model="priceMaterial" placeholder="type here" type="text" />
            <label :class="{ 'dark-mode-title': getDarkMode }">price With Labor</label>
            <input v-model="priceWithLabor" placeholder="type here" type="text" />
          </div>
          <div class="price type">
            <label :class="{ 'dark-mode-title': getDarkMode }">offer price (optionally) </label>
            <input v-model="offerPrice" placeholder="type here" type="text" />
          </div>
        </div>
        <div></div>
        <div class="puplish-allCont">
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

        <div>
          <button class="supmit" @click="creatNewProduct">supmit item</button>
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

// actions and state
import { mapActions, mapState } from 'pinia';

//store
import { useProductsStore } from '@/store/products/products.js'
import { useCategoriesStore } from '@/store/categories/categories.js';

// sweetalert 
import sweetalert from "sweetalert";

export default {
  name: "AddNewProduct",
  components: {},
  data() {
    return {
      productTitle: "",
      description: "",
      imageUrl: [],
      tags: "",
      priceMaterial: "",
      priceWithLabor: "",
      offerPrice:"",
      selectedCategoryId: null,
      id: null,
      clickedBeforeToUpload:false,
      oldImageUrl:"",
    };
  },
  computed: {
    getDarkMode() {
      return this.$store.state.darkMode;
    },

    ...mapState(useProductsStore, ['products']),
    ...mapState(useCategoriesStore, ['categories']),


  },
  async created() {
    await this.fetchCategories();

  },
  methods: {

    
    // ============ my actions => start=============================================

    ...mapActions(useProductsStore, ['updateProduct', 'deleteImageFromStorage', 'uploadImage']),
    ...mapActions(useCategoriesStore, ['fetchCategories']),

    // ============ my actions => end=============================================
     // ============ loader Toggle => start ==============================================
     loaderToggle(show) {
      let loader = document.getElementById("loader");
      if (loader) {
        loader.style.visibility = show ? "visible" : "hidden";
      }
    },
    // ============ loader Toggle => end ==============================================
    
    // ============ push On Array after make url from file => start=============================================
    pushOnArray: function () {

      // check to remove old imge from array before i add new one "trick"
      if(this.clickedBeforeToUpload === false){
        this.imageUrl=[]
        this.clickedBeforeToUpload = true
      }

      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrll = e.target.result;
          this.imageUrl.push(imageUrll);
        };
        reader.readAsDataURL(file);
       }
  
       //i canceld it because i need creat data url to can store it in storage by pinia action that need data url type
       // so i use file reader to creat data url but why اصلا u can send it as file by put fun so why that ? because i need show it localy before i upload it so i need convert it to url  

      //this.imageUrl.push(
       // URL.createObjectURL(document.getElementById("inputField").files[0])
      //);
      
    },



    // ============ push On Array after make url from file => end=============================================
    click(el) {
      document.getElementById("inputField").click();
      el.preventDefault();
    },
    
    
    // ============ update Product  => start=============================================
  
    async creatNewProduct(e) {
        e.preventDefault();
        try {
          this.loaderToggle(true)

            let downloadURL;
        
          if (this.imageUrl.length > 0 && this.imageUrl[0] !== this.oldImageUrl) {
            await this.deleteImageFromStorage(this.oldImageUrl);
            
            downloadURL = await this.uploadImage(this.imageUrl[0]);
          }
          
        let obj = {
          name: this.productTitle,
          priceMaterial: parseInt(this.priceMaterial),
          priceWithLabor: parseInt(this.priceWithLabor),
          offerPrice: parseInt(this.offerPrice),
          description: this.description,
          categoryId: this.selectedCategoryId,
          id: this.id,
        };
        
        if (this.imageUrl[0] !== this.oldImageUrl) {
          obj.imageUrl = downloadURL;
        }
        
        await this.updateProduct(obj);
        
        sweetalert({
          text: "Product updated successfully",
          icon: "success",
        });
        this.loaderToggle(false)

      } catch (error) {
        sweetalert({
          text: "Failed to update product",
          icon: "error",
        });
        console.error(error);
        this.loaderToggle(false)

      } 
      this.$router.push('/'); 

},

    // ============ update Product  => end=============================================
    
  },
   mounted() {
      this.id = this.$route.params.id;
      
     const product = this.products.find(product => product.id === this.id);

    if (product) {
      this.productTitle = product.name;
      this.description = product.description;
      this.imageUrl[0] = product.imageUrl;
      this.oldImageUrl = product.imageUrl;
      this.priceMaterial = product.priceMaterial;
      this.priceWithLabor = product.priceWithLabor;
      this.offerPrice = product.offerPrice;
      this.selectedCategoryId = product.categoryId;

    }
  },
};
</script>

<style scoped lang="scss">
.editProduct {
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
  justify-content: flex-start;
  align-content: space-evenly;
  > div {
    width: 100%;
  }
  > div:nth-child(1) {
    margin-top: 20px;
  }
  > div:nth-child(7),
  > div:nth-child(8) {
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
  > div:nth-child(8){
    margin-left: -33% !important;
  }
  > div:nth-child(9) {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 40px !important;
    .supmit {
      width: 30%;
      height: 90%;
      background-color: blue;
      text-transform: capitalize;
      color: white;
      margin-left: 20px;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  > div:nth-child(6) {
    height: 19% !important;
    .type {
      height: 50%;

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
// phone
@media (max-width: 477px) {
  .title {
    p {
      margin-left: 60px;
    }
  }
  .puplish-allCont {
    span {
      padding-left: 15px;
    }
  }
  .allContentt {
    width: 370px !important;
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
