<template>
    <div class="details-selection respo-form-order">
      <h3 class="details-selection-title">shipping cost Selection</h3>
      <div class="form-container">
        <!--  shipping -->
        <div class="form-item full-width" >

          <input
            type="text"
            id="shipping"
            class="form-input"
            placeholder="Enter shipping"
            v-model="shipping"
            @input="updateShipping"
          />
          
          <!-- custom Shipping -->
          <input
            type="text"
            id="customShipping"
            class="form-input"
            placeholder="EX: 300 + 200"
            v-model="customShipping"
            @input="updatecustomShipping"
          />

        </div>

        <div class="form-item">
          <!-- اختيار نوع الفاتوره -->
          <div class="form-item with-label">

            <label class="input-label"> order Type</label>
            <!-- <font-awesome-icon icon="calendar-alt" class="form-icon" /> -->
            <select  class="form-input select" name="occupation" id="occupation" v-model="invoiceType"   @change="updateinvoiceType">
              <option value="تركيب">تركيب</option>
              <option value="توريد"> توريد</option>
              <option value="تركيب وتوريد">تركيب وتوريد </option>
            </select>

          </div>
        <!--  حدد كوليكشن -->
          <div class="form-item with-label">
    
            <label class="input-label"> Invoices Group </label>
            <input
                type="text"
                id="Group"
                class="form-input"
                placeholder="EX: october"
                v-model="Group"
                @input="updateGroup"
              />
          </div>
      </div>
      </div>
    </div>
  </template>

<script>

export default {
  name: "ShippingAndTypeComponent",
  props: {
    initialShipping: {
      type: String,
      default: "",
    },
    initialCustomShipping: {
      type: String,
      default: "",
    },
    initialInvoiceType: {
      type: String,
      default: "تركيب وتوريد",
    },
    initialGroup: {
      type: String,
      default: "",
    },
  }, 
  data() {
    return {
      shipping: this.initialShipping,
      customShipping: this.initialCustomShipping,
      invoiceType: this.initialInvoiceType,
      Group: this.Group,
    };
  },
  methods: {
    updateShipping() {
      // Emit the location data to the parent component
      this.$emit("shipping-updated", this.shipping);
    },
    updatecustomShipping() {
      // Emit the date data to the parent component
      this.$emit("shippingShape-updated", this.customShipping);
    },
    updateinvoiceType() {
      // Emit the date data to the parent component
      this.$emit("orderType-updated", this.invoiceType);
    },
    updateGroup() {
      // Emit the date data to the parent component
      this.$emit("updateGroup-updated", this.Group);
    },
  },
  watch: {
      // Watch for changes in props and update local data
      initialShipping(newVal) {
        this.shipping = newVal;
      },
      initialCustomShipping(newVal) {
        this.customShipping = newVal;
        console.log(newVal)
      },
      initialInvoiceType(newVal) {
        this.invoiceType = newVal;
      },
      initialGroup(newVal) {
        this.Group = newVal;
      },
      
    },
};
</script>
  <style scoped>
.details-selection {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  /* box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); */
  box-shadow: 0px 4px 4px 4px rgba(0, 0, 0, 0.1);
  width: 470px;
  /* margin: auto; */
  height: 300px;
  /* background-color: red; */
}

.details-selection-title {
  font-size: 22px;
  font-weight: 700;
  color: #333;
  text-align: start;
}

.form-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-content: space-evenly;
}

.form-item {
  display: flex;
  align-items: center;
  gap: 12px;
  /* background-color: #f5f5f5; */
  border-radius: 8px;
  padding: 8px 12px;
  margin-right: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.full-width{
    width: 100%;
    height: 50px;
    padding: 8px 5px;
    display: flex;
    justify-content: space-evenly;
    border-radius: 4px;
    /* background-color: red; */

}
.with-label{
    /* background-color: red; */
    width: 100%;
    height: 90px;
    flex-direction: column;
    align-items: flex-start;
}
.input-label{
  margin-top: 10px;
  font-size: 17px;
  font-weight: 700;
  color: #333;

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
  height: 40px;
  border-radius: 6px;
  background-color: #f5f5f5;
  
}

@media (max-width: 477px) {
   
   .details-selection {  
       margin-top: 20px;
       max-width: 360px;
       border-radius: 0px;

     }
     .form-input {
      width: 90px;
    }
     .form-item {
   
       margin-right: 5px;
     }

     .input-label{
        font-size: 12px;
      }
    }
    
</style>
