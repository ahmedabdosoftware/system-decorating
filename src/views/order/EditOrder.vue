<template>
    <div class="editOrder">
        <div class="title">
            <p :class="{ 'dark-mode-title': getDarkMode }">edit order</p>
        </div>
        
        <div :class="{ 'dark-moode': getDarkMode }" class="allContentt">
        <div class="formbold-main-wrapper">
            <div class="formbold-form-wrapper">
              <FormImage></FormImage>
             <ValidationObserver ref="observer" v-slot="{ invalid }">
              <form @submit.prevent="handelUpdateOrder">
                <div class="formbold-input-flex">
                    <div>
                        <label for="customer" class="formbold-form-label">اختر العميل</label>
                        <input list="customerList"  class="formbold-form-input"  placeholder="ابحث عن عميل" v-model="selectedCustomer" @input="updateCustomerId">
                        <datalist id="customerList">
                        <option v-for="customer in clientUsers" :key="customer.id" :value="customer.name" ></option>
                        </datalist>
                        <p v-if="unregisteredCustomerMessage" class="warning-message">{{ unregisteredCustomerMessage }}</p>
                      </div>
                    
                    <div>
                        <label for="technical" class="formbold-form-label"> :اختر الفنى </label>
                        <input list="technicalList"  class="formbold-form-input"   placeholder="ابحث عن فنى" v-model="selectedTechnical" @input="updateTechnicalId">
                        <datalist id="technicalList">
                        <option v-for="tech in technicalUsers" :key="tech.id" :value="tech.name" > </option>
                        </datalist>
                        <p v-if="unregisteredTechnicalMessage" class="warning-message"> {{ unregisteredTechnicalMessage }} </p>
                    </div>
                </div>

                <div class="formbold-input-flex">

                  <div>
                      <label for="shipping" class="formbold-form-label">  الشحن </label>
                      <input
                          type="number"
                          id="shipping"
                          placeholder="الشحن "
                          class="formbold-form-input"
                          v-model="shipping"
                      />
                    </div>
              

                    <div>
                      <ValidationProvider name="نوع الفاتورة" rules="required" v-slot="{ errors }">

                        <label class="formbold-form-label">نوع الفاتورة</label>
                        <select class="formbold-form-input" name="occupation" id="occupation" v-model="invoiceType">
                        <option value="تركيب">تركيب</option>
                        <option value="توريد"> توريد</option>
                        <option value="تركيب وتوريد">تركيب وتوريد </option>
                        </select>
                        <span class="error">{{ errors[0] }}</span>
                      </ValidationProvider>
                    </div>
                </div>
                <div class="formbold-input-flex">
                  <div></div>
                  <div>
                      <label for="addedOrders" class="formbold-form-label">المنتجات المضافة الآن</label>
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
                </div>

                <div class="formbold-input-flex">
                    
                    <div>
                      
                      <label for="product" class="formbold-form-label">  المنتج  </label>
                      <ValidationProvider name="المنتج"  :rules="`${addedOrders.length == 0 ? 'required' : ''}`"  v-slot="{ errors }">
                        <input list="propList"  class="formbold-form-input"  placeholder=" ابحث فى المنتجات" v-model="selectedProduct" @input="updateProductId">
                        <datalist id="propList">
                          <option v-for="product in myAllProducts" :key="product.id" :value="product.name" ></option>
                        </datalist>
                        <span class="error">{{ errors[0] }}</span>
                      </ValidationProvider>
                    </div>


                    <div>
                      
                      <ValidationProvider name="حالة الطلب" rules="required" v-slot="{ errors }">
                        <label for="status" class="formbold-form-label">حالة الطلب  </label>
                        <select
                          id="status"
                          placeholder="حالة الطلب"
                          class="formbold-form-input"
                          v-model="status">
                          <option value="0">معلق</option>
                          <option value="1">مؤكد</option>
                          <option value="3">منتهى</option>
                        </select>
                        <span class="error">{{ errors[0] }}</span>
                      </ValidationProvider>
                    </div>
                </div>

                <div class="formbold-input-flex">
                    <div>
                    <label for="priceOffer" class="formbold-form-label">  الخصم </label>
                    <input
                        type="number"
                        id="priceOffer"
                        placeholder="الخصم "
                        class="formbold-form-input"
                        v-model="price_offer"
                    />
                    </div>

                    <div>
                      <ValidationProvider name="الكمية"  :rules="`${addedOrders.length == 0 ? 'required|numeric|min_value:1' : ''}`"  v-slot="{ errors }">
                        <label for="quantity" class="formbold-form-label">  الكمية </label>

                        <input
                            type="number"
                            id="quantity"
                            placeholder="الكمية"
                            class="formbold-form-input"
                            v-model="quantity"
                        
                        />
                        <span class="error">{{ errors[0] }}</span>
                      </ValidationProvider>
                    </div>
                </div>

                <div class="formbold-mb-3 cont_add_del_upda">
                  <button  class="addProduct-btn" @click.prevent="addProduct" :disabled="!selectedProduct || !quantity">اضافة المنتج</button>
                  <button  class="updateProduct-btn" @click.prevent="updateProduct" :disabled="!selectedProduct || !quantity"   > تعديل المنتج </button>
                  <button @click.prevent="deleteProduct" class="deleteProduct-btn"> حذف المنتج</button>
                </div>
                <div class="formbold-input-flex">
                    
                    <div>
                      <ValidationProvider name="رقم بطلب" rules="numeric|min_value:1" v-slot="{ errors }">
                        <label for="numberOfOrders" class="formbold-form-label">  رقم الطلب  </label>
                        <input
                        type="number"
                        id="numberOfOrders"
                        placeholder="رقم الطلب"
                        class="formbold-form-input"
                        v-model="number"
                    
                       />
                        <p  class="info-message"> اتركه فارغا ليتم انشاء رقم الطلب اوتوماتيكلى</p>
                        <span class="error">{{ errors[0] }}</span>
                      </ValidationProvider>
                    </div>


                    <div>
                      <label for="laborPrice" class="formbold-form-label">حدد المصنعية يدويا  </label>
                      <input
                        type="number"
                        id="laborPrice"
                        placeholder="حدد المصنعية يدويا "
                        class="formbold-form-input"
                        v-model="laborPrice"
                        
                        />
                        <p  class="info-message"> فى حالة لا يوجد منتج يتم حساب المصنعية من خلاله او اذا كنت تفضل حساب المصنعية يدويا</p>
                        
                      </div>
                    </div>
                    
                    <div class="formbold-mb-3">
                      <ValidationProvider name="تاريخ بدا العمل" rules="date_format:YYYY-MM-DD" v-slot="{ errors }">
                        <label for="dob" class="formbold-form-label"> تاريخ بدا العمل  </label>
                        <input type="date" name="dob" id="dob" class="formbold-form-input"  v-model="date" />
                        <span class="error">{{ errors[0] }}</span>
                      </ValidationProvider>
                    </div>
                    
                    <div class="formbold-mb-3">
                      <label for="address" class="formbold-form-label"> مكان التركيب </label>
                      <input
                      type="text"
                      id="address"
                      placeholder="العنوان"
                      class="formbold-form-input formbold-mb-3"
                      v-model="adress"
                      />
                    </div>

                <div class="formbold-mb-3">
                    <label for="message" class="formbold-form-label">
                    ملاحظات
                    </label>
                    <textarea
                    rows="6"
                    id="message"
                    class="formbold-form-input"
                    v-model="notes"

                    ></textarea>
                </div>

                <div class="formbold-form-file-flex">
                    <label for="upload" class="formbold-form-label">
                    Upload disign
                    </label>
                    <input
                    type="file"
                    id="upload"
                    class="formbold-form-file"
                    @change="handleFileUpload" 
                    />
                </div> 

                <button class="formbold-btn" :class="{ 'disabled-btn': invalid }" :disabled="invalid"  >حفظ و إنشاء الفاتورة</button>
                <button @click.prevent="createAndCustomizeInvoice" class="formbold-btn" :class="{ 'disabled-btn': invalid }" :disabled="invalid">حفظ وتخصيص فاتورة</button>

               </form>
              </ValidationObserver>
            </div>
            </div>
      </div>
      <CircleLoader :show="isLoading" />

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
  
  // FormImage
  import FormImage from "@/shared/components/svgImage/FormImage.vue";
  // CircleLoader
  import CircleLoader from '@/shared/components/loading/CircleLoader.vue';

  //store
  import { useProductsStore } from '@/store/products/products.js'
  import { useCategoriesStore } from '@/store/categories/categories.js';
  import { useGetUserStore } from '@/store/users/users.js';
  import { useOrdersStore } from '@/store/order/orders.js';

  // sweetalert 
  import sweetalert from "sweetalert";

  export default {
    name: "AddNewOrder",
    components: {
      FormImage,
      CircleLoader,
    },
    data() {
        return {
        // for all products added  
           addedOrders: [],

        // product data  
          selectedProduct:'',
          productId:'',
          price_offer: '',
          quantity: '',
         // itemName:'',
          productInfo:'',

        // rest of order data    
          selectedCustomer:'',
          customerId:null,
          customerInfo:'',

          selectedTechnical:'',
          TechnicalId:null,
          TechnicaInfo:'',
          
          invoiceType: "تركيب وتوريد",
          date: '',
          adress: '',
          notes: '',
          status:'0', // حالة الطلب معلق 
          number:'',
          laborPrice:'',
          shipping:'',


          // selectProductForUpdate
          selectProductForUpdateProp:'',

          // follow edit state
          isEditingProduct: false, 

          // message when there is no users with this name
          unregisteredCustomerMessage: '', 
          unregisteredTechnicalMessage: '', 
        
          file: null, // for add picture

          // to show current pic if it exists
          currentImageUrl: '',

          Id:null,

            // loading 
           isLoading: false,
           customInvoice: false,

        };
    },
    computed: {
      getDarkMode() {
        return this.$store.state.darkMode;
      },
  
      
      ...mapState(useProductsStore, {
        myAllProducts: 'products',
    
    }),
      ...mapState(useCategoriesStore, ['categories']),
      ...mapState(useGetUserStore, ['technicalUsers','clientUsers']),
      ...mapState(useOrdersStore, ['orders']),
  
      
  
    },
    async created() {
      this.fetchCategories();
      this.fetchProducts()
      this.fetchUsers()
      await this.fetchOrders()
      this.Id = this.$route.params.orderId;
      this.fetchOrderDetails();
  
    },
    methods: {
      // ============ my actions => start =============================================
  
      ...mapActions(useProductsStore, ['fetchProducts']),
      ...mapActions(useCategoriesStore, ['fetchCategories']),
      ...mapActions(useGetUserStore, ['fetchUsers']),
      ...mapActions(useOrdersStore, ['updateOrder','fetchOrders','uploadImage', 'deleteImageFromStorage','generateOrderNumber']),

  
      // ============ my actions => end ==============================================
     
      // ============ show order data  => start ==============================================
      async fetchOrderDetails() {
        const order = this.orders.find(order => order.id === this.Id);
        if (order) {
        this.addedOrders = order.products;
        this.selectedCustomer = order.customerName;
        this.customerId = order.customerId;
        this.customerInfo = order.customerInfo;
        this.selectedTechnical = order.technicalName;
        this.TechnicalId = order.technicalId;
        this.TechnicaInfo = order.TechnicaInfo;
        this.invoiceType = order.invoiceType;
        this.date = order.date;
        this.adress = order.adress;
        this.notes = order.notes;
        this.status = order.status;
        this.number = order.numberOfOrder;
        this.laborPrice = order.laborPrice;
        this.shipping = order.shipping;
        this.currentImageUrl = order.imageUrl;
      }
    },
      // ============ show order data  => end ==============================================


      // ============ handel file  => start ==============================================
        handleFileUpload(event) {
        this.file = event.target.files[0];
      },
      // ============ handel file => end ==============================================

  
      // custom invoice
      createAndCustomizeInvoice() {
        this.customInvoice= true
        this.handelUpdateOrder()

        },
  
     
      addProduct() {
      if (!this.isEditingProduct) {
        this.addedOrders.push({
          id: this.productId,
          name: this.selectedProduct,
          price_offer: this.price_offer,
          quantity: this.quantity,
          productInfo:this.productInfo,
        });
        this.clearProductForm();
      }
     },
     clearProductForm() {
      this.selectedProduct = '';
      this.productId = '';
      this.quantity = '';
      //this.itemName = '';
      this.selectProductForUpdateProp = '';
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
       // this.itemName = selectedUpdatePro.nameCategory;
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
       // this.addedOrders[index].nameCategory = this.itemName;
        this.clearProductForm();
      }
    },
    deleteProduct() {
      const index = this.addedOrders.findIndex(product => product.id === this.productId);
      if (index !== -1) {
        this.addedOrders.splice(index, 1);
        this.clearProductForm();
      }
    },
    updateProductId() {
      const selectedProductObj = this.myAllProducts.find(product => product.name === this.selectedProduct);
      this.productId = selectedProductObj ? selectedProductObj.id : '';
      this.productInfo = selectedProductObj ? selectedProductObj : '';

    },
    updateCustomerId() {
      const selectedCustomerObj = this.clientUsers.find(customer => customer.name === this.selectedCustomer);
      if (selectedCustomerObj) {
        this.customerId = selectedCustomerObj.id;
        this.customerInfo = selectedCustomerObj;
        
        this.unregisteredCustomerMessage = ''; 
      } else {
        this.customerId = null;
        this.customerInfo = '';

        this.unregisteredCustomerMessage = 'هذا العميل غير مسجل في النظام. قد تفقد بعض المميزات.';
      }
    },
    updateTechnicalId() {
      const selectedTechnicalObj = this.technicalUsers.find(tech => tech.name === this.selectedTechnical);
      if (selectedTechnicalObj) {
        this.TechnicalId = selectedTechnicalObj.id;
        this.TechnicaInfo = selectedTechnicalObj;
        
        this.unregisteredTechnicalMessage = ''; 
      } else {
        this.TechnicalId = null;
        this.TechnicaInfo = '';

        this.unregisteredTechnicalMessage = 'هذا الفني غير مسجل في النظام. قد تفقد بعض المميزات.';
      }
    },
    toggleButtons(isEditing) {
      const addButton = document.querySelector('.addProduct-btn');
      const updateButton = document.querySelector('.updateProduct-btn');
      const deleteButton = document.querySelector('.deleteProduct-btn');
      console.log(addButton,updateButton)
      if (isEditing) {
        addButton.classList.add('addProduct-btn_hidde');
        updateButton.classList.add('updateProduct-btn_show');
        deleteButton.classList.add('deleteProduct-btn_show');
      } else {
        addButton.classList.remove('addProduct-btn_hidde');
        updateButton.classList.remove('updateProduct-btn_show');
        deleteButton.classList.remove('deleteProduct-btn_show');
      }
    },
    
    // ============ creat New oredr => start =====================================

    async handelUpdateOrder() {
        
      this.isLoading = true;

    try {
      if (this.addedOrders.length === 0) {
        sweetalert("لا يمكن إنشاء الطلب بدون منتجات.", "يرجى إضافة منتجات قبل إنشاء الطلب.", "error");
        this.isLoading = false;
        return;
      }

      //const totalPrice = this.addedOrders.reduce((total, product) => total + parseFloat(product.price_offer) * parseInt(product.quantity), 0);

      let imageUrl = '';

     
      if (this.file) {
          if (this.currentImageUrl) {
            await this.deleteImageFromStorage(this.currentImageUrl);
          }
          imageUrl = await this.uploadImage({ file: this.file });
        }

        if (!this.number) {
        this.number = await this.generateOrderNumber();
      }
      const updatedOrderData  = {
        id: this.Id,
        products: this.addedOrders,
        customerName: this.selectedCustomer,
        customerId: this.customerId,
        customerInfo: this.customerInfo,
        technicalName: this.selectedTechnical,
        technicalId: this.TechnicalId,
        TechnicaInfo:this.TechnicaInfo,
        invoiceType: this.invoiceType,
        adress: this.adress,
        date: this.date,
        status: this.status,
        laborPrice: this.laborPrice,
        notes: this.notes,
        numberOfOrder: this.number,
        shipping: this.shipping,
        imageUrl,
      };
      console.log('before send');

      await this.updateOrder(updatedOrderData );

      console.log('after send');
      this.isLoading = false;

      if(this.customInvoice){
        sweetalert("تم تعديل الطلب بنجاح!", "سيتم إعادة توجيهك إلى صفحة تخصيص فاتورة.", "success");
        this.$router.push({ name: 'CustomInvoice', params: { orderId: this.Id , isCustom:"true" } });
      }else{
        sweetalert("تم تعديل الطلب بنجاح!", "سيتم إعادة توجيهك إلى صفحة الفاتورة.", "success");
        this.$router.push({ name: 'Fatora', params: { orderId: this.Id , isCustom:"false"} });
      }

    } catch (error) {
      console.error('Error creating order:', error);
      this.isLoading = false;
      sweetalert("خطأ في تعديل الطلب", "يرجى المحاولة مرة أخرى.", "error");
    }
  },
    // ============ creat New oredr => end =======================================
    
  }
  };
  </script>
  <style scoped lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  .editOrder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    margin-bottom: 13px;
    //background-color: aqua;
  }
  .title {
    width: 250px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    p {
      text-transform: capitalize;
      font-size: 22px;
      font-weight: 600;
    }
  }
  
.allContentt {
    width: 670px;
    display: flex;
    flex-wrap: wrap;
    min-height: 100vh;
    background-color: white;
    border-radius: 10px;
    border: solid 1px rgb(181, 179, 179);
  }

  
.formbold-form-file-flex {
  display: flex;
  align-items: center;
  gap: 20px;
}
.formbold-form-file-flex .formbold-form-label {
  margin-bottom: 0;
}
.formbold-form-file {
  font-size: 14px;
  line-height: 24px;
  color: #536387;
}
.formbold-form-file::-webkit-file-upload-button {
  display: none;
}
.formbold-form-file:before {
  content: 'Upload file';
  display: inline-block;
  background: #EEEEEE;
  border: 0.5px solid #FBFBFB;
  box-shadow: inset 0px 0px 2px rgba(0, 0, 0, 0.25);
  border-radius: 3px;
  padding: 3px 12px;
  outline: none;
  white-space: nowrap;
  -webkit-user-select: none;
  cursor: pointer;
  color: #637381;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  margin-right: 10px;
}



  // phone
  @media (max-width: 477px) {
    .title {
      p {
        margin-left: 60px;
      }
    }
    .allContentt {
      width: 370px !important;
    }
   

  }
  
  </style>
  