<template>
    <div class="financial-transaction-page">
        <!-- Title Section -->
        <div class="header">
            <h1 class="header_title">Create Transaction</h1>
        </div>
        <div class="financial-transaction-form">
          <TransictionInfo
            :initialFormData="formData"
            @update:formData="updateFormData"
            @save="handleSave"
          />
          <PaymentsContainer 
            @update:payments="updatePayments"
            @delete-payment="handleDelete"
            :payments="payments"  />
        </div>
        <CircleLoader :show="isLoading" />
    </div>
  </template>
  
  <script>

  import { mapActions } from 'pinia';

  // store
  import { useTransactionsStore } from '@/store/transactions/transactions.js';
  import TransictionInfo from "@/components/users/financial/specificTransaction/TransictionInfo.vue";
  import PaymentsContainer from "@/components/users/financial/specificTransaction/PaymentsContainer.vue";
  // CircleLoader
  import CircleLoader from '@/shared/components/loading/CircleLoader.vue';
  // sweetalert 
  import sweetalert from "sweetalert";

  export default {
    components: {
      TransictionInfo,
      PaymentsContainer,
      CircleLoader,
    },
    data() {
    return {
      formData: {
        selectedType: "both",
        location: "",
        orderLink: "",
        date: "",
        note: "",
        status: "open",
        userId:"",
        typesData: [
        { type: "materials", totalAmount: 0, remainingValue: 0 },
        { type: "manufacturing", totalAmount: 0, remainingValue: 0 },
        { type: "both", totalAmount: 0, remainingValue: 0 },
      ],
      },
      payments: [],
      userId:"",
      
      // loading 
      isLoading: false

    };
  },
  methods: {
    ...mapActions(useTransactionsStore, ['addSpecificTransaction', 'fetchSpecificTransactions']),

    updateFormData(updatedFormData) {
      this.formData = { ...updatedFormData };
      this.calculateRemainingValue();
      console.log("Updated Form Data:", this.formData);
    },

    updatePayments(updatedPayments) {
      this.payments.push( { ...updatedPayments ,paymentType:this.formData.selectedType  });
      this.calculateRemainingValue();
      console.log("Updated Payments:", this.payments);
    },
    handleDelete(index) {
      this.payments.splice(index, 1);
      this.calculateRemainingValue();
    },
    calculateRemainingValue() {

      // Reset remaining values for all types
      this.formData.typesData.forEach(typeData => {
        typeData.remainingValue = typeData.totalAmount; 
      });
      // set remaining Value for all types
      this.payments.forEach(payment => {
        const typeData = this.formData.typesData.find(type => type.type === payment.paymentType);
        if (typeData) {
          typeData.remainingValue -= parseFloat(payment.amount || 0); 
        }
      });

      console.log("Updated Types Data with Remaining Values:", this.formData.typesData);
    },

    async handleSave() {
      this.isLoading = true;
      console.log("Save Triggered with Data:", this.formData);
      const newTransaction = {
        ...this.formData,
        userId: this.userId,
        payments: this.payments, 
      };

      const transactionId = await this.addSpecificTransaction(newTransaction);
      console.log("Transaction saved with ID:", transactionId);
      this.isLoading = false;
      sweetalert({
            text: "created",
            icon: "success",
          });

    },

    },

    async created() {      
     this.userId = this.$route.params.profileId;
     console.log("here",this.userId)
     

  },

  };
  </script>
  
  <style scoped>
  .financial-transaction-page {
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    padding: 20px;
  }
  .financial-transaction-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }
  .header {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-height: 70px;
    margin-left: 20px;
}

.header_title {
  font-size: 32px;
  font-weight: bold;
  margin: 0;
}

@media (max-width: 477px) {
    
    .financial-transaction-page {
        padding: 0px;
    }
    .header {   
    min-height: 50px;
    justify-content: center;
    /* background-color: red; */
}

    .header_title {
      font-size: 25px;
    }
 
      
      

}
  </style>
  