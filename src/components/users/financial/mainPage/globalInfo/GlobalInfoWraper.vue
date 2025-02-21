<template>
  <div class="GlobalInfoWraper">
    <!-- الجزء العلوي: عنوان + البحث بالتاريخ -->
    <div class="GlobalInfoWraper_header">
      <h1 class="GlobalInfoWraper_title">Financial Management</h1>
      <div class="date-filter">
        <input type="date" class="date-input" v-model="selectedDate" @change="handleDateChange" />
      </div>
    </div>

    <!-- وصف نصي أسفل العنوان -->
    <p class="subtitle">
      Resullt an differin transaction title transcomm pos
    </p>

    <div class="boxes-row">
      <!-- المكوّن الأول -->
      <FinancialBox>
        <template #letter>
          <span>{{ getRole== 'technical' ? "T" :"M" }}</span>
        </template>
        <template #title>
           {{ getRole== 'technical' ? "Transiction" :"More" }}
        </template>
        <template #value>
          {{ getRole== 'technical' ? "----" : moreBalance }}
        </template>
      </FinancialBox>

      <!-- المكوّن الثاني -->
      <FinancialBox>
        <template #letter>
          <span>{{ getRole== 'technical' ? "e" :"O" }}</span>
        </template>
        <template #title>
            {{ getRole== 'technical' ? "expenses" :"One" }}
        </template>
        <template #value>
           {{ getRole== 'technical' ? "----" : oneBalance }}
        </template>
      </FinancialBox>

      <!-- المكوّن الثالث -->
      <FinancialBox>
        <template #letter>
          <span>T</span>
        </template>
        <template #title>
          Total{{ getRole== 'technical' ? " Pull" :"" }}

        </template>
        <template #value>
        {{ getRole== 'technical' ? "----" : totalBalance }}

        </template>
      </FinancialBox>

    </div>
  </div>
</template>

<script>
// stores
import { useGetUserStore } from '@/store/users/users.js';
import { useTransactionsStore } from '@/store/transactions/transactions.js';
import { useRandomTransactionsStore } from '@/store/transactions/randomTransactions.js';

import { mapState, mapActions } from 'pinia'
// componnents
import FinancialBox from "@/components/users/financial/mainPage/globalInfo/FinancialBox.vue";

export default {
  name: "FinancialContainer",
  components: { 
    FinancialBox,
  },
  data() {
    return {
      profileId: null,
      userInfo: null,
      moreBalance: 0,
      oneBalance: 0,
      totalBalance: 0,
      selectedDate: null, 

    };
  },
  methods: {
        ...mapActions(useGetUserStore, ['fetchSingleUser']),
        ...mapActions(useTransactionsStore, ["fetchSpecificTransactionByUserId"]),
        ...mapActions(useRandomTransactionsStore, ["fetchTransactionsByProfile"]),
        async calculateBalances() {

          // Get Transction  "One place" 
          await this.fetchSpecificTransactionByUserId(this.profileId);
          // Read Transction From Pinia Store
          const transactions = this.specificUserTransactions;

          // Get Transction  "more place" 
          await this.fetchTransactionsByProfile(this.profileId);          
          // Read Transctions balance From Pinia Store
          const moreBalance = this.balance;

          let moreBalanceCalc = 0;
          let oneBalanceCalc = 0;


          // Fetch "More than one place" transactions
          moreBalanceCalc = moreBalance

          // Fetch "One place" transactions
          //   Get Total Remaining Deprnds on typesData
          transactions.forEach((transaction) => {
            if (transaction.typesData && Array.isArray(transaction.typesData)) {
              let noBothWithTotal = true; 
              // If There Is Both 
              transaction.typesData.forEach((type) => {
                if (type.type === "both" && type.totalAmount) {
                  const remainingValue = parseFloat(type.remainingValue) || 0;
                  oneBalanceCalc += remainingValue; 
                  noBothWithTotal = false; 
                }
              });
              // calc remaining From Other Types If No Both
              if (noBothWithTotal) {
                transaction.typesData.forEach((type) => {
                  const remainingValue = parseFloat(type.remainingValue) || 0;
                  oneBalanceCalc += remainingValue; 
                });
              }
            }
          });


          // UP The Values That We Get
          this.moreBalance = moreBalanceCalc;
          this.oneBalance = oneBalanceCalc;
          this.totalBalance = moreBalanceCalc + oneBalanceCalc;
          },

          async handleDateChange() {
          // calc Again
          // await this.calculateBalances();
          console.log("No Thing yet")
        },
    },
    computed: {
      ...mapState(useTransactionsStore, ['specificUserTransactions']),
      ...mapState(useRandomTransactionsStore, ['balance']),
  
     getRole(){
      if(this.userInfo){
        return this.userInfo.role
      } else{
        return ""
      }
    }
   
    },
    async created() {
      this.profileId = this.$route.params.profileId;
      this.userInfo = await this.fetchSingleUser(this.profileId);
      console.log('Fetched user info:', this.userInfo); 

        // حساب الأرصدة
      await this.calculateBalances();
    },
};
</script>

<style scoped lang="scss">
.GlobalInfoWraper {
  // background-color:white; 
  padding: 20px;
  border-radius: 20px;
  width: 85%; 
  margin: 0 auto 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* الجزء العلوي: Title + Date  */
.GlobalInfoWraper_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  // background-color:red;
}

/* Title */
.GlobalInfoWraper_title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

/* Date  */
.date-filter {
  .date-input {
    padding: 8px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 14px;
    outline: none;
    transition: border-color 0.3s;
    &:hover,
    &:focus {
      border-color: #527ce6;
    }
  }
}

.subtitle {
  margin-top: 5px;
  margin-bottom: 15px;
  color: #999;
  font-size: 14px;
}

/* Boxes Row  */
.boxes-row {
  display: flex;
  flex-wrap: wrap; 
  gap: 20px;
}
@media (max-width: 477px) {
    
  .GlobalInfoWraper {
  margin-top:30px;
  margin-bottom:30px;
}
.GlobalInfoWraper_title {
  font-size: 18px;
  
}
    }
</style>
