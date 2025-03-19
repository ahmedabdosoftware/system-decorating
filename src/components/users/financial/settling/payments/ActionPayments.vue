<template>
  <div>
    <div class="formbold-input-flex">
      <div>
        <label for="currentTransactionDate" class="formbold-form-label"
          >تاريخ استلام الدفعة</label
        >
        <ValidationProvider name="تاريخ استلام الدفعة" v-slot="{ errors }">
          <input
            type="date"
            class="formbold-form-input"
            id="currentTransactionDate"
            v-model="currentTransactionDate"
          />
          <span class="error">{{ errors[0] }}</span>
        </ValidationProvider>
      </div>
      <div>
        <label for="currentAmount" class="formbold-form-label">المبلغ</label>
        <ValidationProvider name="المبلغ" v-slot="{ errors }">
          <input
            type="number"
            class="formbold-form-input"
            placeholder="ادخل القيمة"
            id="currentAmount"
            v-model="currentAmount"
          />
          <span class="error">{{ errors[0] }}</span>
        </ValidationProvider>
      </div>
    </div>
    <div class="formbold-mb-3 spichial-cont-btns">
      <button class="addProduct-btn spichialAdd-btn" @click="clearTransaction">
        صفى المعامله
      </button>
      <button
        class="addProduct-btn spichialAdd-btn"
        :class="{
          'disabled-btn': currentTransactionDate == '' || currentAmount == '',
        }"
        :disabled="currentTransactionDate == '' || currentAmount == ''"
        @click="addPayment"
      >
        إضافة دفعة
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "pinia";

// store
import { useTransactionsStore } from "@/store/transactions/transactions.js";

// to make id for payment : use in (1) for-loop to show them (2) select to update
import { v4 as uuidv4 } from "uuid";

import { extend } from "vee-validate";
import { required, numeric, min_value } from "vee-validate/dist/rules";

// Register rules with custom messages

extend("required", {
  ...required,
  message: "{_field_} مطلوب",
});

extend("numeric", {
  ...numeric,
  message: "{_field_} يجب أن يكون رقمًا",
});

extend("min_value", {
  ...min_value,
  message: "{_field_} يجب أن يكون على الأقل {min}",
});

extend("date_format", {
  validate(value) {
    const regex = new RegExp("^\\d{4}-\\d{2}-\\d{2}$");
    return regex.test(value);
  },
  params: ["format"],
  message: "{_field_} يجب أن يكون بالتنسيق الصحيح {format}",
});

export default {
  name: "ActionPayments",
  props: ["transactionInfo", "isMaterialActiveOrTechnical"],

  components: {},
  computed: {
    getDarkMode() {
      return this.$store.state.darkMode;
    },
  },
  created() {},

  data() {
    return {
      currentTransactionDate: "",
      currentAmount: "",
    };
  },

  methods: {
    ...mapActions(useTransactionsStore, [
      "updateTransaction",
      "fetchTransactionsByUserId",
    ]),

    async addPayment() {
      if (!this.currentTransactionDate || !this.currentAmount) {
        alert("يرجى تعبئة كافة الحقول");
        return;
      }

      const newPayment = {
        id: uuidv4(),
        transactionDate: this.currentTransactionDate,
        amount: this.currentAmount.toString(),
      };

      if (this.transactionInfo.transactionType === "عميل") {
        newPayment.type = this.isMaterialActiveOrTechnical
          ? "material"
          : "industrial";
      }

      // إنشاء نسخة جديدة من `transactionInfo` وإضافة الدفع الجديد
      const updatedTransaction = { ...this.transactionInfo };
      updatedTransaction.payments = [
        ...(updatedTransaction.payments || []),
        newPayment,
      ];

      await this.updateTransaction(updatedTransaction);
      await this.fetchTransactionsByUserId(updatedTransaction.userId);

      this.currentTransactionDate = "";
      this.currentAmount = "";
    },

    async clearTransaction() {
      let totalAmount;
      let paymentType;

      if (this.transactionInfo.transactionType === "فنى") {
        // الحالة الفنية
        totalAmount = parseFloat(this.transactionInfo.amount) || 0;
        paymentType = null; // لا نحتاج تحديد نوع الدفع
      } else if (this.transactionInfo.transactionType === "عميل") {
        // الحالة العميل
        if (this.isMaterialActiveOrTechnical) {
          totalAmount = parseFloat(this.transactionInfo.amount) || 0; // إجمالي خامات
          paymentType = "material";
        } else {
          totalAmount =
            parseFloat(this.transactionInfo.manufacturingAmount) || 0; // إجمالي مصنعية
          paymentType = "industrial";
        }
      }

      // حساب المبلغ المدفوع بناءً على `paymentType` إذا كان محددًا (أي في حالة "عميل")
      const paidAmount = this.transactionInfo.payments
        .filter((payment) => !paymentType || payment.type === paymentType)
        .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

      const remainingAmount = totalAmount - paidAmount;

      if (remainingAmount > 0) {
        const newPayment = {
          id: uuidv4(),
          transactionDate: new Date().toISOString().split("T")[0], // تاريخ اليوم
          amount: remainingAmount.toString(),
          type: paymentType || null,
        };

        const updatedTransaction = { ...this.transactionInfo };
        updatedTransaction.payments = [
          ...(updatedTransaction.payments || []),
          newPayment,
        ];

        await this.updateTransaction(updatedTransaction);
        await this.fetchTransactionsByUserId(updatedTransaction.userId);

        alert("تمت تصفية المعاملة وإضافة دفعة جديدة لتغطية المبلغ المتبقي.");
      } else {
        alert("لا يوجد مبلغ متبقي لتصفية المعاملة.");
      }
    },
  },
};
//  console.log(pro)
</script>
<style scoped lang="scss">
.spichial-cont-btns {
  display: flex;
  justify-content: space-evenly;
}
.spichialAdd-btn {
  width: 100px;
}
</style>
