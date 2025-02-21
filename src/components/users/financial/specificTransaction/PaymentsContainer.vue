<template>
    <div class="payments-container">
      <AddPaymentForm :moneyImage="moneyImage"  @update:payments="updatePayments" />
      <PaymentsList :payments="payments" @delete-payment="handleDelete" />

    </div>
  </template>
  
  <script>
  import AddPaymentForm from "@/components/users/financial/specificTransaction/AddPaymentForm.vue";
  import PaymentsList from "@/components/users/financial/specificTransaction/PaymentsList.vue";

  export default {
    props: {
      payments: {
        type: Array,
        required: true,
      },
    },
    components: {
      AddPaymentForm,
      PaymentsList,
    },
    data() {
      return {
        moneyImage: require("@/assets/images/Addpayment2.png"),         
      };
    },
    methods: {
    updatePayments(updatedPayments) {
     // Send To Parent After Update
      this.$emit("update:payments", updatedPayments);
    },

    handleDelete(index) {
      // Send To Parent After Delete
      this.$emit("delete-payment", index);
    },
  },
  };
  </script>
  
  <style scoped>
  .payments-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  </style>
  