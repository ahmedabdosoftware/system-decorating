<template>
    <div class="details-selection respo-form-order">
      <h3 class="details-selection-title">Date - Location Selection</h3>
      <div class="form-container">
        <!-- اختيار المكان -->
        <div class="form-item respo-form-item">
          <font-awesome-icon icon="location-pin" class="form-icon" />
          <input
            type="text"
            id="location"
            class="form-input"
            placeholder="Enter location"
            v-model="selectedLocation"
            @input="updateLocation"
          />
        </div>
  
        <!-- اختيار التاريخ -->
        <div class="form-item respo-form-item">
          <font-awesome-icon icon="calendar-alt" class="form-icon" />
          <input
            type="date"
            id="date"
            class="form-input"
            v-model="selectedDate"
            @input="updateDate"
          />
        </div>
      </div>
    </div>
  </template>

<script>

export default {
  name: "DataLocationSelectionComponent",
  props: {
    initialLocation: {
      type: String,
      default: "",
    },
    initialDate: {
      type: String,
      default: "",
    },
  },
 
  data() {
    return {
      selectedLocation: this.initialLocation,
      selectedDate: this.initialDate,
    };
  },
  methods: {
    updateLocation() {
      // Emit the location data to the parent component
      this.$emit("location-updated", this.selectedLocation);
    },
    updateDate() {
      // Emit the date data to the parent component
      this.$emit("date-updated", this.selectedDate);
    },
  },
  watch: {
    initialLocation(newVal) {
      this.selectedLocation = newVal;
    },
    initialDate(newVal) {
      this.selectedDate = newVal;
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
  height: 160px;
}

.details-selection-title {
  font-size: 22px;
  font-weight: 700;
  color: #333;
  text-align: start;
}

.form-container {
  display: flex;
  justify-content: space-evenly;
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
    }
</style>
