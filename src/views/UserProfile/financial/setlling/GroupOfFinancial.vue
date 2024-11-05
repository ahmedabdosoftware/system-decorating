<template>
    <!-- /* eslint-disable */ -->
    <div class="page settling">
      <div class="title">
        <div>
          <div class="contTitle">
            <div>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUQUVkx6lAgtb3-3fMuDZnDixihOSrrNSAOg&usqp=CAU"
              />
            </div>
            <p :class="{ 'dark-mode-title': getDarkMode }">settling grid</p>
          </div>
          <div>
            <div class="export">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmvEXj1Sr-tzeKuEP9PgzajIUDvR_-L-zfkg&usqp=CAU"
              />
              <button>export</button>
            </div>
          </div>
        </div>
  
        <div :class="{ 'dark-mode-box': getDarkMode }">
          <div class="">
           
         
          </div>
          <div :class="{ 'dark-mode-box': getDarkMode }">
            <div class="statistics_search">
                <select placeholder="filter"  class="filter" v-model="selectedFilter">
                    <option value="today">االيوم </option>
                    <option value="yesterday" > امس</option>
                    <option value="lastWeak"> اخر اسبوع</option>
                    <option value="lastMonth">  الشهر الماضى</option>
                    <option value="lastYear"> اخر سنة</option>
                </select>
            </div>
           
          </div>
        </div>
      </div>
      <div :class="{ 'dark-mode-box': getDarkMode }" class="allContent">
  
        <div v-if="isLoading">
          <BoxSkeletonLoader v-for="n in 6" :key="n" />
        </div>
        <div v-if="!isLoading">
          <FinancialList
            :Financials="getTransactions"
          >
          </FinancialList>
        </div>
  
        <NoData v-if="getTransactions.length == 0" context="transactions"></NoData>
  
  
      </div>
      
    </div>
  </template>


<script>
  import { mapState, mapActions } from 'pinia'
  
  //store
  import { useTransactionsStore } from '@/store/transactions/transactions.js';
  
  
// componnents
  // NoData

  import NoData from "@/shared/components/noData/NoData.vue";
 
  // Skeleton Box
  import BoxSkeletonLoader from '@/shared/components/loading/skeletonLoader/BoxSkeletonLoader.vue';
  
  // Financial List 
  import FinancialList from '@/components/users/financial/settling/FinancialList.vue';
    
  // mixins 
  import dateFilterMixin from '@/mixins/dateFilterMixin';

  export default {
    name: "Transactions",
    components: {
      NoData,
      BoxSkeletonLoader,
      FinancialList,
    },
    mixins: [dateFilterMixin],
    computed: {
      getDarkMode() {
        return this.$store.state.darkMode;
      },
      ...mapState(useTransactionsStore, ['userTransactions']),
  
      // ============ filter => start=======================================

      getTransactions() { 
          const filteredTransactions = this.filterByDate(this.userTransactions, this.selectedFilter);
          console.log(filteredTransactions)
        return filteredTransactions;
      }

// ============ filter => end=======================================

    },
   async created() {
      this.profileId = this.$route.params.profileId;
      await this.fetchTransactionsByUserId(this.profileId );
      this.isLoading = false;

    },
    methods: {
      ...mapActions(useTransactionsStore, ['fetchTransactionsByUserId']),
    
     
    },
    data() {
      return {
     
        selectedFilter: 'today',
        profileId: null,
        isLoading: true,

      };
    },
  };
  </script> 
  


    <style scoped lang="scss">
  
  
  
  .allContent > div {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: 100%;
    min-height: 380px;
  }
 
  
  .title > div:nth-of-type(2) div:nth-child(2) div {
        width: 120px;
    }
  
  </style>
  