<template>
    <!-- /* eslint-disable */ -->
    <div class="">
      <div class="random__title">
        <div class="random__title__text">
          <p v-if="userInfo"> {{ userInfo.role== "technical"? "workers's": "clint's"  }} accounting <span>Random</span></p>
        </div>
        <div class="cont__title__totalChange">
          <div class="random__title__total">
            <div class="total__text">
              <p>total Balance</p>
            </div>
            <div class="total__number">
              <p>{{ balance }} $</p>
            </div>
          </div>
          <div class="random__title__change">
            <div class="toggle">
              <div class="toggle__chosse" >
                  <span>show</span>
              </div>
              <ToggleSwitch
                  :isHidden="isHidden"
                  @update:isHiddenActive="updateHiddenStatus"
              />     
              </div>
          </div>
        </div>
      </div>
    </div>
  </template>


<script>
    
// componnents
  // ToggleSwitch
  import ToggleSwitch from '@/components/users/financial/randomFinancial/ToggleSwitch.vue';

  // store
  import { mapState, mapActions } from "pinia";
  import { useRandomTransactionsStore } from '@/store/transactions/randomTransactions.js';
  import { useGetUserStore } from '@/store/users/users.js';

  export default {
    name: "TotalBalance",
    components: {
    
      ToggleSwitch,
    },
    computed: {
    ...mapState(useRandomTransactionsStore, ["balance"]),
  },
    methods: {    
      updateHiddenStatus(){
        console.log("before",this.isHidden)
        this.isHidden = !this.isHidden; // Toggle the hidden value
        console.log("after",this.isHidden)

      },
      ...mapActions(useRandomTransactionsStore, ["fetchTransactionsByProfile"]),
      ...mapActions(useGetUserStore, ['fetchSingleUser']),

    },
    data() {
      return {
        isHidden:false,
        profileId: this.$route.params.profileId, 
        userInfo:null,

      };
    },
    async created() {
      await this.fetchTransactionsByProfile(this.profileId);
      this.userInfo = await this.fetchSingleUser(this.profileId);

      // this.isLoading = false;

    },
  };
  </script> 
  


<style scoped lang="scss">
    .random__title{
      // background-color: red;
      display: flex;
      flex-wrap: wrap;
      height: 200px;
      width: 100%;
      overflow: hidden;
      background-color: #f9f9f9;

    }
    .random__title__text{
      // background-color: rgb(159, 107, 107);
      width: 100%;
      height: 50px;
      padding: 20px;
      padding-left: 40px;
      span{
          color: blue;
      }
    }
    .cont__title__totalChange{
      display: flex;
      justify-content: space-between; 
      align-items: center;
      //  background-color: skyblue;
      height: 100px;
      width: 100%;
      padding-left: 20px;
    }
    .random__title__total{
      // background-color:white;
      background-color: #f9f9f9;
      box-shadow: 0 0 5px rgb(210, 205, 205);
      width: 470px;
      height: 130px;
      border-radius: 8px;
      margin-left: 20px;
      padding: 10px;
      padding-left: 20px;
      
    }
    .total__text{
      width: 100%;
      height: 40px;
      // background-color: red;
    }
    .total__number{
      width: 80%;
      height: 70px;
      background-color: rgb(35, 113, 247,0.2);
      // padding: 10px;
      border-radius: 8px;
      line-height: 70px;
      padding-left: 20px;
      font-size: 20px;
      color: blue;
    }

    .random__title__change{
      width: 130px;
      height: 70px;
      border-radius: 8px;
      margin-right: 20px;
      background-color:white;
      box-shadow: 0 0 5px rgb(210, 205, 205);     
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
      align-items: center;
    }
    .toggle{
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
      align-items: center;
    }
    .toggle__chosse{
      // width: 100%;
      // text-align: center;
      // background-color: coral;
      // margin-right: 10px;
      span{
        text-transform: capitalize;
        color: rgb(36, 36, 235);
      }
    }

    @media (max-width: 477px) {
      .random__title__total{
        width: 270px;
      }

      .random__title__change{
        width: 50px;
      }

      .toggle__chosse{
    
        margin-bottom: 10px;
      
      }
    }
    @media (max-width: 370px) {
      .random__title__total{
        width: 220px;
      }

      .random__title__change{
        width: 65px;
      }

    }


  </style>
  