<template>
    <div  class="product-manager respo-form-order">
      <h3 class="product-manager-title">Spichial invoice "Different Pricing" </h3>

        <div>
          <label for="addedOrders" class="formbold-form-label aline-end"> Added Products  </label>
          <select
            class="formbold-form-input"
            v-model="selectProductForUpdateProp"
            id="addedOrders"
            @change="selectProductForUpdate"
            placeholder=" اختر من المضافة المنتجات "
            >
            <option v-for="product in addedOrders" :value="product.id" :key="product.id">
              {{ product.name }}
            </option>
          </select>
        </div>
      
      <div class="formbold-input-flex">
        
        <div>
          <label for="ampuntOfIncrease" class="formbold-form-label aline-end"> amount Of Increase / decrease </label>
          <input
          type="number"
          id="ampuntOfIncrease"
          placeholder="ادخل قيمة الزيادة"
          class="formbold-form-input aline-end"
          v-model="amountOfIncrease"
          />
        </div>
        <div>  
          <label for="product" class="formbold-form-label aline-end">  Product  </label>
          <ValidationProvider name="المنتج"  :rules="`${addedOrders.length == 0 ? 'required' : ''}`"  v-slot="{ errors }">
            <input list="propList"  class="formbold-form-input aline-end"  placeholder="المنتج" v-model="selectedProduct" >
            
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      
      </div>
      <div class="formbold-input-flex">
        
        <div></div>
        <div>
          <label for="editOfInstallation" class="formbold-form-label aline-end"> Edit Of Installation   </label>
          <input
          type="number"
          id="editOfInstallation"
          placeholder="ادخل قيمة الجديدة"
          class="formbold-form-input aline-end"
          v-model="editOfInstallation"
          />
        </div>
      </div>
      
      <div class="formbold-mb-3 cont_add_del_upda">
        <button 
        @click.prevent="editProduct" 
        :disabled="!selectedProduct || (editOfInstallation <= 0 && amountOfIncrease == 0)" 
        class="addProduct-btn"
        >
        تعديل السعر
      </button>
    </div>
  </div>
</template>

<script>

import { extend } from 'vee-validate';
import { required , double , min_value  } from 'vee-validate/dist/rules';

// Register rules with custom messages

  extend('required', {
  ...required,
  message: '{_field_} مطلوب'

  });

  extend('double', {
  ...double,
  message: '{_field_} يجب أن يكون رقمًا'
  });

  extend('min_value', {
  ...min_value,
  message: '{_field_} يجب أن يكون على الأقل {min}'
  });

  extend('date_format', {
  validate(value) {
    const regex = new RegExp('^\\d{4}-\\d{2}-\\d{2}$')
    return regex.test(value);
  },
  params: ['format'],
  message: '{_field_} يجب أن يكون بالتنسيق الصحيح {format}'
  });

  // actions , states
  import { mapActions , mapState } from 'pinia'

  import { useOrdersStore } from '@/store/order/orders.js';

export default {
  name: "AddNewOrder",
  props: {
    addedOrders: {
      type: Array,
      required: true,
    },
  },
 
  data() {
      return {
      // for all products added  

      // product data  
        selectedProduct:'',
        productId:'',
        productInfo:'',
        amountOfIncrease: 0,
        editOfInstallation: 0,
        fixedInstallation: 0,
      

        // selectProductForUpdate
        selectProductForUpdateProp:'',

        // follow edit state
        isEditingProduct: false, 

        
        

        
        Id:null,
     
                
      };
  },
  computed: {
    getDarkMode() {
      return this.$store.state.darkMode;
    },

       
    ...mapState(useOrdersStore, ['orders']),

  },

  async created() {
    await this.fetchOrders()
    this.Id = this.$route.params.orderId;
    this.fetchOrderDetails();
    
  },
  methods: {
      
    // ============ my actions => start =============================================
    ...mapActions(useOrdersStore, ['updateOrder','fetchOrders']),
    // ============ my actions => end ==============================================
   
    // ============ show order data  => start ==============================================
    async fetchOrderDetails() {
      const order = this.orders.find(order => order.id === this.Id);
      if (order) {
      this.addedOrders = order.products;
        }
    },
    // ============ show order data  => end ==============================================


 
   clearProductForm() {
    this.selectedProduct = '';
    this.productId = '';
    this.productInfo = '';
    this.selectProductForUpdateProp = '';
    this.editOfInstallation = 0;
    this.amountOfIncrease = 0;
    this.isEditingProduct = false; 
  },


  selectProductForUpdate() {
    const selectedUpdatePro = this.addedOrders.find(product => product.id === this.selectProductForUpdateProp);
    if (selectedUpdatePro) {
      this.selectedProduct = selectedUpdatePro.name;
      this.productId = selectedUpdatePro.id;
      this.productInfo =selectedUpdatePro.productInfo,
      this.amountOfIncrease =selectedUpdatePro.amountOfIncrease||0,
      this.editOfInstallation =selectedUpdatePro.editOfInstallation||0,
      this.isEditingProduct = true;
      console.log( this.productId,this.productInfo)
      console.log( selectedUpdatePro)
    }
  },

  editProduct() {
      const index = this.addedOrders.findIndex(product => product.id === this.productId);

      if (index !== -1) {

        if(Number(this.amountOfIncrease) !== 0 ){
          console.log("inside")
          var spichialPrice = this.productInfo.priceMaterial + parseFloat(this.amountOfIncrease);
          this.addedOrders[index].amountOfIncrease = this.amountOfIncrease;
          this.addedOrders[index].priceWithIncrease = spichialPrice;
        }
        if( Number(this.editOfInstallation) >0 ){

          this.addedOrders[index].editOfInstallation = this.editOfInstallation;
        }
        console.log('spichialPrice',spichialPrice,'this.productInfo.priceMaterial',this.productInfo.priceMaterial,'this.amountOfIncrease',this.amountOfIncrease, "editOfInstallation", this.editOfInstallation)
        
        this.$emit("added-orders-updated", this.addedOrders);

        this.clearProductForm();
        console.log(this.addedOrders)
      }
    },
  
 
 
 
}
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
    box-sizing: border-box;
    /* height: 300px; */
}
.product-manager-title {
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: #333;
    text-align: start;
  }
 
.formbold-form-input,.formbold-form-label{
    text-align: start;
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