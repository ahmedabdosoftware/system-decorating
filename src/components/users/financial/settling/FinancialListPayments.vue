<template>
    <div :class="{ 'dark-mode': getDarkMode }" class="ListTable">
      <div class="show__table">
        <table class="table">
            <thead>
            <tr>
                <th>تاريخ الدفع</th>
                <th>المبلغ</th>
            </tr>
            </thead>
            <tbody v-if="transactionInfo.payments">
            <tr v-for="(payment, index) in transactionInfo.payments" :key="index">
                <td>{{ payment.transactionDate }}</td>
                <td>{{ payment.amount }}</td>
            </tr>
            </tbody>
         </table>
      </div>
    </div>
  </template>

<script>
  
  export default {
    name: "FinancialListPayments",
    components: {
    },
    props: ["transactionInfo"],
    data() {
      return {
      };
    },
    computed: {
      getDarkMode() {
        return this.$store.state.darkMode;
      },
    },
    methods: {
      openDropdownHandel(index) {
        if (this.openDropdownProp !== null && this.openDropdownProp !== index) {
          this.$refs.dropdownMenu[this.openDropdownProp].closeDropdown();
        }
        this.openDropdownProp = index;
      },
    },
  };
  </script>
  
  <style scoped lang="scss">
  
           // global style in path =>  src/scss/global/_globalStyle.scss
 
  </style>
  