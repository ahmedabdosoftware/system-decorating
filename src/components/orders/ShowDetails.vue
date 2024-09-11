<template> 
<div>
    <div class="detailsContent">
        <div class="detailsContent__title">
        <p>تفاصيل الطلب: (فاتورة رقم: {{ orderInfo.numberOfOrder }})</p>
        </div>
        <div class="detailsContent__orderInfo">
        <div class="detailsContent__orderInfo__date">
            <p>تاريخ الطلب: {{ orderInfo.date }}</p>
        </div>
        <div class="detailsContent__orderInfo__technichal">
            <p>اسم الفني: {{ orderInfo.TechnicaInfo.name }}</p>
            <p>رقم التليفون: {{ orderInfo.TechnicaInfo.number }}</p>
        </div>
        <div class="detailsContent__orderInfo__clint">
            <p>اسم العميل: {{ orderInfo.customerName }}</p>
            <p>العنوان: {{ orderInfo.adress }}</p>
            <p>رقم التليفون: {{ orderInfo.customerInfo.number }}</p>
        </div>
        <div class="detailsContent__orderInfo__general">
            <p>فاتورة رقم: {{ orderInfo.numberOfOrder }}</p>
            <p>نوع الفاتورة: {{ orderInfo.invoiceType }}</p>
            <p>الحالة: {{ getStatusText(orderInfo.status) }}</p>
        </div>
        </div>
        <div class="detailsContent__listProducts">
            <div>
                <p>:المنتجات</p>
            </div>
            <div>
                <table class="table">
                <thead>
                    <tr>
                    <th>الاجمالى</th>
                    <th>قيمة الخصم</th>
                    <th>الكمية</th>
                    <th>السعر</th>
                    <th>كود الصنف</th>
                    <th>اسم الصنف</th>
                    </tr>
                </thead>
                <tbody v-if="orderInfo.products">
                    <tr v-for="(product, index) in orderInfo.products" :key="index">
                    <td>{{ calculateTotalPrice(product) }}</td>
                    <td>{{ calculateDiscount(product) }}</td>
                    <td>{{ product.quantity }}</td>
                    <td>{{ product.productInfo.priceMaterial }}</td>
                    <td>{{ product.productInfo.name }}</td>
                    <td>{{ categoryName(product) }}</td>
                    </tr>
                    <tr  v-if="orderInfo.shipping">
                      <td colspan="3">{{ orderInfo.shipping }}</td>
                      <td colspan="3">الشحن</td>
                    </tr>
                </tbody>
                </table>
            </div>
        </div>
        <div class="detailsContent__imge">
            <div class="detailsContent__imge_title">
                <p>:التصميم</p>
            </div>
            <div class="detailsContent__imge_cont">
                <img v-if="orderInfo.imageUrl" :src="orderInfo.imageUrl" />
                <div v-else class="no-image">
                <font-awesome-icon icon="image" size="4x" />
                <p>لا يوجد صورة متاحة</p>
                </div>
            </div>
        </div>
        <div class="detailsContent__note">
            <div class="detailsContent__note_title">
                <p>:الملاحظات</p>
            </div>
            <div class="detailsContent__note_cont">
                <p v-if="orderInfo.notes">{{ orderInfo.notes }}</p>
                <div v-else class="no-notes">
                <font-awesome-icon icon="sticky-note" size="4x" />
                <p>لا توجد ملاحظات</p>
                </div>
            </div>
        </div>
    </div>
    <div class="details__btns">
       <!-- /* 
        hide it now becase there is more than one
       <button @click.prevent="Fatora">فاتورة</button>
        
        */ -->
        <button @click.prevent="goBack">اغلاق</button>
    </div>
</div>   
</template>
    <script>
    import { mapState, mapActions } from 'pinia'
    import { useCategoriesStore } from '@/store/categories/categories.js';
  
    
    
    export default {
      name: "ShowDetails",
      components: {},
      props: ["orderInfo"],

      computed: {
        getDarkMode() {
          return this.$store.state.darkMode;
        },
        ...mapState(useCategoriesStore, ['categories']),
  
            // حساب إجمالي الخصومات
        calculateTotalDiscount() {
            const totalDiscount = this.orderInfo.products.reduce((total, product) => {
            const productTotalPrice = product.productInfo.priceMaterial * product.quantity;
            const discountAmount = productTotalPrice * (product.price_offer / 100);
            return total + discountAmount;
          }, 0);
          return totalDiscount.toFixed(2)
        },
        // حساب الإجمالي الكلي بعد الخصومات
        calculateGrandTotal() {
          const grandTotal = this.orderInfo.products.reduce((total, product) => {
            const productTotalPrice = product.productInfo.priceMaterial * product.quantity;
            const discountAmount = productTotalPrice * (product.price_offer / 100);
            return total + (productTotalPrice - discountAmount);
          }, 0);
          const shippingCost = Number(this.orderInfo.shipping) || 0;
          return (grandTotal+shippingCost).toFixed(2);
        },
       
      // حساب اجمالي التركيب
      calculateTotalInstallation() {
  
        if (this.orderInfo.laborPrice) {
          
          return this.orderInfo.laborPrice;
          
        }else{
          
          const totalInstallation =this.orderInfo.products.reduce((total, product) => {
            if(product.productInfo.priceWithLabor){
              const productInstallationPrice = product.productInfo.priceWithLabor * product.quantity;
              return total + productInstallationPrice;
            }else{
              console.log('no labor for that :', product)
              console.log('total until now :', total)
              return total 
            }
          }, 0);
          
          return totalInstallation.toFixed(2);
  
        }
        },
      },
      async created() {
  
        this.fetchCategories();
       
      },
      
      methods: {
        ...mapActions(useCategoriesStore, ['fetchCategories']),
  
  
         calculateTotalPrice(product) {
          const productTotalPrice = product.productInfo.priceMaterial * product.quantity;
          const discountAmount = productTotalPrice * (product.price_offer / 100);
          return (productTotalPrice - discountAmount).toFixed(2);
       },
        calculateDiscount(product) {
          const productTotalPrice = product.productInfo.priceMaterial * product.quantity;
          const discountAmount = productTotalPrice * (product.price_offer / 100);
          return  discountAmount.toFixed(2);
        },
        categoryName(product){
        const categoryProductName = this.categories.find(category => category.id === product.productInfo.categoryId) 
        console.log(categoryProductName);
        if(categoryProductName){
          return categoryProductName.name
        }
      },
       Fatora() {
  
          const layout = this.$route.meta.layout;
          const orderId =this.orderInfo.id
          if (layout === 'DashboardLayout') {
          
            this.$router.push({ name: 'Fatora', params: { orderId: orderId } });
          
          } else if (layout === 'profileInDashboardLayout') {
            
            const profileId = this.$route.params.profileId;
            this.$router.push(`/dashboard/profile/${profileId}/Fatora/${orderId}`);
            
          }else if(layout === 'profileOutDashboardLayout'){
            
            const profileId = this.$route.params.profileId;
            this.$router.push(`/profile/${profileId}/Fatora/${orderId}`);
          
          }
      },
      goBack() {
          const layout = this.$route.meta.layout;
          if (layout === 'DashboardLayout') {
              this.$router.push('/dashboard/Order');
          } else if (layout === 'profileInDashboardLayout') {
              const profileId = this.$route.params.profileId;
              this.$router.push(`/dashboard/profile/${profileId}`);
          } else if (layout === 'profileOutDashboardLayout') {
              const profileId = this.$route.params.profileId;
              this.$router.push(`/profile/${profileId}`);
          }
      },
      getStatusText(status) {
        switch (status) {
          case '0':
            return 'معلق';
          case '3':
              return 'منتهى';
          case '1':
              return 'مؤكد';
          default:
            return 'غير معروف';
        }
      },
  
      
      },
      data() {
        return {
        };
      },
    };
    </script>
    <style scoped lang="scss">
    
    // **detailsContent section** => start
    
    //varibles
    
    $buttom_detailsContent_background:rgb(235, 229, 229);
    $buttom_font_detailsContent: 22px;
    $font_weight_detailsContent: 700;
    $border_detailsContent:2px solid rgb(71, 71, 71);
    $buttom_color_detailsContent: black;
    $buttom_font: 19px;
    
    
    //reset => normalize 
    *{
      margin: 0px;
    }
    
    
    //extends
    
    %btn-style{
      text-align: center;
      font-size: $buttom_font;
      border-radius: 5px;
      border: none;
      font-weight: 500;
      background-color: $buttom_color_detailsContent;
      color: white;
      cursor: pointer;
    
    }
    
    %use_flex{
      display: flex;
      flex-wrap: wrap;
    }
    %p_common{
     
        text-align: end;
        padding-right: 10px;
        line-height: 50px;
        color: rgb(128, 128, 128);
  
        font: {
          size:18px;
          weight:600;
          family: Arial, Helvetica, sans-serif;
        }
    }
  
  
    %center_flex{
      display: flex;
      align-items: center;
      justify-content: center;
    }
    %btn-style_detailsContent{
      text-align: center;
      font-size: $buttom_font_detailsContent;
      border-radius: 5px;
      border: none;
      font-weight: 700;
      background-color:$buttom_detailsContent_background;
      color: block;
      cursor: pointer;
    
    }
    
    %font{
      font: {
          size:19px;
          weight:600;
        }
    }
    
    .detailsContent{
     // background-color: rgb(173, 62, 173);
      @extend %use_flex;
      justify-content:center;
      align-content: space-evenly;
      width: 60%;
      min-height:100vh;
      margin: auto;
      margin-top: 32px;
      border :$border_detailsContent;
      border-radius: 5px;
  
    }
    .detailsContent >div{
      width: 100%;
    }
    .detailsContent__title{
      height: 50px;
      //background-color: rgb(153, 69, 69);
      border-bottom: 1px solid rgb(236, 235, 235);
      p{
          @extend %p_common;
      }
      
    }
    .detailsContent__orderInfo{
     // background-color: red;
      @extend %use_flex;
      justify-content: space-evenly;
      align-items: center;
      min-height: 200px;
      >div{
        width: 33%;
        height: 150px;
       // background-color: antiquewhite;
        p{
          @extend %p_common;
        }
       
      }
      .detailsContent__orderInfo__date{
        width: 100%;
        height: 50px;
      //  background-color: silver;
        p{
        text-align: start;
        padding-left: 10px;
        }
  
      }
      
    }
    .detailsContent__listProducts{
      //background-color: rgb(53, 58, 134);
      @extend %use_flex;
      min-height: 130px;
      margin-top: 25px;
      
      div:nth-child(1){
        width: 100%;
        height:50px ;
        // background-color: rgb(99, 93, 93);
        p{
          @extend %p_common;
          font-size: 24px;
        }
      }
      div:nth-child(2){
        
            @extend %use_flex;
            justify-content: center;
            width: 100%;
            min-height:80px ;
           // background-color: salmon;
            .table{
              width: 90%;
              height: 100%;
              border-collapse: collapse;
  
                tr{
                  height: 30px;
                  td,th{
                    border: $border_detailsContent;
                    text-align: center;
                  }
  
  
                  }
               }
            thead {
              border-radius: 10px;
              background-color: var(--popularCalar);
              
              th {
                color: white;
                height: 40px;
              }
            }
          }
    
    }
    .detailsContent__imge{
      @extend %use_flex;
      min-height: 200px;
      .detailsContent__imge_title{
        width: 100%;
        height:50px ;
        p{
          @extend %p_common;
          font-size: 24px;
        }
      }
      .detailsContent__imge_cont{
        @extend  %center_flex;
        width: 100%;
        min-height:150px;
        //background-color: red;
        img,.no-image{
          width:90%;
          height: 350px;
          border-radius: 15px;
        }
  
      }
      
    }
    .detailsContent__note{
      @extend %use_flex;
      min-height: 100px;  
      .detailsContent__note_title{
        width: 100%;
        height:50px ;
        p{
          @extend %p_common;
          font-size: 24px;
        }
      }
      .detailsContent__note_cont{
        width: 100%;
        min-height:50px;
        border-radius: 15px;
        p{
          @extend %p_common;
        }
  
      }
      .no-notes{
        @extend  %center_flex;
        width: 95%;
        margin: 0px 0px 10px 15px;
        min-height:50px;
        border-radius: 15px;
       
      }
    }
    .no-image,
    .no-notes {
      @extend  %use_flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;  
      padding: 20px;
      background-color: #f5f5f5;
      border-radius: 5px;
      margin-top: 10px;
      p{
        margin-top: 10px;
  
      }
  }
    .details__btns{
      @extend %use_flex;
      justify-content: flex-start;
      align-items: center;
      width: 60%;
      height: 120px;
  
      
      button{
        margin-left: 15px;
        width: 100px;
        height: 40px;
        border: $border_detailsContent;
        @extend %btn-style_detailsContent;
        background-color: var(--popularCalar);
        color: white;
  
      }
    
  }
  
      
    
   
    @media (max-width: 477px) {
     
      .detailsContent{
        width: 95%;
    }
    .detailsContent__orderInfo{
        >div{
          width:100%;
      }
    }
  
    .details__btns{
      width: 80%;
    }
    }
    
    @media print{
      .title,.details__btns {
        display: none ;
      }
    
      .detailsContent{
        margin-top: 0px;
        width: 650px;
        min-height:90vh;
    }
    
    }
    </style>
    