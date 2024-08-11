<template>
  <!-- /* eslint-disable */ -->
  <div class="category">
    <div class="title">
      <div>
        <div class="contTitle">
          <div>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUQUVkx6lAgtb3-3fMuDZnDixihOSrrNSAOg&usqp=CAU"
            />
          </div>
          <p :class="{ 'dark-mode-title': getDarkMode }">product grid</p>
        </div>
        <div>
          <div class="export">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmvEXj1Sr-tzeKuEP9PgzajIUDvR_-L-zfkg&usqp=CAU"
            />
            <button>export</button>
          </div>
          <router-link to="/dashboard/AddNewProduct">
            <button class="add">+ add product</button>
          </router-link>
        </div>
      </div>

      <div :class="{ 'dark-mode-box': getDarkMode }">
        <div class="">
          <input
          :class="{ 'dark-mode-search': getDarkMode }"
          placeholder="search"
          type="search"
          v-model="searchQuery" 
        />
        <select placeholder="filter"  class="filter" v-model="selectedFilter">
          <option value="name">title</option>
          <option value="priceMaterial">priceMaterial</option>
          <option value="priceWithLabor">priceWithLabor</option>
        </select>
        </div>
        <div :class="{ 'dark-mode-box': getDarkMode }">
          <div>
            <select placeholder="filter"  class="filter categoriesFilter"  v-model="selectedCategory">
              <option>all</option>
              <option v-for="category in categories" :value="category.id" :key="category.id">
                 {{ category.name }}
              </option>
            </select>
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

      <div v-if="isLoading">
        <BoxSkeletonLoader v-for="n in 6" :key="n" />
      </div>
      <div v-if="!isLoading">
        <ProductList
          :products="getProduct"
        >
        </ProductList>
      </div>

      <NoData v-if="getProduct.length == 0" context="products"></NoData>


    </div>
    
  </div>
</template>
<script>

// actions 
import {  mapState , mapActions } from 'pinia'
//store
import { useProductsStore } from '@/store/products/products.js'
import { useCategoriesStore } from '@/store/categories/categories.js';

//  CategoryList
import ProductList from "@/components/products/ProductList.vue";
// Skeleton Box
import BoxSkeletonLoader from '@/shared/components/loading/skeletonLoader/BoxSkeletonLoader.vue';
  // NoData
import NoData from "@/shared/components/noData/NoData.vue";

export default {
  name: "Product",
  components: {
   NoData,
   BoxSkeletonLoader,
   ProductList,
  },
  computed: {
    getDarkMode() {
      return this.$store.state.darkMode;
    },
    ...mapState(useProductsStore, ['products']),
    ...mapState(useCategoriesStore, ['categories']),

  // ============ filter => start=======================================
        
        getProduct() {
          let filteredProducts = this.products;
          
          // فلترة حسب الفئة
          if (this.selectedCategory !== 'all') {
            filteredProducts = filteredProducts.filter(
              product => product.categoryId === this.selectedCategory
            );
          }
          
          // البحث
          if (this.searchQuery) {
            filteredProducts = filteredProducts.filter(product => {
              const valueToSearch = product[this.selectedFilter].toString().toLowerCase();
              return valueToSearch.includes(this.searchQuery.toLowerCase());
            });
          }
          
          return filteredProducts;
        }
  // ============ filter => end=======================================
   
  },
  async created(){
     await this.fetchProducts()
     this.isLoading = false;
     this.fetchCategories();


  },
  methods: {
    
    // ============ my actions => start=======================================

    ...mapActions(useProductsStore, ['fetchProducts']),
    ...mapActions(useCategoriesStore, ['fetchCategories']),


    // ============ my actions => end==========================================

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

    // ===========show posts => start========================================
    // show scroll up
    showScrollUp: function () {
      let Buttom = document.getElementById("scrollUp");
      window.onscroll = function () {
        if (scrollY >= 500) {
          Buttom.style.visibility = "visible";
        } else {
          Buttom.style.visibility = "hidden";
        }
      };
    },
  
    // ===========show posts filter => start================================================
   
    // ===========show posts filter => end================================================

  },
  data() {
    return {
      searchQuery: '',
      selectedCategory: 'all',
      selectedFilter: 'name',
      isLoading: true,

      
    };
  },
 
 
};
</script>
<style scoped lang="scss">
.category {
 // background-color: aqua;
  display: flex;
  flex-wrap: wrap;
}

.title {
  width: 100%;
  height: 180px;
  //background-color: sandybrown;
  display: flex;
  flex-wrap: wrap;
  > div:first-child {
    width: 100%;
    height: 60%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div:first-child {
      background-color: blue;
      height: 40px;
      width: 190px;
      display: flex;
      align-items: center;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      > div {
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
        // background-color: black;
        border-radius: 4px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        button {
          width: 60px;
          background-color: white;
          // background-color: black;
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
    //background-color: rgb(129, 76, 19);
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    display: flex;
    justify-content: space-between ;
    align-items: center;
    div:first-child{
      display: flex;
      justify-content: space-evenly ;
      align-items: center;
      height: 100%;
      width: 350px;
      // background-color: red;
      select {
        // margin-right: 400px;
        border-radius: 5px;
        height: 30px;
        width: 100px;
        text-transform: capitalize;
        color: black;
        border: solid 2px rgb(233, 230, 230);
      }
      input {
        height: 30px;
        width: 200px;
        padding-left: 5px;
        color: black;
        border: solid 2px rgb(233, 230, 230);
        border-radius: 5px;
      }
      input:focus {
        outline: none;
      }
    }
    > div:nth-child(2) {
      width: 350px;
      height: 40px;
      // background-color: red;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      div {
        width: 140px;
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
.contTitle {
  background-color: blue;
}
.arroow {
  width: 15px;
  height: 15px;
}

.allContent {
  width: 96%;
  min-height: 400px;
  background-color: white;
  //background-color: rgb(207, 70, 70);
  margin-bottom: 160px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-content: flex-start;
  margin-left: 4%;
}
.allContent > div {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 100%;
  min-height: 380px;
}
.categoriesFilter{
  width: 100% !important;
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

/* scrollUp => start */
.scrollUp {
  width: 60px;
  height: 60px;
  //   background-color: blue;
  position: fixed;
  right: 20px;
  bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  /* border: 2px solid white; */
  cursor: pointer;
  //   visibility: hidden;
  img {
    width: 100%;
    height: 100%;
  }
}

// .scrollUp::after {
//   content: "^";
//   width: 50%;
//   height: 50%;
// //   background-color: darkorange;
//   position: absolute;
//   top: 10%;
//   font-weight: 500;
//   font-size: 40px;
//   text-align: center;
//   color: white;
// }
// .scrollUp::before {
//   content: "^";
//   color: white;
//   position: absolute;
//   top: 35%;
//   width: 50%;
//   height: 50%;
// //   background-color: darkorange;
//   font-weight: 500;
//   font-size: 40px;
//   text-align: center;
// }
/* scrollUp => end */

.dark-mode-search {
  background-color: rgb(36, 36, 36);
  border: none !important;
  color: white !important;
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
@media (max-width: 477px) {
  .title {
    > div:nth-of-type(2) {
      div:first-child{
        width: 170px;
        select {
        width: 60px;
      }
      input {
        width: 100px;
      }
      }
      div:nth-child(2){
        // background-color: aqua;
        width: 180px;
        div {
        width: 80px;
      }

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
