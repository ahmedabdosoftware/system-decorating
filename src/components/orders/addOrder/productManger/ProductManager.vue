<template>
    <div  class="product-manager respo-form-order">
        <h3 class="product-manager-title">Product Manager</h3>
        <div>
            <label for="addedOrders" class="formbold-form-label">  Added Products</label>
            <select
                class="formbold-form-input"
                v-model="selectProductForUpdateProp"
                id="addedOrders"
                @change="selectProductForUpdate"
                    placeholder=" choosse From Added Products"
                >
                <option v-for="product in addedOrders" :value="product.id" :key="product.id">
                    {{ product.name }}
                </option>
            </select>

        </div>
          
    <div class="formbold-input-flex">
        
        <div>
            <ValidationProvider name="الكمية"  :rules="`${addedOrders.length == 0 ? 'required|numeric|min_value:1' : ''}`"  v-slot="{ errors }">
            <label for="quantity" class="formbold-form-label">  Quantity </label>

            <input
                type="number"
                id="quantity"
                placeholder="Quantity"
                class="formbold-form-input"
                v-model="quantity"
            
            />
            <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
        </div>
        <div>
            <label for="product" class="formbold-form-label">  Product  </label>
            <ValidationProvider name="المنتج"  :rules="`${addedOrders.length == 0 ? 'required' : ''}`"  v-slot="{ errors }">
            <input list="propList"  class="formbold-form-input"  placeholder=" Search for products " v-model="selectedProduct" @input="updateProductId">
            <datalist id="propList">
                <option v-for="product in myAllProducts" :key="product.id" :value="product.name" ></option>
            </datalist>
            <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
        </div>
    </div>

    <div class="formbold-input-flex">

        <div class="display-options">
            <label v-if="selectedProduct" >
                <input type="checkbox" v-model="pullFromBranch" />
                Pull From Branch
            </label>
        </div>   
        <div>
        <label for="priceOffer" class="formbold-form-label">  Discount </label>
        <input
            type="number"
            id="priceOffer"
            placeholder="Discount "
            class="formbold-form-input"
            v-model="price_offer"
        />
        </div>

        
    </div>

    <div class="formbold-input-flex" v-if="pullFromBranch">
        
        <div>
            <ValidationProvider name="الكمية المتاحة"   v-slot="{ errors }">
                <label for="quantityInBranch" class="formbold-form-label">    Avilabel Quantity </label>
                <input
                    type="number"
                    id="quantityInBranch"
                    placeholder="Quantity"
                    class="formbold-form-input"
                    v-model="quantityInBranch"
                    readonly
                />
                <p v-if="aboutQuantityInBranchMessage" class="warning-message"> {{ aboutQuantityInBranchMessage }} </p>
                <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
        </div>
        <div>
            <label for="branch" class="formbold-form-label">   Avilabel Branches in</label>
            <ValidationProvider name="الفروع"   v-slot="{ errors }">
                <input list="List"  class="formbold-form-input"  placeholder=" ابحث فى الفروع" v-model="selectedBranch" @input="getProductFromBranch">
                <datalist id="List">
                <option v-for="branch in getAllBranchesHasProduct" :key="branch.id" :value="branch.nameBranch" ></option>
                </datalist>
                <p v-if="getAllBranchesHasProduct.length == 0" class="warning-message"> غير متوفر فى اى فرع </p>
                <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
        </div>
        </div>

        <div class="formbold-mb-3 cont_add_del_upda">
            <button @click.prevent="addProduct" :disabled="!selectedProduct || !quantity" class="addProduct-btn"> Add</button>
            <button @click.prevent="updateProduct" :disabled="!selectedProduct || !quantity"  class="updateProduct-btn" >  Edit </button>
            <button @click.prevent="deleteProduct" class="deleteProduct-btn"> Delete </button>
            <button @click.prevent="cancelChange" class="cancelChangeProduct-btn"> Cancel </button>
        </div>
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


//store
import { useProductsStore } from '@/store/products/products.js'
import { useCategoriesStore } from '@/store/categories/categories.js';
import { useBranchesStore } from '@/store/branches/branches.js';



export default {
  name: "ProductManager",
 
  data() {
      return {
      // for all products added  
         addedOrders: [],

      // product data  
        selectedProduct:'',
        productId:'',
        price_offer: '',
        quantity: '',
        //itemName:'',
        productInfo:'',

        // selectProductForUpdate
        selectProductForUpdateProp:'',

        // follow edit state
        isEditingProduct: false, 

        // message when there is no users with this name && about quantity in branch 
      
        aboutQuantityInBranchMessage: '', 
      

        pullFromBranch:false, // for show extra filds

        
        // for pull branch feature
        selectedBranch:"",
        BranchId:"",
        quantityInBranch:"",


      };
  },
  watch: {

  quantity() {
    this.quantityMessage();
  }
},
  computed: {
 
    getAllBranchesHasProduct() {
     
      return this.branches.filter(branch => {
       
        return branch.products.some(product => product.id === this.productId);
      });
    },

    
    ...mapState(useProductsStore, {
      myAllProducts: 'products',
  
  }),
    ...mapState(useCategoriesStore, ['categories']),
    ...mapState(useBranchesStore, ['branches']),

    

  },
  async created() {
    this.fetchCategories();
    this.fetchProducts()
    this.fetchBranches()

  },
  methods: {
    // ============ my actions => start =============================================

    ...mapActions(useProductsStore, ['fetchProducts']),
    ...mapActions(useCategoriesStore, ['fetchCategories']),
    ...mapActions(useBranchesStore, ['fetchBranches','updateBranch']),


    // ============ my actions => end ==============================================


   addProduct() {

  if (!this.isEditingProduct) {

  let newProduct = {
    id: this.productId,
    name: this.selectedProduct,
    price_offer: this.price_offer,
    quantity: this.quantity,
    productInfo:this.productInfo,
  };

  this.toPUllFromBranch(newProduct)

  this.addedOrders.push(newProduct);
  console.log(this.addedOrders)

  this.clearProductForm();

  // update the parent componnent
  this.$emit('added-orders-updated', this.addedOrders);

}
},
  toPUllFromBranch(newProduct){

    if (this.pullFromBranch && Number(this.quantityInBranch) > 0) {
    let pullQuantityNeeded = Number(this.quantity); 
    let branchQuantity = Number(this.quantityInBranch); 

    let pullStatus = '';
    if (branchQuantity < pullQuantityNeeded) {
      pullStatus = 'less'; // الكمية أقل مما يريد
      newProduct.avilabelQuantityInBranch = branchQuantity
      
    } else {
      pullStatus = 'more'; // الكمية متاحة بالكامل
      newProduct.avilabelQuantityInBranch = ''
    }

    newProduct.branchId = this.BranchId;
    newProduct.selectedBranch = this.selectedBranch;
    newProduct.pullQuantityNeeded = pullQuantityNeeded;
    newProduct.pullStatus = pullStatus;
  }

},
cancelChange(){
      this.clearProductForm()
},
   clearProductForm() {

    this.selectedProduct = '';
    this.productId = '';
    this.quantity = '';
    this.selectProductForUpdateProp = '';

    this.pullFromBranch=false
    this.BranchId=""
    this.selectedBranch=""
    this.quantityInBranch=""

    this.isEditingProduct = false; 
    this.toggleButtons(false);
  },

  selectProductForUpdate() {
    const selectedUpdatePro = this.addedOrders.find(product => product.id === this.selectProductForUpdateProp);
    if (selectedUpdatePro) {

      this.selectedProduct = selectedUpdatePro.name;
      this.productId = selectedUpdatePro.id;
      this.price_offer = selectedUpdatePro.price_offer;
      this.quantity = selectedUpdatePro.quantity;

      if(selectedUpdatePro.branchId){

        this.selectedBranch = selectedUpdatePro.selectedBranch;
        this.getProductFromBranch()
        this.pullFromBranch=true
        console.log("selected",this.BranchId)
      }else{
        this.pullFromBranch=false
        this.BranchId=""
        this.selectedBranch=""
        this.quantityInBranch=""
      }

      this.isEditingProduct = true;
      this.toggleButtons(true); 
    }
  },
  updateProduct() {

    const index = this.addedOrders.findIndex(product => product.id === this.productId);
    if (index !== -1) {
      this.addedOrders[index].name = this.selectedProduct;
      this.addedOrders[index].price_offer = this.price_offer;
      this.addedOrders[index].quantity = this.quantity;


// update pull from branch (thats mean he alerdy pull) or do pull (mean its first time)
     if (this.pullFromBranch && Number(this.quantityInBranch) > 0) {
        let pullQuantityNeeded = Number(this.quantity); 
        let branchQuantity = Number(this.quantityInBranch); 

        let pullStatus = '';
        if (branchQuantity < pullQuantityNeeded) {
          pullStatus = 'less'; // الكمية أقل مما يريد
          this.addedOrders[index].avilabelQuantityInBranch = branchQuantity
          console.log(this.addedOrders)
        } else {
          pullStatus = 'more'; // الكمية متاحة بالكامل
          this.addedOrders[index].avilabelQuantityInBranch = ''

        }

        this.addedOrders[index].branchId = this.BranchId;
        this.addedOrders[index].selectedBranch = this.selectedBranch;
        this.addedOrders[index].pullQuantityNeeded = pullQuantityNeeded;
        this.addedOrders[index].pullStatus = pullStatus;
      }

// cancel the pull from branch
    if(this.BranchId && this.pullFromBranch== false){

      console.log('from inside the cancel the pull')
      delete this.addedOrders[index].branchId;
      delete this.addedOrders[index].selectedBranch;
      delete this.addedOrders[index].pullQuantityNeeded;
      delete this.addedOrders[index].pullStatus;

      //clear branch info
      this.BranchId=""
      this.selectedBranch=""
      this.quantityInBranch=""

    }

      console.log(this.addedOrders)

      this.clearProductForm();
          
      // update the parent componnent
      this.$emit('added-orders-updated', this.addedOrders);
    }
  },
  deleteProduct() {
    const index = this.addedOrders.findIndex(product => product.id === this.productId);
    if (index !== -1) {
      this.addedOrders.splice(index, 1);
      this.clearProductForm();

        
      // update the parent componnent
      this.$emit('added-orders-updated', this.addedOrders);
    }
  },
  updateProductId() {

      this.pullFromBranch=false
      this.BranchId=""
      this.selectedBranch=""
      this.quantityInBranch=""

      this.isEditingProduct = false; 
      this.toggleButtons(false);

    const selectedProductObj = this.myAllProducts.find(product => product.name === this.selectedProduct);
    this.productId = selectedProductObj ? selectedProductObj.id : '';
    this.productInfo = selectedProductObj ? selectedProductObj : '';
    console.log(this.productId)

  },
  getProductFromBranch() {
    const getBranch = this.branches.find(branch => branch.nameBranch === this.selectedBranch);
    const product = getBranch.products.find(product => product.id === this.productId);

      if(product){

        this.quantityInBranch= product.quantity

        if(Number(this.quantityInBranch) >0){

          this.BranchId= getBranch.id
          this.quantityMessage()
            
          }else{
            
            this.aboutQuantityInBranchMessage = 'المخزن فارغ لن تتم عمليه السحب'; // الكمية متاحة بالكامل
        }
      }
  },
  quantityMessage() {
      if(this.BranchId){
        console.log("still there branchId",this.BranchId)
        if ( Number(this.quantityInBranch) < Number(this.quantity)) {
                this.aboutQuantityInBranchMessage = 'سيتم سحب الكمية المتوفرة والباقى يمكنك شراءه'; // الكمية أقل مما يريد
            } else {
                this.aboutQuantityInBranchMessage = ''; // الكمية متاحة بالكامل
              };
      }
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
  .display-options{
  display: flex;
  justify-content: flex-start;
  align-items: end;
  padding-bottom: 10px;
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
  