<template>
    <div class="details">
      <div class="title">
        <div>
          <div class="contTitle">
            <div>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUQUVkx6lAgtb3-3fMuDZnDixihOSrrNSAOg&usqp=CAU" />
            </div>
            <p :class="{ 'dark-mode-title': getDarkMode }">Details grid</p>
          </div>
          <div>
            <div class="export">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmvEXj1Sr-tzeKuEP9PgzajIUDvR_-L-zfkg&usqp=CAU" />
              <button>png</button>
            </div>
            <button @click="print" class="generate">
              <font-awesome-icon class="printIcon" icon="fa-solid fa-print" />
              <p>print</p>
            </button>
          </div>
        </div>
      </div>
      <div :class="{ 'dark-mode-box': getDarkMode }" class="details_allContent">
        <DetailsSkeleton v-if="isLoading" />
        <ShowDetails v-else-if="transactionInfo" :transactionInfo="transactionInfo"  ></ShowDetails>
      </div>
     
    </div>
  </template>

    <script>

    
    import { mapActions } from 'pinia';
    import { useTransactionsStore } from '@/store/transactions/transactions.js';
    
    // ShowDetails
    import ShowDetails from "@/components/users/financial/ShowDetails.vue";
    
    // Skeleton Details 
    import DetailsSkeleton from '@/shared/components/loading/skeletonLoader/DetailsSkeleton.vue';


    export default {
      name: "DetailsTransaction",
      components: {
      DetailsSkeleton,
      ShowDetails,
    },

      computed: {


        getDarkMode() {
          return this.$store.state.darkMode;
        },
       
      },
      async created() {
         
        this.transactionId = this.$route.params.transactionId
        await this.loadTransaction(this.transactionId);
        this.isLoading = false;

      },
      methods: {
        ...mapActions(useTransactionsStore, ['fetchTransactionById']),

        async loadTransaction(transactionId) {
        const transaction = await this.fetchTransactionById(transactionId);
        if (transaction) {
            this.transactionInfo = transaction  
        }
    },
        print() {
          window.print();
        },
      
      },
      data() {
        return {
          transactionId: '',
          transactionInfo: null,
          isLoading:true,

        };
      }
    };
    </script>
      <style scoped lang="scss">
    
              // global style in path =>  src/scss/global/_globalStyle.scss    
      
    </style>
    