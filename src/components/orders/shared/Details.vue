<template>
    <div class="order-details-container respo-form-order">
      <h3 class="details-selection-title">Details</h3>
      <!-- Order Status and Order Number -->
      <div class="form-row">
        <div class="form-item">
          <font-awesome-icon icon="list" class="form-icon" />
          <select v-model="orderStatus" class="form-input">
            <option value="0">معلق</option>
            <option value="1">مؤكد</option>
            <option value="3">منتهى</option>
          </select>
        </div>
        <div class="form-item">
          <font-awesome-icon icon="hashtag" class="form-icon" />
          <input
            type="text"
            class="form-input"
            placeholder="Order Number"
            v-model="orderNumber"
          />
        </div>
      </div>
  
      <!-- Upload Design -->
        <div class="upload-field">
            <div class="upload-text">
                <font-awesome-icon icon="upload" class="icon" />
                <span>Upload Design</span>
            </div>
            <label class="upload-button">
                <input type="file" @change="handleFileUpload" />
                <font-awesome-icon icon="chevron-right" class="arrow-icon" />
            </label>
        </div>
  
      <!-- Discounts and Manual Labor Cost -->
      <div class="form-item with-label">
         <label class="input-label"> Manual Labor Cost</label>
          <input
            type="number"
            id="manualLaborCost"
            class="form-input"
            placeholder="Enter Labor"
            v-model="manualLaborCost"
            />
            <!-- @input="updatemanualLaborCost" -->
        </div>

         <!-- Choose options -->
         <div class="choose-option m-top">
            <div class="choose-text">
              <font-awesome-icon icon="receipt" class="icon" />
              <span>Appear Discount In Fatora</span>
            </div>
            <label class="check-button">
                <!-- <span>---</span> -->
                <input type="checkbox" v-model="displaySale" />
            </label>
        </div>
        
         <div class="choose-option">
            <div class="choose-text">
              <font-awesome-icon icon="eye" class="icon" />
              <span> clinte see both invoices?</span>
            </div>
            <label class="check-button">
                <!-- <span>---</span> -->
                <input type="checkbox" v-model="displayTowInvoice" />
            </label>
        </div>

        <div class="choose-option">
            <div class="choose-text">
              <font-awesome-icon icon="wrench" class="icon" />
              <span>Appear Lapor In Table</span>
            </div>
            <label class="check-button">
                <!-- <span>---</span> -->
                <input type="checkbox" v-model="displayInstallation" />
            </label>
        </div>

        <div  v-if="displayInstallation" class="form-item with-label">
         <label class="input-label"> fixed Installation ؟</label>
          <input
            type="number"
            id="manualLaborCost"
            class="form-input"
            placeholder="Enter Labor"
            v-model="fixedInstallation"
            />
            <!-- @input="updatemanualLaborCost" -->
        </div>
        
        <!-- Notes -->
        <div class="formbold-mb-3">
            <label for="message" class="formbold-form-label">
            Notes
            </label>
            <textarea
            rows="6"
            id="message"
            class="formbold-form-input"
            v-model="notes"

            ></textarea>
        </div>
        
    </div>
  </template>
  
  <script>
  export default {
  name: "OrderDetailsComponent",
  props: {
    initialOrderStatus: {
      type: String,
      default: "0",
    },
    initialOrderNumber: {
      type: String,
      default: "",
    },
    initialManualLaborCost: {
      type: String,
      default: "",
    },
    initialNotes: {
      type: String,
      default: "",
    },
    initialDisplaySale: {
      type: Boolean,
      default: true,
    },
    initialDisplayTowInvoice: {
      type: Boolean,
      default: false,
    },
    initialDisplayInstallation: {
      type: Boolean,
      default: false,
    },
    initialFixedInstallation: {
      // type: Number,
      default: 0,
    },
    initialFile: {
      type: File,
      default: null,
    },
  },
  data() {
    return {
      orderStatus: this.initialOrderStatus,
      orderNumber: this.initialOrderNumber,
      manualLaborCost: this.initialManualLaborCost,
      notes: this.initialNotes,
      displaySale: this.initialDisplaySale,
      displayTowInvoice: this.initialDisplayTowInvoice,
      displayInstallation: this.initialDisplayInstallation,
      fixedInstallation: this.initialFixedInstallation,
      file: this.initialFile,
    };
  },
  watch: {
    // Watch for changes in props and update local data
    initialOrderStatus(newVal) {
      this.orderStatus = newVal;
    },
    initialOrderNumber(newVal) {
      this.orderNumber = newVal;
    },
    initialManualLaborCost(newVal) {
      this.manualLaborCost = newVal;
    },
    initialNotes(newVal) {
      this.notes = newVal;
    },
    initialDisplaySale(newVal) {
      this.displaySale = newVal;
      console.log("displaySale updated:", this.displaySale);
    },
    initialDisplayTowInvoice(newVal) {
      this.displayTowInvoice = newVal;
      console.log("displayTowInvoice updated:", this.displayTowInvoice);
    },
    initialDisplayInstallation(newVal) {
      this.displayInstallation = newVal;
      console.log("displayInstallation updated:", this.displayInstallation);
    },
    initialFixedInstallation(newVal) {
      this.fixedInstallation = newVal;
    },
    initialFile(newVal) {
      this.file = newVal;
    },

    // Watch for changes in local data and emit updates
    orderStatus() {
      this.emitDetails();
    },
    orderNumber() {
      this.emitDetails();
    },
    manualLaborCost() {
      this.emitDetails();
    },
    notes() {
      this.emitDetails();
    },
    displaySale() {
      this.emitDetails();
    },
    displayTowInvoice() {
      this.emitDetails();
    },
    displayInstallation() {
      this.emitDetails();
    },
    fixedInstallation() {
      this.emitDetails();
    },
    file() {
      this.emitDetails();
    },
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.file = file;
        console.log("File uploaded: inside child component", file);
      }
    },
    emitDetails() {
      const details = {
        status: this.orderStatus,
        number: this.orderNumber,
        laborPrice: this.manualLaborCost,
        notes: this.notes,
        displaySale: this.displaySale,
        displayTowInvoice: this.displayTowInvoice,
        displayInstallation: this.displayInstallation,
        fixedInstallation: this.fixedInstallation,
        file: this.file,
      };
      this.$emit("details-updated", details);
    },
  },
};
  </script>
  
  <style scoped lang="scss">
  .order-details-container {
    height: 795px;
    margin-bottom: 25px;
    // background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    // box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    box-shadow: 0px 4px 4px 4px rgba(0, 0, 0, 0.1);
    // background-color: red;
  }
  .details-selection-title {
    font-size: 22px;
    font-weight: 700;
    color: #333;
    text-align: start;
    }
  .form-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  .form-item {
    display: flex;
    align-items: center;
    width: 48%;
    position: relative;
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 0px 12px;
    // margin-right: 10px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  }
  .form-icon {
    margin-right: 10px;
    color: #555;
  }
  .form-input {
    flex: 1;
    padding: 10px;
    border: none;
    outline: none;
    background: none;
    font-size: 14px;
  }
.with-label{
    /* background-color: red; */
    width: 100%;
    height: 60px;
    flex-direction: column;
    align-items: flex-start;
    background-color: white;
    border-radius: 0px;
    padding: 10;
    box-shadow:none;
    margin-bottom: 35px;
    input{
        width: 70%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
    }
}
.input-label{
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #333;

}
  .upload-field,.choose-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px 15px;
  font-family: Arial, sans-serif;
  // background-color: red; 
  height: 60px;
}
.choose-option{
  margin-top: 10px;
}
.m-top{
  margin-top: 40px ;
}
.upload-text,.choose-text {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  /* background-color: green; */
}

.upload-text .icon , .choose-text .icon{
  margin-right: 8px;
  color: #888;
}

.upload-button , .check-button{
  cursor: pointer;
  position: relative;
}

.upload-button input[type="file"] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.arrow-icon {
  color: #888;
  font-size: 16px;
}
.formbold-form-input,.formbold-form-label{
    text-align: start;
}
.formbold-form-label{
  font-weight: 700;
  margin-top: 10px;
  margin-left: 7px;
}
@media (max-width: 477px) {
   
   .order-details-container {  
       margin-top: 80px;
       max-width: 360px;
       border-radius: 0px;

     }
     .form-input {
      width: 90px;
    }
     .form-item {
   
       margin-right: 5px;
     }
    }
   
  </style>
  