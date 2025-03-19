<template>
  <div class="payments-list">
    <div v-for="(payment, index) in payments" :key="index" class="payment-row">
      <div class="note">{{ payment.note }}</div>
      <div class="date">{{ payment.date }}</div>
      <div class="amount">{{ payment.amount }}</div>
      <button class="delete-button" @click="deletePayment(index)">✕</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    payments: {
      type: Array,
      required: true,
    },
  },
  methods: {
    deletePayment(index) {
      this.$emit("delete-payment", index); // إرسال الحدث إلى المكون الأب
    },
  },
};
</script>

<style scoped>
.payments-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
  min-width: 320px;
  max-width: 450px;
}

.payment-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #d8d8d8;
  border-radius: 8px;
  padding: 15px;
  margin-top: 10px;
  position: relative;
}

.payment-row .note {
  position: absolute;
  top: -10px;
  left: 15px;
  background-color: #f7f7f9;
  font-size: 14px;
  font-weight: bold;
  color: #4a4a4a;
  padding: 0 5px;
}

.payment-row .date {
  font-size: 14px;
  font-weight: bold;
  color: #4a4a4a;
}

.payment-row .amount {
  font-size: 14px;
  font-weight: bold;
  color: #1e4ed8;
}

.delete-button {
  background-color: #ff4d4f;
  color: white;
  font-size: 12px;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #d9363e;
}

@media (max-width: 477px) {
  .payments-list {
    margin-bottom: 15px;
  }
}
</style>
