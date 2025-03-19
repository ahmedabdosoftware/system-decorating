<template>
  <div :class="{ 'dark-mode': getDarkMode }" class="ListTable">
    <div class="show__table">
      <table class="table">
        <thead>
          <tr>
            <th>تاريخ الدفع</th>
            <th>المبلغ</th>
            <th v-if="!isTechnical">نوع الدفع</th>
          </tr>
        </thead>
        <tbody v-if="transactionInfo.payments">
          <tr v-for="(payment, index) in filteredPayments" :key="index">
            <td>{{ payment.transactionDate }}</td>
            <td>{{ payment.amount }}</td>
            <td v-if="!isTechnical">{{ getPaymentType(payment.type) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr v-if="isTechnical">
            <td>{{ transactionInfo.amount }}</td>
            <th colspan="2">المستحق (فني)</th>
          </tr>
          <tr v-if="isManufacturing">
            <td>{{ transactionInfo.manufacturingAmount }}</td>
            <th colspan="2">المستحق (مصنعية)</th>
          </tr>
          <tr v-if="isMaterial">
            <td>{{ transactionInfo.amount }}</td>
            <th colspan="2">المستحق (خامات)</th>
          </tr>
          <tr>
            <td>{{ remainingAmount }}</td>
            <th colspan="2">الباقي</th>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "FinancialListPayments",
  props: ["transactionInfo", "isMaterialActiveOrTechnical"],

  computed: {
    getDarkMode() {
      return this.$store.state.darkMode;
    },
    // التحقق من نوع المعاملة (فني)
    isTechnical() {
      return this.transactionInfo.transactionType === "فنى";
    },
    // التحقق من نوع المعاملة (مصنعية)
    isManufacturing() {
      return (
        this.transactionInfo.transactionType === "عميل" &&
        !this.isMaterialActiveOrTechnical
      );
    },
    // التحقق من نوع المعاملة (خامات)
    isMaterial() {
      return (
        this.transactionInfo.transactionType === "عميل" &&
        this.isMaterialActiveOrTechnical
      );
    },
    // تصفية الدفعات حسب الحالة
    filteredPayments() {
      if (this.isTechnical) {
        return this.transactionInfo.payments;
      } else if (this.isMaterial) {
        return this.transactionInfo.payments.filter(
          (payment) => payment.type === "material"
        );
      } else if (this.isManufacturing) {
        return this.transactionInfo.payments.filter(
          (payment) => payment.type === "industrial"
        );
      }
      return [];
    },
    remainingAmount() {
      let totalPayments = 0;
      if (this.filteredPayments) {
        totalPayments = this.filteredPayments.reduce(
          (total, payment) => total + parseFloat(payment.amount),
          0
        );
      }

      if (this.isTechnical) {
        return (
          parseFloat(this.transactionInfo.amount || 0) - totalPayments
        ).toFixed(2);
      } else if (this.isManufacturing) {
        return (
          parseFloat(this.transactionInfo.manufacturingAmount || 0) -
          totalPayments
        ).toFixed(2);
      } else if (this.isMaterial) {
        return (
          parseFloat(this.transactionInfo.amount || 0) - totalPayments
        ).toFixed(2);
      }
      return null;
    },
  },
  methods: {
    getPaymentType(type) {
      return type === "material" ? "خامات" : "مصنعية";
    },
  },
  created() {
    console.log(this.transactionInfo.payments);
  },
};
</script>

<style scoped lang="scss">
// global style in path =>  src/scss/global/_globalStyle.scss

.ListTable {
  display: flex;
  justify-content: center;
}
.show__table {
  width: 90%;
}
thead,
tfoot {
  position: relative;
  z-index: 1;
  background-color: white !important;
  // overflow: hidden;
}

thead::before,
tfoot::before {
  content: "";
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: -1;
}
thead::before {
  background-color: var(--popularCalar);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
tfoot::before {
  background-color: rgb(184, 186, 186);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
tfoot {
  // background-color: red;
  color: white;
}
tbody {
  background-color: rgb(241, 243, 243);
  background-color: rgb(241, 240, 237);
}
</style>
