<template>
    <!-- /* eslint-disable */ -->
    <div class="page random">
      <TotalBalance>
      </TotalBalance>
      <div class="add-payment">
        <AddPayment />
      </div>
      <div :class="{ 'dark-mode-box': getDarkMode }" class="allContent">
        <!-- <div v-if="isLoading">
          <BoxSkeletonLoader v-for="n in 6" :key="n" />
        </div>
        <div v-if="false">
          <FinancialList
            :Financials="getTransactions"
          >
          </FinancialList>
        </div> -->
        
        <!-- Pull Payments -->
        <FinancialList paymentType="Pull">
        <template #title>
          <h2>Pull Payments</h2>
        </template>
        </FinancialList>
        <!-- push Payments -->
        <FinancialList paymentType="Add">
          <template #title>
            <h2>push Payments</h2>
          </template>
        </FinancialList>
        <!-- <NoData v-if="true" context="transactions"></NoData> -->
      </div>
      
    </div>
  </template>


<script>
  import { mapState, mapActions } from 'pinia'
  
  //store
  import { useTransactionsStore } from '@/store/transactions/transactions.js';
  
  
// componnents

  // NoData
  // import NoData from "@/shared/components/noData/NoData.vue";
 
  // Skeleton Box
  // import BoxSkeletonLoader from '@/shared/components/loading/skeletonLoader/BoxSkeletonLoader.vue';
  
  // Financial List 
  import FinancialList from '@/components/users/financial/randomFinancial/FinancialList.vue';
  
  //  TotalBalance
  import TotalBalance from "@/components/users/financial/randomFinancial/TotalBalance.vue"
  //  AddPayment
  import AddPayment from "@/components/users/financial/randomFinancial/AddPayment.vue"
      
  // mixins 
  import dateFilterMixin from '@/mixins/dateFilterMixin';

  export default {
    name: "RandomFinancial",
    components: {
      // NoData,
      // BoxSkeletonLoader,
      FinancialList,
      TotalBalance,
      AddPayment,
      
    },
    mixins: [dateFilterMixin],
    computed: {
      getDarkMode() {
        return this.$store.state.darkMode;
      },
      ...mapState(useTransactionsStore, ['userTransactions']),
  
      // ============ filter => start=======================================

      getTransactions() { 
        console.log(this.userTransactions)
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
     
        selectedFilter: 'lastMonth',
        profileId: null,
        isLoading: true,

      };
    },
  };
  </script> 
  


<style scoped lang="scss">
  .allContent{
    background-color: hsl(0, 100%, 98%);
  }
  .allContent > div {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: 49%;
    min-height: 380px;  
  }
  .add-payment{
    width: 96%;
    margin: auto;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    // background-color: red;
  }
  @media (max-width: 768px) {
    .add-payment{
    width: 100%;

  }
  .allContent > div {
    width:100%;
  }
  }
 
</style>
  