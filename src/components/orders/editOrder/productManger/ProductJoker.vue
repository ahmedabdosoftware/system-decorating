<template>
  <div class="product-manager respo-form-order">
    <h3 class="product-manager-title">Joker Field</h3>

    <!-- اختيار الحقل للتعديل -->
    <div>
      <label for="addedFields" class="formbold-form-label">Added Field</label>
      <select
        class="formbold-form-input"
        v-model="selectedFieldId"
        id="addedFields"
        @change="loadSelectedField"
      >
        <option v-for="field in addedFields" :value="field.id" :key="field.id">
          {{ field.name || "Unnamed Field" }}
        </option>
      </select>
    </div>

    <!-- النموذج الخاص بالحقل -->
    <div class="formbold-input-flex">
      <div>
        <label for="name" class="formbold-form-label">Name</label>
        <input
          type="text"
          id="name"
          placeholder="Enter Name"
          class="formbold-form-input"
          v-model="currentField.name"
        />
      </div>
      <div>
        <label for="category" class="formbold-form-label">Category</label>
        <input
          type="text"
          id="category"
          placeholder="Enter Category"
          class="formbold-form-input"
          v-model="currentField.category"
        />
      </div>
    </div>

    <div class="formbold-input-flex">
      <div>
        <label for="quantity" class="formbold-form-label">Quantity</label>
        <input
          type="number"
          id="quantity"
          placeholder="Enter Quantity"
          class="formbold-form-input"
          v-model.number="currentField.quantity"
        />
      </div>
      <div>
        <label for="value" class="formbold-form-label">Value</label>
        <input
          type="number"
          id="value"
          placeholder="Enter Value"
          class="formbold-form-input"
          v-model.number="currentField.value"
        />
      </div>
    </div>

    <!-- خيارات إضافية -->
    <div class="choose-group_option" v-if="currentField.name || currentField.category">
      <div class="choose-option">
        <div class="choose-text">
          <font-awesome-icon icon="question-circle" class="icon" />
          <span> Should this field affect the invoice calculations?</span>
        </div>
        <label class="check-button">
            <!-- <span>---</span> -->
            <input type="checkbox"  v-model="currentField.willBeCalculated"  />
        </label>
      </div>
      <div  v-if="currentField.willBeCalculated" class="choose-option">
        <div class="choose-text">
          <font-awesome-icon icon="tools" class="icon" />
          <span> Include it in installation costs?</span>
        </div>
        <label class="check-button">
            <!-- <span>---</span> -->
            <input type="radio" value="installation"   v-model="currentField.calculationType"/>
        </label>
      </div>
      <div  v-if="currentField.willBeCalculated" class="choose-option">
        <div class="choose-text">
          <font-awesome-icon icon="cubes" class="icon" />
          <span> Include it in material costs?</span>
        </div>
        <label class="check-button">
            <!-- <span>---</span> -->
            <input type="radio" value="material" v-model="currentField.calculationType"/>
        </label>
      </div>
    </div>
    
    <div v-if="currentField.name && currentField.willBeCalculated && currentField.calculationType == 'material' "> 
      <label class="formbold-form-label" >buy price </label>
      <ValidationProvider
        name="buy Price"
        rules="double:1|min_value:0"
        v-slot="{ errors }"
      > 
        <input v-model.number="currentField.purchaseCost" placeholder="type here" type="number"  class="formbold-form-input" />
        <span class="error">{{ errors[0] }}</span>
      </ValidationProvider>
    </div>
    <div class="formbold-input-flex" v-if="currentField.name && currentField.willBeCalculated && currentField.calculationType == 'material' ">
      <div>
        <label class="formbold-form-label" > discount </label>
        <ValidationProvider
          name="Price With Labor"
          rules="required|double:1|min_value:0"
          v-slot="{ errors }"
        >
        <input class="formbold-form-input" v-model.number="currentField.valueDiscountOnBuy" placeholder="type here" type="number" />
        <span class="error">{{ errors[0] }}</span>
        </ValidationProvider>
      </div>
      <div>
        <label class="formbold-form-label" >  Type </label>
        <select class="formbold-form-input"  v-model.number="currentField.kindDiscount">
          <option value="fixed" >
          ثابت
          </option>
          <option  value="percentage">
          نسبة
          </option>
        </select>  
      </div>
    </div>


    <!-- أزرار العمليات -->
    <div class="formbold-mb-3 cont_add_del_upda">
      <button @click="addField" class="addProduct-btn">Add</button>
      <button @click="updateField" :disabled="!selectedFieldId" class="updateProduct-btn">Edit</button>
      <button @click="deleteField" :disabled="!selectedFieldId" class="deleteProduct-btn">Delete</button>
      <button @click="cancelEdit" class="cancelChangeProduct-btn">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    addedFields: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedFieldId: null,
      currentField: this.getEmptyField(),
    };
  },
  methods: {
    getEmptyField() {
      return {
        id: null,
        name: "",
        category: "",
        quantity: 1,
        value: 0,
        willBeCalculated: false,
        calculationType: "",
        purchaseCost: 0,
        valueDiscountOnBuy: 0,
        kindDiscount: "fixed",
        price_offer: 0,
      };
    },
    addField() {
      const newField = {
        ...this.currentField,
        id: Date.now(),
        quantity: this.currentField.quantity || 1,
        value: this.currentField.value || 0,
      };

      this.addedFields.push(newField);

      this.$emit("updateFields", [...this.addedFields]);

      this.resetForm();
    },

    updateField() {
      const updatedFields = this.addedFields.map((field) =>
        field.id === this.selectedFieldId ? { ...this.currentField } : field
      );
      this.addedFields = updatedFields
      this.$emit("updateFields", [...this.addedFields]);
      this.resetForm();
      this.toggleButtons(false); 

    },
    deleteField() {
      const filteredFields = this.addedFields.filter(
        (field) => field.id !== this.selectedFieldId
      );
      this.addedFields = filteredFields
      this.$emit("updateFields", [...this.addedFields]);
      this.resetForm();
      this.toggleButtons(false); 

    },
    loadSelectedField() {
      const selectedField = this.addedFields.find(
        (field) => field.id === this.selectedFieldId
      );
      if (selectedField) {
        this.currentField = { ...selectedField };
        this.toggleButtons(true); 
      }
    },
    cancelEdit() {
      this.resetForm();
      this.toggleButtons(false); 

    },
    resetForm() {
      this.selectedFieldId = null;
      this.currentField = this.getEmptyField();
    },
    toggleButtons(isEditing) {
    const addButton = document.querySelector('.addProduct-btn');
    const updateButton = document.querySelector('.updateProduct-btn');
    const deleteButton = document.querySelector('.deleteProduct-btn');
    const cancelButton = document.querySelector('.cancelChangeProduct-btn');


    if (isEditing) {
      addButton.classList.add('addProduct-btn_hidde');
      updateButton.classList.add('updateProduct-btn_show');
      deleteButton.classList.add('deleteProduct-btn_show');
      cancelButton.classList.add('cancelChangeProduct-btn_show');

    } else {
      addButton.classList.remove('addProduct-btn_hidde');
      updateButton.classList.remove('updateProduct-btn_show');
      deleteButton.classList.remove('deleteProduct-btn_show');
      cancelButton.classList.remove('cancelChangeProduct-btn_show');

    }
  },
  },
  
 
};
</script>




<style scoped>
.product-manager{
    background-color: #ffffff;
    border-radius: 16px;
    padding: 24px;
    padding-bottom: 40px;
    /* box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); */
    box-shadow: 0px 4px 4px 4px rgba(0, 0, 0, 0.1);
    width: 470px;
    margin-top: 15px;
    margin-bottom: 25px;
    /* height: 300px; */
}
.product-manager-title {
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: #333;
    text-align: start;
  }
  .display-options{
  display: flex;
  justify-content: flex-start;
  align-items: end;
  padding-bottom: 10px;
}
.formbold-form-input,.formbold-form-label{
    text-align: start;
}

 
.choose-option:last-of-type{
    margin-bottom: 10px;

   }
@media (max-width: 477px) {
   
    .product-manager {  
       margin-top: 20px;
       max-width: 310px;
       border-radius: 0px;
       margin-bottom: 0px;

   
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
  
  