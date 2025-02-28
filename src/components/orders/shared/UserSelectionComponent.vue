<template>
    <div class="user-selection respo-form-order">
      <h3 class="user-selection-title">Client - Tech Selection</h3>
      <div class="form-container">
        <!-- اختيار العميل -->
        <div class="form-item respo-form-item">
          <FontAwesomeIcon icon="user" class="form-icon" />
          <input
            list="customerList"
            id="customer"
            class="form-input"
            placeholder="Search for a customer"
            v-model="selectedCustomer"
            @input="updateCustomerId"
          />
          <datalist id="customerList">
            <option
              v-for="customer in clientUsers"
              :key="customer.id"
              :value="customer.name"
            ></option>
          </datalist>
        </div>
  
        <!-- اختيار الفني -->
        <div class="form-item respo-form-item">
          <FontAwesomeIcon icon="tools" class="form-icon" />
          <input
            list="technicalList"
            id="technical"
            class="form-input"
            placeholder="Search for a technician"
            v-model="selectedTechnical"
            @input="updateTechnicalId"
          />
          <datalist id="technicalList">
            <option
              v-for="tech in technicalUsers"
              :key="tech.id"
              :value="tech.name"
            ></option>
          </datalist>
        </div>
      </div>
    </div>
  </template>
  
  <script>

  import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

  // actions , states
  import { mapActions , mapState } from 'pinia'
  
  //store
  import { useGetUserStore } from '@/store/users/users.js';

  export default {
    name: "UserSelectionComponent",
    components: {
      FontAwesomeIcon,
    },

    props: {
    initialCustomerName: {
      // type: String,
      default: "",
    },
    initialCustomerId: {
      // type: Number,
      default: null,
    },
    initialCustomerInfo: {
      default: "",
    },
    initialTechnicalName: {
      // type: String,
      default: "",
    },
    initialTechnicalId: {
      // type: Number,
      default: null,
    },
    initialTechnicalInfo: {
      default: "",
    },
  },
  data() {
    return {
      selectedCustomer: this.initialCustomerName,
      customerId: this.initialCustomerId,
      customerInfo: this.initialCustomerInfo,
      selectedTechnical: this.initialTechnicalName,
      TechnicalId: this.initialTechnicalId,
      TechnicaInfo: this.initialTechnicalInfo,
    };
  },

    async created() {
      this.fetchUsers()
      console.log("from update page", this.initialCustomerName)
    },
    
    computed: {
      getDarkMode() {
        return this.$store.state.darkMode;
      },
      ...mapState(useGetUserStore, ['technicalUsers','clientUsers']),
    },
    methods: {
      ...mapActions(useGetUserStore, ['fetchUsers']),

      updateCustomerId() {
        const selectedCustomerObj = this.clientUsers.find(
          (customer) => customer.name === this.selectedCustomer
        );
        if (selectedCustomerObj) {
          this.customerId = selectedCustomerObj.id;
          this.customerInfo = selectedCustomerObj;
          // Emit to parent component
          this.$emit("customer-updated", {
            customerId: this.customerId,
            customerInfo: this.customerInfo,
            selectedCustomer: this.selectedCustomer,
          });
        } else {
          this.customerId = null;
          this.customerInfo = "";
          // Emit null values if not registered
          this.$emit("customer-updated", {
            customerId: this.customerId,
            customerInfo: this.customerInfo,
            selectedCustomer: this.selectedCustomer,

          });
        }
      },
      updateTechnicalId() {
        const selectedTechnicalObj = this.technicalUsers.find(
          (tech) => tech.name === this.selectedTechnical
        );
        if (selectedTechnicalObj) {
          this.TechnicalId = selectedTechnicalObj.id;
          this.TechnicaInfo = selectedTechnicalObj;
          // Emit to parent component
          this.$emit("technical-updated", {
            TechnicalId: this.TechnicalId,
            TechnicaInfo: this.TechnicaInfo,
            selectedTechnical: this.selectedTechnical,
          });
        } else {
          this.TechnicalId = null;
          this.TechnicaInfo = "";
          // Emit null values if not registered
          this.$emit("technical-updated", {
            TechnicalId: this.TechnicalId,
            TechnicaInfo: this.TechnicaInfo,
            selectedTechnical: this.selectedTechnical,

          });
        }
      },
    },
    watch: {
    // Watch for changes in props and update local data
    initialCustomerName(newVal) {
      this.selectedCustomer = newVal;
    },
    initialCustomerId(newVal) {
      this.customerId = newVal;
    },
    initialCustomerInfo(newVal) {
      this.customerInfo = newVal;
    },
    initialTechnicalName(newVal) {
      this.selectedTechnical = newVal;
    },
    initialTechnicalId(newVal) {
      this.TechnicalId = newVal;
    },
    initialTechnicalInfo(newVal) {
      this.TechnicaInfo = newVal;
    },
  },
  };
  </script>
  
  <style scoped>
  .user-selection {
    background-color: #ffffff;
    border-radius: 16px;
    padding: 24px;
    /* box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); */
    box-shadow: 0px 4px 4px 4px rgba(0, 0, 0, 0.1);
    width: 470px;
    /* margin: auto; */
    height: 160px;
  }
  
  .user-selection-title {
    font-size: 22px;
    font-weight: 700;
    color: #333;
    text-align: start;
    /* margin-bottom: 16px; */
  }
  
  .form-container {
    display: flex;
    justify-content: space-evenly;
    /* background-color: red; */
  }
  
  .form-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 8px 12px;
    margin-right: 10px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .form-icon {
    font-size: 18px;
    color: #4a90e2;
}
  
  .form-input {
    flex: 1;
    border: none;
    outline: none;
    background: none;
    font-size: 14px;
    color: #333;
    width: 160px;

  }
  @media (max-width: 477px) {
   
.user-selection {  
    margin-top: 20px;
    max-width: 360px;
    border-radius: 0px;

  }
  .form-input {
    width: 90px;
    font-size: 10px;
  }
  .form-item {

    margin-right: 5px;
  }
 }
 

  </style>
  