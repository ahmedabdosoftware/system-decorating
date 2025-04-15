<template>
  <div class="financial-transaction-container">
    <ValidationObserver ref="observer" v-slot="{ invalid }">
      <div class="financial-transaction">
        <!-- Title Section -->
        <div class="header">
          <h1 class="header_title">Transaction Information</h1>
          <h2 class="header_subtitle">💳 Amount Owed</h2>
        </div>
        <!-- Values Section -->
        <div class="values-section">
          <div class="value">
            <label for="total-amount" class="label-payment"
              >💰 Total Amount</label
            >
            <div class="amount-cont">
              <ValidationProvider
                name="total Amount "
                rules="required|numeric|min_value:1"
                v-slot="{ errors }"
              >
                <input
                  id="total-amount"
                  class="amount-input"
                  type="text"
                  v-model="selectedTypeData.totalAmount"
                  @input="
                    updateSelectedTypeValues('totalAmount', $event.target.value)
                  "
                  placeholder="Enter amount"
                  :readonly="formData.orderLink.length > 0"
                  :class="{ 'readonly-input': formData.orderLink.length > 0 }"
                />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>
              <font-awesome-icon
                v-show="formData.orderLink.length == 0"
                icon="edit"
                class="icon"
              />
            </div>
          </div>

          <div class="value">
            <label for="remaining-value" class="label-payment"
              >📉 Remaining Value</label
            >
            <div class="amount-cont">
              <input
                id="remaining-value"
                class="amount-input"
                type="text"
                v-model="selectedTypeData.remainingValue"
                @input="
                  updateSelectedTypeValues(
                    'remainingValue',
                    $event.target.value
                  )
                "
                placeholder="Enter remaining value"
                :readonly="formData.orderLink.length > 0"
                :class="{ 'readonly-input': formData.orderLink.length > 0 }"
              />
              <font-awesome-icon
                v-show="formData.orderLink.length == 0"
                icon="edit"
                class="icon"
              />
            </div>
          </div>

          <div class="value">
            <label for="used-values" class="label-payment"
              >🔄 Type Values</label
            >
            <select
              class="amount-input"
              v-model="formData.selectedType"
              @change="emitFormDataUpdate"
            >
              <option v-show="formData.orderLink.length == 0" value="materials">
                Materials
              </option>
              <option
                v-show="formData.orderLink.length == 0"
                value="manufacturing"
              >
                Manufacturing
              </option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>
      </div>

      <div class="payment-section">
        <h3 class="section-title">📝 Additional Information</h3>
        <div class="form-container">
          <!-- Location -->
          <div class="form-group">
            <label for="location" class="form-label">📍 Location</label>
            <input
              id="location"
              type="text"
              v-model="formData.location"
              @input="emitFormDataUpdate"
              class="form-input"
              placeholder="Enter location"
            />
          </div>

          <!-- Link to Order -->
          <!-- Link to Order -->
          <div class="form-group">
            <label class="form-label">🔗 الفواتير المرتبطة</label>
            <div class="invoice-list">
              <div
                class="invoice-item"
                v-for="(orderId, index) in formData.orderLink"
                :key="orderId"
                @click="goToInvoice(orderId)"
              >
                <font-awesome-icon icon="file-invoice" class="icon" />
                <span class="order-text">فاتورة رقم {{ index + 1 }}</span>
              </div>
            </div>
          </div>

          <!-- Date -->
          <div class="form-group">
            <label for="date" class="form-label">📅 Date</label>
            <ValidationProvider
              name="date"
              rules="required"
              v-slot="{ errors }"
            >
              <input
                id="date"
                type="date"
                v-model="formData.date"
                @change="emitFormDataUpdate"
                class="form-input"
              />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>

          <!-- Status -->
          <div class="form-group">
            <label for="status" class="form-label">📂 Status</label>
            <select
              class="form-input"
              v-model="formData.status"
              @change="emitFormDataUpdate"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <!-- Note -->
          <div class="form-group">
            <label for="note" class="form-label">🖋️ Note</label>
            <textarea
              id="note"
              v-model="formData.note"
              @input="emitFormDataUpdate"
              class="form-textarea"
              placeholder="Enter notes"
            ></textarea>
          </div>
        </div>

        <div class="button-container">
          <button
            class="save-btn"
            :class="{ 'disabled-btn': invalid }"
            :disabled="invalid"
            @click="emitSaveEvent"
          >
            💾 Save Transaction
          </button>
        </div>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
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

export default {
  props: {
    initialFormData: {
      // type: Object,
      required: true,
    },
  },
  data() {
    return {
      formData: { ...this.initialFormData },
    };
  },
  computed: {
    selectedTypeData() {
      return this.formData.typesData.find(
        (typeData) => typeData.type === this.formData.selectedType
      );
    },
  },
  methods: {
    emitFormDataUpdate() {
      this.$emit("update:formData", this.formData);
    },
    updateSelectedTypeValues(field, value) {
      if (this.selectedTypeData) {
        this.selectedTypeData[field] = value;
        this.emitFormDataUpdate();
      }
    },
    emitSaveEvent() {
      this.$emit("save");
    },
    goToInvoice(id) {
      console.log("enter go", id);
      const section = "Fatora";
      const profileId = this.$route.params.profileId;
      const layout = this.$route.meta.layout;
      console.log("enter go layout", layout);

      if (layout === "DashboardLayout") {
        this.$router.push(`/dashboard/${section}/${id}/"true"`);
      } else if (layout === "profileInDashboardLayout") {
        this.$router.push(
          `/dashboard/profile/${profileId}/${section}/${id}/"true"`
        );
      } else if (layout === "profileOutDashboardLayout") {
        this.$router.push(`/profile/${profileId}/${section}/${id}/"true"`);
      }
    },
  },
  watch: {
    initialFormData: {
      handler(newValue) {
        this.formData = newValue;
      },
      immediate: true,
    },
  },
};
</script>

<style scoped lang="scss">
.financial-transaction-container {
  // background-color: #f7f9fc;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}
.financial-transaction {
  // background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  // box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  max-width: 550px;
  margin: auto;
}
.header {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 70px;
  // background-color: #007bff;
}

.header_title {
  font-size: 26px;
  font-weight: bold;
  margin: 0;
}

.header_subtitle {
  font-size: 18px;
  margin-top: 25px;
}

.values-section {
  display: flex;
  flex-wrap: wrap;
  // background-color: red;
  justify-content: flex-start;
  margin-top: 35px;
}
.value {
  position: relative;
  // background-color: red;
  width: 160px;
  margin-right: 10px;
}
.amount-cont {
  display: flex;
  width: 100%;
  // background-color: red;
  justify-content: flex-start;
  align-items: flex-end;
}
.icon {
  //   color: #007bff;
  cursor: pointer;
  transition: transform 0.2s;
  margin-right: 30px;
  margin-bottom: 4px;
}

.icon:hover {
  transform: scale(1.1);
}
.value:not(.value:last-of-type)::after {
  content: "";
  position: absolute;
  right: 15px;
  top: 0px;
  width: 2px;
  height: 100%;
  background-color: #6c757d;
}

.label-payment {
  font-size: 14px;
  color: #a2a4a5;
}

.amount-input {
  font-size: 20px;
  font-weight: bold;
  color: #2d2d2d;
  border: none;
  background: transparent;
  width: 100%;
  outline: none;
  cursor: text;
  margin-top: 14px !important;
}

.amount-input:focus {
  outline: none;
  border-bottom: 1px solid #2d2d2d;
}

.payment-section {
  //   background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  //   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  max-width: 550px;
  margin: auto;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  color: #2d2d2d;
  text-align: start;
  margin-bottom: 20px;
}

.form-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-label {
  font-size: 14px;
  font-weight: bold;
  color: #6c757d;
}

.form-input,
.form-textarea {
  background-color: #f6f6fa;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
  color: #2d2d2d;
  outline: none;
  transition: border-color 0.3s;
}
select,
input {
  width: 200px;
}
select {
  font-size: 16px !important;
}
.form-input:focus,
.form-textarea:focus {
  border-color: #007bff;
}

.form-textarea {
  resize: none;
  height: 100px;
  width: 310px;
}

.button-container {
  text-align: start;
  margin-top: 40px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
}

.save-btn {
  background-color: #1e4ed8;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 5px;
  font-size: 16px;
  width: 190px;
  height: 40px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-btn:hover {
  background-color: #0056b3;
  color: white;
}
.amount-input.readonly-input {
  background-color: #f0f0f0;
  cursor: not-allowed;
  border-color: #ccc;
  color: #888;
}
.invoice-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
}

.invoice-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #f8f9fa;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: 0.2s ease;
}

.invoice-item:hover {
  background-color: #e2e6ea;
}

.invoice-item .icon {
  color: #007bff;
}

.order-text {
  font-weight: 500;
  color: #333;
}

@media (max-width: 477px) {
  .financial-transaction-container {
    width: 88%;
  }
  .value {
    margin-top: 20px;
    width: 250px;
  }
  .header {
    min-height: 30px;
  }
  .header_title {
    font-size: 18px;
  }
  .header_subtitle {
    font-size: 16px;
  }
  .value:not(.value:last-of-type)::after {
    width: 0px;
  }

  .form-textarea {
    width: 250px;
  }
  .save-btn {
    margin: auto;
    margin-top: 22px;
  }
  .section-title {
    font-size: 16px;
  }
}
</style>
