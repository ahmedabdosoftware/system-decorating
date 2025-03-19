<template>
  <div class="add-payment">
    <div class="form-container">
      <div class="content-wrapper">
        <!-- الجزء الأيسر: الفورم -->
        <div class="form-section">
          <div class="header">
            <div class="icon">✔️</div>
            <h3>Add Payment</h3>
          </div>
          <ValidationObserver ref="observer" v-slot="{ invalid }">
            <form @submit.prevent="setTransactionType('Add')">
              <div class="form-row">
                <div>
                  <label for="amount">Amount</label>
                  <ValidationProvider
                    name="Amount"
                    rules="required|numeric|min_value:1"
                    v-slot="{ errors }"
                  >
                    <input
                      id="amount"
                      type="number"
                      v-model="form.amount"
                      placeholder="Amount, Total"
                      required
                    />
                    <span class="error">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
                <div>
                  <label for="date">Date</label>
                  <input id="date" type="date" v-model="form.date" required />
                </div>
              </div>
              <div class="form-row">
                <div>
                  <label for="notes">Notes</label>
                  <input
                    id="notes"
                    type="text"
                    v-model="form.notes"
                    placeholder="Notes"
                    required
                  />
                </div>
              </div>
              <div class="actions">
                <button
                  type="button"
                  class="upload-button"
                  :class="{ 'disabled-btn': invalid }"
                  :disabled="invalid"
                  @click="setTransactionType('Add')"
                >
                  <img
                    class="iconAwesome"
                    :src="require('@/assets/icons/push.png')"
                  />
                  <span>Add</span>
                </button>
                <button
                  type="button"
                  class="deduct-button"
                  :class="{ 'disabled-btn': invalid }"
                  :disabled="invalid"
                  @click="setTransactionType('Pull')"
                >
                  <img
                    class="iconAwesome"
                    :src="require('@/assets/icons/pull.png')"
                  />
                  <span>Pull</span>
                </button>
                <div v-if="getRole == 'technical'" class="confirmation-toggle">
                  <div class="toggle-container" @click="toggleReduce">
                    <div
                      :class="['toggle-ball', { active: form.reduce }]"
                    ></div>
                  </div>
                  <span> Reduce</span>
                </div>
              </div>
            </form>
          </ValidationObserver>
        </div>

        <!-- الجزء الأيمن: الصورة -->
        <div class="image-section">
          <img
            src="../../../../assets/images/Addpayment.png"
            alt="Confirmation Icon"
            class="confirmation-image"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// stores
import { useRandomTransactionsStore } from "@/store/transactions/randomTransactions.js";
import { useGetUserStore } from "@/store/users/users.js";
import { mapActions } from "pinia";

export default {
  name: "AddPayment",
  computed: {
    getRole() {
      if (this.userInfo) {
        return this.userInfo.role;
      } else {
        return "";
      }
    },
  },
  methods: {
    ...mapActions(useRandomTransactionsStore, ["addRandomTransaction"]),
    ...mapActions(useGetUserStore, ["fetchSingleUser"]),

    toggleReduce() {
      this.form.reduce = !this.form.reduce;
    },
    setTransactionType(type) {
      this.form.type = type;
      this.submitTransaction();
    },
    async submitTransaction() {
      const transaction = {
        userId: this.profileId,
        role: this.userInfo.role,
        ...this.form,
        createdAt: new Date().toISOString(),
        category: "orderRandom",
      };

      // إرسال البيانات إلى المتجر
      await this.addRandomTransaction(transaction, this.profileId);

      // إعادة تعيين النموذج
      this.resetForm();
      alert("Transaction Added Successfully!");
    },
    resetForm() {
      this.form = {
        amount: null,
        date: null,
        notes: "",
        reduce: false,
        hidden: false,
        type: "",
      };
    },
  },
  data() {
    return {
      form: {
        amount: null,
        date: null,
        notes: "",
        reduce: false,
        type: "",
      },
      profileId: null,
      userInfo: null,
    };
  },
  async created() {
    this.profileId = this.$route.params.profileId;
    this.userInfo = await this.fetchSingleUser(this.profileId);
    console.log("Fetched user info:", this.userInfo);
  },
};
</script>

<style scoped lang="scss">
.add-payment {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // background-color: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  width: 80%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  /* background-color: forestgreen; */
}
.form-container {
  width: 90%;
  //  background-color: #333;
  height: 90%;
}
.content-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  /* background-color: #dc3545; */
}

.form-section {
  padding-right: 20px;
  width: 400px;
  height: 100%;
  /* background-color: fuchsia; */
}

.image-section {
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: red; */
  width: 400px;
  height: 100%;
}

.confirmation-image {
  width: 70%;
  height: 70%;
}

.header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.icon {
  font-size: 24px;
  color: green;
}

.form-container form {
  width: 100%;
}

.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  align-items: center;
}

.actions button {
  // padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-size: 12px;
  span:first-child {
    font-size: 24px;
    // background-color: gold;
  }
}

.upload-button {
  background-color: blue;
  color: white;
}

.deduct-button {
  background-color: blue;
  color: white;
}

.confirmation-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toggle-container {
  width: 50px;
  height: 24px;
  background-color: #ccc;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
}

.toggle-ball {
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: 0.3s;
}

.toggle-ball.active {
  left: 28px;
  background-color: #28a745;
}
.iconAwesome {
  width: 20px;
  height: 20px;
}
@media (max-width: 768px) {
  // tablet
}
@media (max-width: 450px) {
  .content-wrapper {
    flex-direction: column;
  }
  .image-section {
    display: none;
  }
  .form-container {
    width: 100%;
    // background-color: red;
  }
  .form-section {
    width: 100%;
  }
}
</style>
