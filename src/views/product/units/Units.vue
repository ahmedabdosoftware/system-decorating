<template>
    <!-- /* eslint-disable */ -->
    <div class="units">
      <div class="title">
        <div>
          <div class="contTitle">
            <div>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfifgpU6f6DdemdITBpg_essXRVuwWFaTnhJgl9QGDvchprPgRpZFDLgAZhDRlBiYvEd8&usqp=CAU"
              />
            </div>
            <p :class=" { 'dark-mode-title': getDarkMode } ">units grid</p>
          </div>
          <div>
            <div class="export">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmvEXj1Sr-tzeKuEP9PgzajIUDvR_-L-zfkg&usqp=CAU"
              />
              <button>export</button>
            </div>
            <router-link to="/dashboard/AddUnit">
              <button class="add">+ add unit</button>
            </router-link>
          </div>
        </div>
        <div :class="{ 'dark-mode-box': getDarkMode }">
          <input
            :class="{ 'dark-mode-search': getDarkMode }"
            placeholder="search"
            type="search"
            v-model="searchQuery"
  
          />
          <div :class="{ 'dark-mode-box': getDarkMode }">
            <div>
              <button>units</button>
              <img
                class="arroow point"
                src="data:image/png;base64,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"
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
  
      <TableSkeleton v-if="isLoading" :rows="5" :columns="6" />
      <unitList v-else-if="getUnits.length > 0" :units="getUnits" class="ListTable_cont"></unitList>
      <NoData v-else context="units"></NoData>
      
      </div>
     
    </div>
  </template>
  
  <script>
  
  // actions 
  import {  mapState , mapActions } from 'pinia'
  //store
  import { useUnitsStore } from '@/store/products/units/units.js';

  // unitList
  import unitList from "@/components/products/units/unitList.vue";
  
  // Skeleton Table
  import TableSkeleton from '@/shared/components/loading/skeletonLoader/TableSkeleton.vue';
 
  // NoData
  import NoData from "@/shared/components/noData/NoData.vue";
  
  export default {
    name: "Units",
    components: {
      unitList,
      NoData,
      TableSkeleton,
    },
    computed: {

      getDarkMode() {
        return this.$store.state.darkMode;
      },

    ...mapState(useUnitsStore, ['units']),  

    // ============ filter => start=======================================
          

    getUnits() {
      const query = this.searchQuery.toLowerCase();
      if (!query) {
        return this.units;
      }
      return this.units.filter(unit =>
        unit.name.toLowerCase().includes(query)
      );
    }
    // ============ filter => end=======================================
     
    },
    methods: {
        ...mapActions(useUnitsStore, ['fetchUnits']),
    },
    async created() {
    await this.fetchUnits();
    this.isLoading = false;
    },
    data() {
      return {
        searchQuery: '',
        isLoading: true,

        
      };
    },
   
   
  };
  </script>
  
  <style scoped lang="scss">
  .units {
    // background-color: aqua;
    display: flex;
    flex-wrap: wrap;
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
       // color: rgb(233, 230, 230);
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
  .arroow.point {
    width: 7px;
    height: 7px;
  }
  
  .allContent {
    width: 96%;
    min-height: 400px;
    margin-bottom: 160px;
    background-color: white;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-content: flex-start;
    margin-left: 4%;
    margin-top: 2px;
  }
  .allContent > div  {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: 100%;
    min-height: 380px;
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
  