<template>
  <!-- /* eslint-disable */ -->
  <div class="fatora">
    <div class="title">
      <div>
        <div class="contTitle">
          <div>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUQUVkx6lAgtb3-3fMuDZnDixihOSrrNSAOg&usqp=CAU"
            />
          </div>
          <p :class="{ 'dark-mode-title': getDarkMode }">Fatora grid</p>
        </div>
        <div>
          <div class="export">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmvEXj1Sr-tzeKuEP9PgzajIUDvR_-L-zfkg&usqp=CAU"
            />
            <button>png</button>
          </div>
         
            <button @click="print" class="generate">
              <font-awesome-icon class="printIcon" icon="fa-solid fa-print" />
              <p>print</p> 
            </button>
         
        </div>
      </div>

    </div>

    <div :class="{ 'dark-mode-box': getDarkMode }" class="allContent">
      <div class="fatoora">
        <div  class="fatoora__header">
          <div>
          
          </div>
          <div>
            <button>بيان اسعار</button>
            <span>6546 :رقم</span>
          </div>
          <div>
            <p class="logoFatora"> <span>جاما</span> للديكور</p>
            <p class="categories">  بانوهات كرانيش اسقف معلقة بديل خشب بديل رخام </p>
       
          </div>
        </div>
        <div  class="fatoora__title">
            <div>
              <p v-if="orderInfo">
                  نوع الفاتورة :
                   {{ orderInfo.invoiceType }} 
              </p>
            </div>
            <div>
                <p  v-if="orderInfo">  
                  {{ orderInfo.date }}  
                  : تحرير فى 
                </p>
              
                <p v-if="orderInfo">
                    {{ orderInfo.customerName }}
                : اسم العميل     
                </p>
            </div>

        </div>
        <div  class="fatoora__table" >
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
            <tbody v-if="orderInfo">
              <tr v-for="(product, index) in orderInfo.products" :key="index">
                <td>{{ calculateTotalPrice(product) }}</td>
                <td>{{ calculateDiscount(product) }}</td>
                <td>{{ product.quantity }}</td>
                <td>{{ product.productInfo.priceMaterial }}</td>
                <td>{{ product.productInfo.name }}</td>
                <td>{{ categoryName(product) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div  class="fatoora__sales">
          <p>اجمالى الخصم: <span>{{ calculateTotalDiscount }}</span></p>
          <p>الاجمالى : <span>{{ calculateGrandTotal }}</span></p>
          <p v-if="orderInfo.invoiceType === 'تركيب وتوريد' || orderInfo.invoiceType === 'تركيب'  ">إجمالى التركيب: <span>{{ calculateTotalInstallation }}</span></p>

        </div>
        <div  class="fatoora__notes">
          <p>البضاعة المباعة لا ترد ولا تستبدل الا فى خلال 14 يوم كحد اقصى من تاريخ الفاتورة</p>
          <p>فى حالة التركيب يرجى من العميل توفير سلالم للفنيين</p>
        </div>
        <div class="qrcode_cont">
          <canvas id="qr-code"></canvas>
        </div>
      </div>
      <div class="fatoora__btns">
          <button @click.prevent="goBack">عودة للطلبات</button>
      </div>
    </div>
    <div id="loader">
      <div class="lds-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    <div id="scrollUp" class="scrollUp">
      
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'pinia'
import { useOrdersStore } from '@/store/order/orders.js';
import { useCategoriesStore } from '@/store/categories/categories.js';

import QRCode from 'qrcode'; 
import { nextTick } from 'vue'


export default {
  name: "Factora",
  components: {},
  computed: {
    getDarkMode() {
      return this.$store.state.darkMode;
    },
    ...mapState(useOrdersStore, ['orders']),
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
      return grandTotal.toFixed(2);
    },
    // حساب اجمالي التركيب
    calculateTotalInstallation() {
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
    },
  },
  async created() {
    
    this.fetchCategories();
    try {
      await this.fetchOrders();
      console.log('Orders fetched:', this.orders);
      this.orderId = this.$route.params.orderId;
      console.log('Order ID:', this.orderId);

      this.orderInfo = this.orders.find(order => order.id === this.orderId);
      console.log('Order Info:', this.orderInfo);

    
      await nextTick(); // انتظر حتى يتم تحميل الـ DOM
      this.generateQRCode();
      
      
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  },
  
  methods: {
    ...mapActions(useOrdersStore, ['fetchOrders']),
    ...mapActions(useCategoriesStore, ['fetchCategories']),

    loaderToggle(show) {
      let loader = document.getElementById("loader");
      loader.style.visibility = show ? "visible" : "hidden";
    },
    print() {
      window.print();
    },
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
    async generateQRCode() {
      try {
        const qrCodeData = 'https://www.example.com'; 
        const qrCanvas = document.getElementById('qr-code');
        await QRCode.toCanvas(qrCanvas, qrCodeData);
      } catch (error) {
        console.error('Error generating QR code:', error);
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
  },
  data() {
    return {
      orderId: '',
      orderInfo: null,
    };
  },
};
</script>
<style scoped lang="scss">
.fatora {
 // background-color: aqua;
  display: flex;
  flex-wrap: wrap;
}

.title {
  width: 100%;
  height: 80px;
 // background-color: sandybrown;
  display: flex;
  flex-wrap: wrap;
  > div:first-child {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    //background-color: rgb(21, 97, 107);
    > div:first-child {
      height: 40px;
      background-color: blue;
      width: 190px;
      display: flex;
      align-items: center;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      > div {
        width: 35px;
        height: 35px;
        border-radius: 17.5px;
        margin-left: 10px;
        background-color: white;

        img {
          width: 100%;
          height: 100%;
        }
      }
      p {
        text-transform: capitalize;
        text-align: center;
        margin-left: 20px;
        font-size: 18px;
        font-weight: 600;
        color: white;
        margin-right: 10px;
      }
    }
    > div:nth-of-type(2) {
      width: 340px;
      height: 80px;
      // background-color: greenyellow;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      > div {
        width: 100px;
        height: 40px;
        background-color: white;
       // background-color: black;
        border-radius: 4px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        button {
          width: 60px;
          background-color: white;
          // background-color: black;
          color: black;
        }
        img {
          width: 20px;
          height: 20px;
          margin-left: 10px;
        }
      }
    }
  }
 
}
.contTitle {
  background-color: blue;
}
.arroow {
  width: 15px;
  height: 15px;
}

.allContent {
  width: 96%;
  min-height: 550px;
  background-color: white;
  //background-color: rgb(207, 70, 70);
  margin-bottom: 160px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-content: flex-start;
  margin-left: 4%;
}

.generate {
    @extend  %center_flex;

    width: 140px;
    height: 40px;
    background-color: blue;
    cursor: pointer;
    border-radius: 5px;
    .printIcon{
      width: 20px;
      height: 20px;
    }

  p {
    font-size: 17px;
    font-weight: 600;
    font-family: Arial, Helvetica, sans-serif;
    text-transform: capitalize;
    color: white;
    margin-left: 10px;
  }
}
.generate p::first-letter {
  font-weight: 500;
  font-size: 19px;
}


// **fatora section** => start

//varibles

$buttom_fatoora_background:rgb(235, 229, 229);
$buttom_font_fatoora: 22px;
$font_weight_fatoora: 700;
$border_fatoora:2px solid rgb(71, 71, 71);
$buttom_color_fattora: black;
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
  background-color: $buttom_color_fattora;
  color: white;
  cursor: pointer;

}

%use_flex{
  display: flex;
  flex-wrap: wrap;
}
%center_flex{
  display: flex;
  align-items: center;
  justify-content: center;
}
%btn-style_fatoora{
  text-align: center;
  font-size: $buttom_font_fatoora;
  border-radius: 5px;
  border: none;
  font-weight: 700;
  background-color:$buttom_fatoora_background;
  color: block;
  cursor: pointer;

}

%font{
  font: {
      size:19px;
      weight:600;
    }
}

//start your style

 .fatoora{
    @extend %use_flex;
    justify-content:center;
    width: 60%;
    min-height:100vh;
 //   background-color: red;
    margin: auto;
    margin-top: 32px;
    border :$border_fatoora;
    border-radius: 5px;
  
}

.fatoora__header{
  @extend %use_flex;
  justify-content: space-evenly;
  width: 100%;
  height:250px;
   //background-color: rgb(153, 141, 141);
   
   >div{
     width: 30%;
     height: 100%;
    // background-color: antiquewhite;
    }
    >div:nth-child(3){
    @extend %use_flex;
    justify-content: end;
    align-content: space-evenly;
    .logoFatora{
      font-size: 40px;
      color: rgb(110, 108, 105);
      text-align: end;

      span{
        font-family: Arial, Helvetica, sans-serif;
        color: black;
      }
    }
    .categories{
      color: rgb(110, 108, 105);
      font-size: 30px;
      text-align: end;
    }

  }
  >div:nth-child(2){
    
    @extend %use_flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;

    button{
      
      @extend %btn-style_fatoora;
        width: 60%;
        height: 50px;
        margin-bottom: 15px;
        border: $border_fatoora;
      }
      span{
        width: 100px;
        height: 40px;
        line-height: 40px;
        @extend %font;
        
          //background-color:$buttom_fatoora_background;
        }

   }

  
 }

 .fatoora__title{
  width: 95%;
  height: 130px;
  border: $border_fatoora;
  @extend %use_flex;
  justify-content: space-evenly;
  >div{
    width: 40%;
    height: 100%;
   // background-color: aliceblue;

     p {
        //background-color: rgb(104, 149, 189);
        margin-top: 20px;
        text-align: end;
        font-weight: $font_weight_fatoora;
        font-size: $buttom_font_fatoora;
      }
    }
    
    
  }
  
  .fatoora__table{
    width: 95%;
    min-height: 70px;
    // background-color: rgb(172, 42, 42);
    .table{
      width: 100%;
      height: 100%;
   // background-color: salmon;
   tr{

     height: 30px;
     td,th{

       border: $border_fatoora;
       text-align: center;
       //background-color: sandybrown;
       
     }

    }
  }
  
}
.fatoora__sales{
  width: 95%;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content:space-evenly;
  padding-left: 20px;
  margin-top: 14px;
  p{
    //width: 280px;
    text-align: start;
    @extend %font;
    
    span{
      border: 2px solid black;
      padding: 4px;
    }
  }

}
.fatoora__notes{
  width: 95%;
  height: 100px;
  margin-top: 14px;

  //background-color: rgb(33, 108, 170);
  
  @extend %font;

  >p:nth-child(2){
    background-color: bisque;
    padding: 4px;
    display: inline-block;
    
  }
  
  
}
.qrcode_cont{
  
  width: 100%;
  height: 120px;
  @extend %center_flex;
  
}

.fatoora__btns{
  @extend %center_flex;
  width: 100%;
  height: 120px;
  //background-color: rgb(173, 62, 173);
  
    button{
    margin-bottom: 15px;
    width: 60%;
    height: 50px;
      border: $border_fatoora;
      @extend %btn-style_fatoora;

    }

  
 
}
@media (max-width: 450px){

// allContent
  .allContent{
    margin-left: 0%;
    width: 96%;

  }
  //fatoora
  .fatoora{
  width: 100%;
  
 }

//fatoora__header
 .fatoora__header{
 
   >div:nth-child(2){
   
      button{
          width: 90%;
        }

   }

  
 }

  //fatoora__title
 .fatoora__title{
 
  >div:nth-child(2){
    width:60%;
  }


 }



}



// **fatora section** => end


/* loader => start  */
.lds-spinner {
  color: official;
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-spinner div {
  transform-origin: 40px 40px;
  animation: lds-spinner 1.2s linear infinite;
}
.lds-spinner div:after {
  content: " ";
  display: block;
  position: absolute;
  top: 3px;
  left: 37px;
  width: 6px;
  height: 18px;
  border-radius: 20%;
  background: rgb(27, 25, 25);
}
.lds-spinner div:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: -1.1s;
}
.lds-spinner div:nth-child(2) {
  transform: rotate(30deg);
  animation-delay: -1s;
}
.lds-spinner div:nth-child(3) {
  transform: rotate(60deg);
  animation-delay: -0.9s;
}
.lds-spinner div:nth-child(4) {
  transform: rotate(90deg);
  animation-delay: -0.8s;
}
.lds-spinner div:nth-child(5) {
  transform: rotate(120deg);
  animation-delay: -0.7s;
}
.lds-spinner div:nth-child(6) {
  transform: rotate(150deg);
  animation-delay: -0.6s;
}
.lds-spinner div:nth-child(7) {
  transform: rotate(180deg);
  animation-delay: -0.5s;
}
.lds-spinner div:nth-child(8) {
  transform: rotate(210deg);
  animation-delay: -0.4s;
}
.lds-spinner div:nth-child(9) {
  transform: rotate(240deg);
  animation-delay: -0.3s;
}
.lds-spinner div:nth-child(10) {
  transform: rotate(270deg);
  animation-delay: -0.2s;
}
.lds-spinner div:nth-child(11) {
  transform: rotate(300deg);
  animation-delay: -0.1s;
}
.lds-spinner div:nth-child(12) {
  transform: rotate(330deg);
  animation-delay: 0s;
}
@keyframes lds-spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
#loader {
  width: 500px;
  height: 500px;
  visibility: hidden;
  /* background-color: slategray; */
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}
/* loader => end  */
.dark-mode-search {
  background-color: rgb(36, 36, 36);
  border: none !important;
  color: white !important;
}
.dark-mode {
  background-color: rgb(9, 9, 9) !important;
}
.dark-mode-title {
  color: white !important;
}
.dark-mode-box {
  background-color: black !important;
  box-shadow: 0 0 5px rgb(17, 16, 16);
}
@media (max-width: 477px) {
 

  .title {
    height: 210px;
    // background-color: red;
    > div:first-child {
      height: 60%;
      flex-direction: column;
      > div:first-child {
        align-self: flex-start;
        margin-top: 15px;
      }
      > div:nth-of-type(2) {
        align-self: flex-end;
      }
    }
  }
  
  .fatoora__header{
  
      >div:nth-child(3){

      .logoFatora{
        font-size: 30px;     
      }
      .categories{ 
        font-size: 20px;
      }

    }
}

}

@media print{
  .title,.fatoora__btns {
    display: none ;
  }

    .fatoora{
    width: 80%;
    min-height:90vh;
  }
  

}
</style>
