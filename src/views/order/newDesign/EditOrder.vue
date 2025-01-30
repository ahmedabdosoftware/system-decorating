<template>
  <div class="view order-view">
    <div class="title">
          <p :class="{ 'dark-mode-title': getDarkMode }">Update order</p>
    </div>
    <ValidationObserver ref="observer" v-slot="{ invalid }">
      <form class="respo-form-order" @submit.prevent="letHandelForBtns">
        <div class="order-view-header">
            <!-- User Selection Component -->
            <UserSelectionComponent
                :initialCustomerName="selectedCustomer"
                :initialCustomerId="customerId"
                :initialCustomerInfo="customerInfo"
                :initialTechnicalName="selectedTechnical"
                :initialTechnicalId="TechnicalId"
                :initialTechnicalInfo="TechnicaInfo"
                @customer-updated="handleCustomerUpdate"
                @technical-updated="handleTechnicalUpdate"
                />
            <!-- Data Location Selection Component -->
            <DataLocationSelectionComponent
              :initialLocation="adress"
              :initialDate="date"
              @location-updated="handleLocationUpdate"
              @date-updated="handleDateUpdate"
              />
        </div>
        <div class="order-view-main">
            <div class="main-cont main-cont_shipping-products">
                <!-- Shipping And Type -->
                <ShippingAndType
                    :initialShipping="shipping"
                    :initialCustomShipping="customShipping"
                    :initialInvoiceType="invoiceType"
                    @shipping-updated="handleShippingUpdate"
                    @shippingShape-updated="handleCustomShippingUpdate"
                    @orderType-updated="handleTypeUpdate"
                />  
                <!-- product-manager-wraper -->
                <ProductMangerWraper
                  :addedOrders="addedOrders" 
                  @added-orders-updated="handleAddedOrdersUpdate"/>
              </div>
              <div  class="main-cont">
                <!-- Details -->
                
                <Details 
                :initialOrderStatus="status"
                :initialOrderNumber="number"
                :initialManualLaborCost="laborPrice"
                :initialNotes="notes"
                :initialDisplaySale="displaySale"
                :initialDisplayTowInvoice="displayTowInvoice"
                :initialDisplayInstallation="displayInstallation"
                :initialFixedInstallation="fixedInstallation"
                :initialFile="file"
                @details-updated="handleDetailsUpdate"
                />
            </div>
            <FormActions :isInvalid="invalid" @create="handelUpdateOrder" @cancel="goBack">
               <template v-slot:create-button> Update Order</template>
               <template v-slot:cancel-button> Cancel </template>
            </FormActions>
        </div>
      </form>
    </ValidationObserver>
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
  
    
// components  
  
    // CircleLoader
    import CircleLoader from '@/shared/components/loading/CircleLoader.vue';

    import UserSelectionComponent from "@/components/orders/shared/UserSelectionComponent.vue";
    import DataLocationSelectionComponent from "@/components/orders/shared/DataLocationSelectionComponent.vue";
    import ShippingAndType from "@/components/orders/shared/ShippingAndType.vue";
    import Details from "@/components/orders/shared/Details.vue";
    import ProductMangerWraper from "@/components/orders/editOrder/productManger/ProductMangerWraper.vue";  
    import FormActions from "@/components/orders/shared/FormActions.vue";


    //stores
    import { useOrdersStore } from '@/store/order/orders.js';
    import { useBranchesStore } from '@/store/branches/branches.js';

    // sweetalert 
    import sweetalert from "sweetalert";

  export default {
    name: "EditOrder",
    components: {
      UserSelectionComponent,
      DataLocationSelectionComponent,
      ShippingAndType,
      Details,
      ProductMangerWraper,
      FormActions,
      CircleLoader,
    },
    data() {
        return {
        // for all products added  
           addedOrders: [],


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
          customShipping:'',

          file: null, // for add picture

          // loading 
          isLoading: false,

          // is customInvoice
          customInvoice: false,

          displayTowInvoice:false,
          displaySale:true,
          displayInstallation:false,
          fixedInstallation: 0,

          


        };
    },
   
    computed: {
      getDarkMode() {
        return this.$store.state.darkMode;
      },
      ...mapState(useOrdersStore, ['orders']),
      ...mapState(useBranchesStore, ['branches']),

    },

    async created() {
      this.fetchBranches()
      await this.fetchOrders()
      this.Id = this.$route.params.orderId;
      this.fetchOrderDetails();

  
    },

    methods: {
      // ============ my actions => start =============================================
  
      ...mapActions(useOrdersStore, ['updateOrder','fetchOrders','uploadImage', 'deleteImageFromStorage','generateOrderNumber']),
      ...mapActions(useBranchesStore, ['fetchBranches','updateBranch']),

  
      // ============ my actions => end ==============================================


        handleCustomerUpdate({ customerId, customerInfo, selectedCustomer }) {
            this.customerId = customerId;
            this.customerInfo = customerInfo;
            this.selectedCustomer = selectedCustomer;
            console.log("update selectedCustomer by emit event",this.selectedCustomer,this.customerInfo)


        },
        handleTechnicalUpdate({ TechnicalId, TechnicaInfo , selectedTechnical}) {
            this.TechnicalId = TechnicalId;
            this.TechnicaInfo = TechnicaInfo;
            this.selectedTechnical = selectedTechnical;
            console.log("update selectedTechnical by emit event",this.selectedTechnical,this.TechnicaInfo)

        },
        handleLocationUpdate(location) {
            this.adress = location;
            console.log("update location by emit event",this.adress)

        },
        handleDateUpdate(date) {
            this.date = date;
            console.log("update date by emit event",this.date)

        },
        handleShippingUpdate(shipping) {
            this.shipping = shipping;
            console.log("update shipping by emit event",this.shipping)

        },
        handleCustomShippingUpdate(customShipping) {
            this.customShipping = customShipping;
            console.log("update customShipping by emit event",this.customShipping)

        },
        handleTypeUpdate(invoiceType) {
            this.invoiceType = invoiceType;
            console.log("update invoiceType by emit event",this.invoiceType)

        },
        handleAddedOrdersUpdate(addedOrders) {
          this.addedOrders = addedOrders; 
          console.log("update addedOrders by emit event",this.addedOrders)
        },
        handleDetailsUpdate(details) {
          this.notes = details.notes || '';
          this.status = details.status || '0';
          this.number = details.number || '';
          this.laborPrice = details.laborPrice || '';
          this.file = details.file;
          this.displaySale = details.displaySale;
          this.displayTowInvoice = details.displayTowInvoice;
          this.displayInstallation = details.displayInstallation;
          this.fixedInstallation = details.fixedInstallation;
          console.log(details)
        },

    

        letHandelForBtns(){
          console.log("let handel to btns")
        },

       // ============ show order data  => start ==============================================
       async fetchOrderDetails() {
        const order = this.orders.find(order => order.id === this.Id);
        console.log(order)
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
        this.customShipping = order.customShipping;
        this.currentImageUrl = order.imageUrl;

        this.displaySale = order.displaySale ;
        this.displayTowInvoice = order.displayTowInvoice || false;
        this.displayInstallation = order.displayInstallation ||false;
        this.fixedInstallation = order.fixedInstallation ||0;
        console.log( "displaySale:-",this.displaySale )
        console.log( "displayTowInvoice:-", this.displayTowInvoice)
        console.log( "this.displayInstallation:-", this.displayInstallation)
      }

    },
    goBack() {   
              this.$router.push('/dashboard/Order');
            
      },
      // ============ show order data  => end ==============================================

    // ==================== عملية السحب من المخزن ====================
    async pullProductsFromDatabase() {
    
    console.log("just enter pull fun", this.addedOrders)
    for (const product of this.addedOrders) {
     
     // case 1

      // whene cancel or delete
      if (!product.branchId  && product.ancientBranchId){

      const ancientBranchId = product.ancientBranchId;
      const ancientQuantityNeeded = Number(product.ancientQuantityNeeded);

      // البحث عن الفرع القديم واسترجاع الكمية
        const oldBranch = this.branches.find(branch => branch.id === ancientBranchId);
      if (oldBranch) {
        const oldBranchProduct = oldBranch.products.find(p => p.id === product.id);
        if (oldBranchProduct) {
          // إرجاع الكمية إلى الفرع القديم
          console.log("before back stock",oldBranchProduct.quantity)
          oldBranchProduct.quantity += ancientQuantityNeeded;
          console.log("after back stock",oldBranchProduct.quantity)
          await this.updateBranch(oldBranch);
        }
      }

       // مسح خصائص `anchint`
       delete product.ancientBranchId;
       delete product.ancientQuantityNeeded;
       delete product.isPulled;

    // حذف المنتج من المصفوفة
       if (product.isDeleted) {
        console.log("Product marked for deletion, removing it after restoring quantity.");
        const index = this.addedOrders.findIndex(p => p.id === product.id);
        if (index !== -1) {
          this.addedOrders.splice(index, 1);  
        }
      } else {
        console.log("Product not marked for deletion, keeping it in the list.");
      }


      }

     // case 2

    //  : إذا لم يكن هناك `branchId` 'ancientBranchId، قم بتخطي المنتج.
    if (!product.branchId && !product.ancientBranchId) {
      console.log("skip case")
      continue;
    }
    
    console.log("print info", product.branchId, product.ancientBranchId)
  
     // case 3

    // حالة المنتج الذي تم تغييره: لديه `ancientBranchId`
    if (product.branchId && product.ancientBranchId) {
      console.log("just enter our case")

      const ancientBranchId = product.ancientBranchId;
      const branchId = product.branchId;
      const ancientQuantityNeeded = Number(product.ancientQuantityNeeded);
      const newPullQuantity = Number(product.pullQuantityNeeded);

      // البحث عن الفرع القديم واسترجاع الكمية
      const oldBranch = this.branches.find(branch => branch.id === ancientBranchId);
      if (oldBranch) {
        const oldBranchProduct = oldBranch.products.find(p => p.id === product.id);
        if (oldBranchProduct) {
          // إرجاع الكمية إلى الفرع القديم
          console.log("before back stock",oldBranchProduct.quantity)
          oldBranchProduct.quantity += Number(ancientQuantityNeeded);
          console.log("after back stock",oldBranchProduct.quantity)
          await this.updateBranch(oldBranch);
        }
      }

      // البحث عن الفرع الجديد وسحب الكمية
      const newBranch = this.branches.find(branch => branch.id === branchId);
      if (!newBranch) {
        sweetalert("خطأ", "الفرع المحدد غير موجود.", "error");
        continue;
      }

      const newBranchProduct = newBranch.products.find(p => p.id === product.id);
      if (!newBranchProduct) {
        sweetalert("خطأ", "المنتج غير موجود في الفرع المحدد.", "error");
        continue;
      }

      if (product.pullStatus === "less") {
        // الكمية أقل من المطلوب -> تفريغ المخزون بالكامل من المنتج
        newBranchProduct.quantity = 0;
      } else if (product.pullStatus === "more") {
        // الكمية المتاحة كافية -> سحب الكمية المطلوبة فقط
        newBranchProduct.quantity -= newPullQuantity;
      }
      console.log("before update Branch with new data ")

      // تحديث بيانات الفرع الجديد
      await this.updateBranch(newBranch);

      // مسح خصائص `anchint`
      delete product.ancientBranchId;
      delete product.ancientQuantityNeeded;
    }

    // case 4

    //  : يوجد `branchId` ولكن لا يوجد `anchintBranchId`
    else if (product.branchId && !product.ancientBranchId) {
      // إذا لم يكن `isPulled` موجودًا أو `false` (السحب لأول مرة في تعديل الطلب)
      if (!product.isPulled) {
        const branchId = product.branchId;
        const pullQuantity = Number(product.pullQuantityNeeded);

        // البحث عن الفرع في البيانات
        const branch = this.branches.find(branch => branch.id === branchId);
        if (!branch) {
          sweetalert("خطأ", "الفرع المحدد غير موجود.", "error");
          continue;
        }

        const branchProduct = branch.products.find(p => p.id === product.id);
        if (!branchProduct) {
          sweetalert("خطأ", "المنتج غير موجود في الفرع المحدد.", "error");
          continue;
        }

        // سحب الكمية المطلوبة
        if (product.pullStatus === "less") {
          branchProduct.quantity = 0; // الكمية أقل -> تفريغ المخزون بالكامل
        } else if (product.pullStatus === "more") {
          branchProduct.quantity -= pullQuantity; // الكمية المتاحة كافية
        }

        // تحديث بيانات الفرع
        await this.updateBranch(branch);

        // تعيين الخاصية `isPulled` لتجنب السحب مرة أخرى
        product.isPulled = true;
      }
    }

    console.log('تم تحديث عملية السحب:', this.addedOrders);
  }
},


    // ============ update the oredr => start =====================================

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
        
      // ==================== عملية السحب من المخزن ====================
        await this.pullProductsFromDatabase()

        // تحقق من وجود تغييرات في الأسعار في المنتجات
        const hasCustomPrices = this.addedOrders.some(
            (product) => product.amountOfIncrease || product.editOfInstallation
        );
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
          notes: this.notes,
          numberOfOrder: this.number,
          laborPrice: this.laborPrice,
          shipping: this.shipping,
          customShipping: this.customShipping,
          imageUrl,

          displaySale: this.displaySale,
          displayTowInvoice: this.displayTowInvoice,
          displayInstallation: this.displayInstallation,
          fixedInstallation: this.fixedInstallation,

          hasCustomInvoice: hasCustomPrices,

        };
        console.log('before send');
  
        await this.updateOrder(updatedOrderData );
  
        console.log('after send');
        this.isLoading = false;
  
        sweetalert("تم تعديل الطلب بنجاح!", "سيتم إعادة توجيهك إلى صفحة تخصيص فاتورة.", "success");
        this.$router.push({ name: 'Fatora', params: { orderId: this.Id , isCustom: hasCustomPrices.toString() } });
    

  
      } catch (error) {
        console.error('Error creating order:', error);
        this.isLoading = false;
        sweetalert("خطأ في تعديل الطلب", "يرجى المحاولة مرة أخرى.", "error");
      }
    },
    // ============ update  oredr => end =======================================
    
  }
  };
  </script>
  <style scoped lang="scss">
  .view {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    margin-bottom: 15px;
    // background-color: aqua;
    // background-color: white;
  }
  .title {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    // background-color: red;
    p {
      text-transform: capitalize;
      font-size: 22px;
      font-weight: 600;
      margin-left: 20px;
    }
  }
.order-view-header{
    width: 100%;
    height: 200px;
    // background-color: red;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-evenly;

}

.order-view-main{
    width: 100%;
    min-height: 600px;
    // background-color: rgb(146, 131, 131);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;

}
.main-cont{
    //width: 45%;
    width: 470px;
    min-height: 700px !important;
    // background-color: red;
  }
  .main-cont_shipping-products{
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    // background-color: red;
}




  // phone
  @media (max-width: 477px) {
    .order-view-header{
        height: 380px;
    }
    .main-cont{
      max-width: 360px;
   
}
    
  }
  
  // phone
  @media (max-width: 370px){
    
   
   }
  </style>
  