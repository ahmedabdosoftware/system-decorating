<template>
    <div  class="product-manager">
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
                <p v-if="isEditingProduct" class="info-message"> بالاضافة لكمية السحب السابقة على نفس الفرع </p>
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
        <!-- عرض معلومات السحب السابقة -->
        <p  v-if="pullFromBranch  && hasPreviousPullOperation" class="aline-end m-btn">   :  آخرعملية سحب   </p>
                        
          <div class="formbold-input-flex" v-if="pullFromBranch && hasPreviousPullOperation">
            
          <div>
          <label for="lastPulledQuantity" class="formbold-form-label aline-end">  كمية المسحوب </label>
          <input
              type="number"
              id="lastPulledQuantity"
              placeholder="كمية المسحوب "
              class="formbold-form-input readOnlyInput aline-end"
              v-model="lastPulledQuantity"
              readonly
          />
          </div>
            
          <div>
          <label for="lastPulledBranch" class="formbold-form-label aline-end">   الفرع المسحوب منه </label>
          <input
              type="text"
              id="lastPulledBranch"
              placeholder=" الفرع المسحوب منه "
              class="formbold-form-input readOnlyInput aline-end"
              v-model="lastPulledBranch"
              readonly
          />
          </div>


        </div>

        <div class="formbold-mb-3 cont_add_del_upda">
          <button  class="addProduct-btn" @click.prevent="addProduct" :disabled="!selectedProduct || !quantity">اضافة المنتج</button>
          <button  class="updateProduct-btn" @click.prevent="updateProduct" :disabled="!selectedProduct || !quantity"   > تعديل المنتج </button>
          <button @click.prevent="deleteProduct" class="deleteProduct-btn"> حذف </button>
          <button @click.prevent="cancelChange" class="cancelChangeProduct-btn"> الغاء </button>
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

 // sweetalert 
 import sweetalert from "sweetalert";

export default {
  name: "ProductManager",
  props: {
    addedOrders: {
      // type: Array,
      default: [],
    },
    },
 
  data() {
      return {
      // for all products added  
        //  addedOrders: this.initialAddedOrders,

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

        //  about quantity in branch 
      
        aboutQuantityInBranchMessage: '', 
      

        pullFromBranch:false, // for show extra filds

        
        // for pull branch feature
        selectedBranch:"",
        BranchId:"",
        quantityInBranch:"",

        // last pull operation 
        hasPreviousPullOperation: false,
        lastPulledBranch: '',
        lastPulledQuantity: 0,

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
          newProduct.avilabelQuantityInBranch=''

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
        
        //update or cancel for pulled product => show last pull as info
        if((selectedUpdatePro.branchId && selectedUpdatePro.isPulled)||selectedUpdatePro.ancientBranchId){
          
          this.showLastPullOpertion(selectedUpdatePro)
          console.log("run show last pull")
        }else{
        this.hasPreviousPullOperation=false
      }

        this.isEditingProduct = true;
        this.toggleButtons(true); 
      }
      },
      showLastPullOpertion(selectedProduct) {
        let lastPulledBranch = '';
        let lastPulledQuantity = 0;

        // إذا كان ancientBranchId موجودًا، فهذا يعني أن هناك عملية سحب قديمة
        if (selectedProduct.ancientBranchId) {
          // استخدام ancientBranchId والفرع القديم
          lastPulledBranch = this.getBranchNameById(selectedProduct.ancientBranchId);
          lastPulledQuantity = selectedProduct.ancientQuantityNeeded;

        } else {
          lastPulledBranch = this.getBranchNameById(selectedProduct.branchId);

          // في حالة pullStatus هو "less"، استخدم availableQuantityInBranch
          if (selectedProduct.pullStatus === 'less') {
            lastPulledQuantity = selectedProduct.avilabelQuantityInBranch;
          } else {
            // في حالة pullStatus هو "more"، استخدم pullQuantityNeeded
            lastPulledQuantity = selectedProduct.pullQuantityNeeded;
          }
        }

        this.lastPulledBranch = lastPulledBranch;
        this.lastPulledQuantity = lastPulledQuantity;
        this.hasPreviousPullOperation = true; 
        // عرض الفرع والكمية المسحوبة في وحدة التحكم (أو في واجهة المستخدم حسب الحاجة)
        console.log(`Last Pulled Branch: ${lastPulledBranch}, Last Pulled Quantity: ${lastPulledQuantity}`);

      },

      // دالة لاسترجاع اسم الفرع بناءً على معرف الفرع
      getBranchNameById(branchId) {
        const branch = this.branches.find(branch => branch.id === branchId);
        return branch ? branch.nameBranch : 'Unknown Branch';
      }
      ,
      updateProduct() {

      console.log("enter the fun : update pro")

      //    basic info 
      const index = this.addedOrders.findIndex(product => product.id === this.productId);
      if (index !== -1) {
        this.addedOrders[index].name = this.selectedProduct;
        this.addedOrders[index].price_offer = this.price_offer;
        this.addedOrders[index].quantity = this.quantity;


      // case 1
      //   "تحقق مما إذا كان المنتج قد تم سحبه مسبقًا
      //   "  منتج قديم وهتعدل على السحب مش لسه هتضيف

      if (this.pullFromBranch && this.addedOrders[index].isPulled) {

      console.log("enter old product need change pull")
      //     حفظ البيانات القديمة للسحب
        // maybe there already  "if u was about to update them then u diceded to change the update to another update "     
        if(this.addedOrders[index].ancientBranchId && this.addedOrders[index].ancientQuantityNeeded){
          console.log("do nothing u already catched them before")
        }else{
          // حفظ البيانات القديمة للسحب
          var ancientBranchId = this.addedOrders[index].branchId;
          var ancientQuantityNeeded = this.addedOrders[index].pullQuantityNeeded;

          if (this.addedOrders[index].pullStatus === "less"){
              ancientQuantityNeeded = Number(this.addedOrders[index].avilabelQuantityInBranch);
          }
          this.addedOrders[index].ancientBranchId = ancientBranchId;
          this.addedOrders[index].ancientQuantityNeeded = ancientQuantityNeeded;
        }

      // تحديث البيانات الجديدة للسحب
      let pullQuantityNeeded = Number(this.quantity); 
      let branchQuantity = Number(this.quantityInBranch);

      console.log("check BranchId",this.BranchId)

      if(this.BranchId){
        
        // إذا كان الفرع القديم هو نفس الفرع الجديد، أضف الكمية المعادة للمخزون
        if (this.addedOrders[index].ancientBranchId === this.BranchId) {
                branchQuantity += Number(this.addedOrders[index].ancientQuantityNeeded);
            }else {
            // إذا كان الفرع الجديد مختلفًا، تأكد من أن الكمية أكبر من الصفر
            if (branchQuantity <= 0) {
              console.log("Error: لا يمكن السحب من الفرع الجديد لأن الكمية المتاحة أقل من أو تساوي الصفر");
              sweetalert({
                text: " لا يمكن السحب من الفرع الجديد لأن الكمية المتاحة أقل من أو تساوي الصفر",
                icon: "error",
              });
              return;  
            }
          }
        }else{
          console.log("Error: اختر فرع اولا");
          sweetalert({
          text: " اختر فرع اولا",
          icon: "error",
        });
          return;  

      }

      let pullStatus = '';
      if (branchQuantity < pullQuantityNeeded) {
        pullStatus = 'less'; // الكمية أقل مما يريد
        this.addedOrders[index].avilabelQuantityInBranch = branchQuantity
      } else {
        pullStatus = 'more'; // الكمية متاحة بالكامل
        this.addedOrders[index].avilabelQuantityInBranch=''
      }


      this.addedOrders[index].branchId = this.BranchId;
      this.addedOrders[index].selectedBranch = this.selectedBranch;
      this.addedOrders[index].pullQuantityNeeded = pullQuantityNeeded;
      this.addedOrders[index].pullStatus = pullStatus;

      console.log(`Old branchId: ${ancientBranchId}, Old pullQuantityNeeded: ${ancientQuantityNeeded}`);
      }



      // case 2
      //  إذا كان هذا السحب  لمنتج لسه مضاف من صفحة تعديل الطلب(isPulled = false) وتحقق شرط السحب
        // update pull from branch (thats mean he alerdy pull) or do pull (mean its first time)

      if (this.pullFromBranch && Number(this.quantityInBranch) > 0 && !('isPulled' in this.addedOrders[index]) ) {
      let pullQuantityNeeded = Number(this.quantity); 
      let branchQuantity = Number(this.quantityInBranch); 

      let pullStatus = '';
      if (branchQuantity < pullQuantityNeeded) {
        pullStatus = 'less'; // الكمية أقل مما يريد
        this.addedOrders[index].avilabelQuantityInBranch = branchQuantity
      } else {
        pullStatus = 'more'; // الكمية متاحة بالكامل
        this.addedOrders[index].avilabelQuantityInBranch=''

      }

      this.addedOrders[index].branchId = this.BranchId;
      this.addedOrders[index].selectedBranch = this.selectedBranch;
      this.addedOrders[index].pullQuantityNeeded = pullQuantityNeeded;
      this.addedOrders[index].pullStatus = pullStatus;
      }






      // case 3
      // cancel the pull from branch
      if(this.BranchId && this.pullFromBranch== false && !('isPulled' in this.addedOrders[index])){
        
        console.log('from inside the cancel the pull')
        delete this.addedOrders[index].branchId;
        delete this.addedOrders[index].selectedBranch;
        delete this.addedOrders[index].pullQuantityNeeded;
        delete this.addedOrders[index].pullStatus;
        delete this.addedOrders[index].avilabelQuantityInBranch;

        //clear branch info
        this.BranchId=""
        this.selectedBranch=""
        this.quantityInBranch=""

      }



      // cancel the pull from branch
      console.log("before cancel", this.BranchId , this.pullFromBranch,this.addedOrders[index].isPulled)
      console.log("before cancel BranchId", this.BranchId )
      console.log("before cancel our product is ", this.addedOrders[index] )

      // case 4
      if(this.pullFromBranch== false && this.addedOrders[index].isPulled){
        
        console.log('from inside the cancel the pull')

        //     حفظ البيانات القديمة للسحب
        // maybe there already there "if u was about to update them then u diceded to cancel"     
        if(this.addedOrders[index].ancientBranchId && this.addedOrders[index].ancientQuantityNeeded){
          console.log("do nothing")
        }else{
          const ancientBranchId = this.addedOrders[index].branchId;
          var ancientQuantityNeededd = this.addedOrders[index].pullQuantityNeeded;

          if (this.addedOrders[index].pullStatus === "less"){
            ancientQuantityNeededd = Number(this.addedOrders[index].avilabelQuantityInBranch);
          }

          this.addedOrders[index].ancientBranchId = ancientBranchId;
          this.addedOrders[index].ancientQuantityNeeded = ancientQuantityNeededd;

        }
        
        delete this.addedOrders[index].branchId;
        delete this.addedOrders[index].selectedBranch;
        delete this.addedOrders[index].pullQuantityNeeded;
        delete this.addedOrders[index].pullStatus;
        delete this.addedOrders[index].avilabelQuantityInBranch;

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
      // Case 1: منتج بدون سحب
      if (!this.addedOrders[index].branchId && !this.addedOrders[index].ancientBranchId) {
        console.log("Product without pull operation, simply delete");
        this.addedOrders.splice(index, 1);
        this.clearProductForm();
        return;
      }

      // Case 2: منتج عليه سحب ولكنه أضيف الآن
      if (!this.addedOrders[index].isPulled && this.addedOrders[index].branchId) {
      console.log("Product has a pull operation but just added, simply delete");
      this.addedOrders.splice(index, 1);
      this.clearProductForm();
      return;
      }

      // Case 3: منتج عليه سحب وتم السحب بالفعل من قبل
      if (this.addedOrders[index].isPulled) {
      console.log("Product has a pull operation from before, adjusting quantities");

      // تحقق مما إذا كانت البيانات القديمة موجودة بالفعل
      if (!this.addedOrders[index].ancientBranchId || !this.addedOrders[index].ancientQuantityNeeded) {
        const ancientBranchId = this.addedOrders[index].branchId;
        var ancientQuantityNeeded = this.addedOrders[index].pullQuantityNeeded;

        if (this.addedOrders[index].pullStatus === "less") {
          ancientQuantityNeeded = Number(this.addedOrders[index].avilabelQuantityInBranch);
        }

        this.addedOrders[index].ancientBranchId = ancientBranchId;
        this.addedOrders[index].ancientQuantityNeeded = ancientQuantityNeeded;
      }

      this.addedOrders[index].isDeleted = true;
      // حذف معلومات السحب الحالية
      delete this.addedOrders[index].branchId;
      delete this.addedOrders[index].selectedBranch;
      delete this.addedOrders[index].pullQuantityNeeded;
      delete this.addedOrders[index].pullStatus;
      delete this.addedOrders[index].avilabelQuantityInBranch;

      // مسح معلومات الفرع الحالية
      this.BranchId = "";
      this.selectedBranch = "";
      this.quantityInBranch = "";

      this.clearProductForm();
      return;
      }

      // حذف المنتج في الحالات الأخرى (احتياطي)
      //this.addedOrders.splice(index, 1);
      //this.clearProductForm();

       // update the parent componnent
       this.$emit('added-orders-updated', this.addedOrders);
      }
      },

      updateProductId() {

        this.pullFromBranch=false
        this.hasPreviousPullOperation=false
        this.BranchId=""
        this.selectedBranch=""
        this.quantityInBranch=""

        this.isEditingProduct = false; 
        this.toggleButtons(false);

      const selectedProductObj = this.myAllProducts.find(product => product.name === this.selectedProduct);
      this.productId = selectedProductObj ? selectedProductObj.id : '';
      this.productInfo = selectedProductObj ? selectedProductObj : '';

      },
      getProductFromBranch() {
      const getBranch = this.branches.find(branch => branch.nameBranch === this.selectedBranch);
      let product;
      if(getBranch){
      this.BranchId= getBranch.id
      product = getBranch.products.find(product => product.id === this.productId);
      }

        if(product){
          console.log("get quantity from product")
          this.quantityInBranch= product.quantity

          if(Number(this.quantityInBranch) >0){

            //this.quantityMessage()
              
            }else{
              
            // this.aboutQuantityInBranchMessage = 'المخزن فارغ لن تتم عمليه السحب'; // الكمية متاحة بالكامل
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
  