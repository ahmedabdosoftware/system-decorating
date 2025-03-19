<template>
  <div>
    <div class="formbold-input-flex">
      <div class="three-input-inLine">
        <label for="numberOfDayesPaid" class="formbold-form-label"
          >خد منهم كام</label
        >
        <input
          type="number"
          class="formbold-form-input"
          placeholder="ادخل القيمة"
          id="numberOfDayesPaid"
          v-model="editableNumberOfDayesPaid"
        />
      </div>
      <div class="three-input-inLine">
        <label for="numberOfDayes" class="formbold-form-label">لكام يوم</label>
        <input
          type="number"
          class="formbold-form-input"
          placeholder="ادخل القيمة"
          id="numberOfDayes"
          v-model="editableNumberOfDayes"
        />
      </div>
      <div class="three-input-inLine">
        <label for="DailyIndustrialPrice" class="formbold-form-label">
          {{ this.kind == "Technical" ? "يوميه الصنايعى" : "يوميه المساعد" }}
        </label>
        <input
          type="number"
          class="formbold-form-input"
          placeholder="ادخل القيمة"
          id="DailyIndustrialPrice"
          v-model="editableDailyIndustrialPrice"
        />
      </div>
    </div>
    <div v-if="nameOfAssistant" class="formbold-mb-3 m-rgt">
      <label for="nameOfAssistant" class="formbold-form-label">
        اسم المساعد
      </label>
      <input
        type="text"
        id="nameOfAssistant"
        readonly
        class="formbold-form-input formbold-mb-3"
        v-model="nameOfAssistant"
      />
    </div>
    <div
      @click="updateSingleTransaction"
      class="formbold-mb-3 spichial-cont-btns"
    >
      <button class="addProduct-btn">تحديث المعاملة</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "pinia";

// store
import { useTransactionsStore } from "@/store/transactions/transactions.js";

export default {
  name: "FinancialDaily",
  props: ["transactionInfo", "kind"],

  data() {
    return {
      editableNumberOfDayesPaid:
        this.kind === "Technical"
          ? this.transactionInfo.numberOfDayesPaid
          : this.transactionInfo.numberOfDayesPaidAssistant,
      editableNumberOfDayes:
        this.kind === "Technical"
          ? this.transactionInfo.numberOfDayes
          : this.transactionInfo.numberOfDayesAssistant,
      editableDailyIndustrialPrice:
        this.kind === "Technical"
          ? this.transactionInfo.DailyIndustrialPrice
          : this.transactionInfo.DailyIndustrialPriceAssistant,
    };
  },

  computed: {
    nameOfAssistant() {
      return this.kind === "Assistant"
        ? this.transactionInfo.nameOfAssistant
        : "";
    },
  },
  created() {
    console.log("hi");
    console.log(document.querySelector(".addProduct-btn"));
  },
  methods: {
    ...mapActions(useTransactionsStore, [
      "updateTransaction",
      "fetchTransactionsByUserId",
    ]),

    async updateSingleTransaction() {
      console.log("entered");

      try {
        // إعداد البيانات للتحديث بناءً على نوع المعاملة
        const updatedData = { ...this.transactionInfo };

        if (this.kind === "Technical") {
          console.log("Technical");
          updatedData.numberOfDayesPaid = this.editableNumberOfDayesPaid;
          updatedData.numberOfDayes = this.editableNumberOfDayes;
          updatedData.DailyIndustrialPrice = this.editableDailyIndustrialPrice;
        } else if (this.kind === "Assistant") {
          console.log("Assistant");
          updatedData.numberOfDayesPaidAssistant =
            this.editableNumberOfDayesPaid;
          updatedData.numberOfDayesAssistant = this.editableNumberOfDayes;
          updatedData.DailyIndustrialPriceAssistant =
            this.editableDailyIndustrialPrice;
        }

        // تنفيذ تحديث المعاملة في قاعدة البيانات
        await this.updateTransaction(updatedData);
        await this.fetchTransactionsByUserId(updatedData.userId);

        alert(" تم التعديل");
      } catch (error) {
        console.error("Error updating transaction:", error);
        alert("حدث خطأ");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.spichial-cont-btns {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 40px;
  position: relative;
}
</style>
