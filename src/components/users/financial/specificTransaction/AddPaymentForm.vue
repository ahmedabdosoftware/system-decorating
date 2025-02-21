<template>
  <div class="add-payment-form">
    <ValidationObserver ref="observer" v-slot="{ invalid }">
      <div class="money-image">
        <img :src="moneyImage" alt="Money" />
      </div>
      <div class="form-container">
        <span class="add-payment-info">
          Add Payment +
        </span>
        <div class="form-fields">
          <div class="field">
            <label class="m-btn-5">Notes</label>
            <input v-model="newPayment.note" type="text" placeholder="Write a note" />
          </div>
          <div class="field">
            <label class="m-btn-5">Date:</label>
            <ValidationProvider name="date" rules="required"  v-slot="{ errors }">
              <input v-model="newPayment.date" type="date" />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="field">
            <label class="m-btn-5">Value</label>
            <ValidationProvider name="Value" rules="required|numeric|min_value:1" v-slot="{ errors }">
              <input v-model="newPayment.amount" type="text" placeholder="Enter Value" />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
        </div>
        <button class="submit-button" :class="{ 'disabled-btn': invalid }" :disabled="invalid" @click="addPayment">Add Payment</button>
      </div>
    </ValidationObserver>

  </div>
</template>
 
  
  <script>

  import { extend } from 'vee-validate';
  import { required , numeric , min_value  } from 'vee-validate/dist/rules';

  // Register rules with custom messages

  extend('required', {
  ...required,
  message: '{_field_} مطلوب'
  
  });

  extend('numeric', {
  ...numeric,
  message: '{_field_} يجب أن يكون رقمًا'
  });

  extend('min_value', {
  ...min_value,
  message: '{_field_} يجب أن يكون على الأقل {min}'
  });

export default {
  props: {
    moneyImage: {
      type: String,
      required: true, // نمرر الصورة كـ prop
    },
  },
  data() {
    return {
      newPayment: {
        note: "",
        date: "",
        amount: "",
      },
    };
  },
  methods: {
    // Add
    addPayment() {
      const payment = { ...this.newPayment };
     
      // Reset
      this.newPayment = { note: "", date: "", amount: "" };
      // Emit To upfate
      this.$emit("update:payments",payment);
    },
  },
};
</script>
  
  <style scoped>
  .add-payment-form {
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    min-width: 320px;
    max-width: 450px;

  }
  
  .money-image {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .money-image img {
    width: 100px;
    height: auto;
  }
  
  .form-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .add-payment-info {
    text-align: center;
    padding: 10px 15px;
    background-color: #eef1f6;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    color: #4a4a4a;
  }
  
  
  .form-fields .field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    /* background-color: red; */
    margin-top: 10px;
  }
  
  .field label {
    font-size: 14px;
    font-weight: bold;
    color: #4a4a4a;
  }
  
  .field input {
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
  }
  
  .submit-button {
    padding: 10px;
    background-color: #1e4ed8;
    color: #fff;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    width: 80%;
    height: 45px;
    margin-top: 15px;
    margin: auto;
  }
  
  .submit-button:hover {
    background-color: #1741b0;
  }
  </style>
  