<template>
  <div class="details">
    <div class="title">
      <div>
        <div class="contTitle">
          <div>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUQUVkx6lAgtb3-3fMuDZnDixihOSrrNSAOg&usqp=CAU" />
          </div>
          <p :class="{ 'dark-mode-title': getDarkMode }">Details grid</p>
        </div>
        <div>
          <div class="export">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmvEXj1Sr-tzeKuEP9PgzajIUDvR_-L-zfkg&usqp=CAU" />
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
        <button @click.prevent="Fatora">فاتورة</button>
        <button @click.prevent="goBack">اغلاق</button>
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
      </div>
    </div>
    <div id="scrollUp" class="scrollUp"></div>
  </div>
</template>
  <script>
  import { mapState, mapActions } from 'pinia'
  import { useOrdersStore } from '@/store/order/orders.js';
  import { useCategoriesStore } from '@/store/categories/categories.js';

  
  
  export default {
    name: "DetailsOrder",
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
     Fatora() {

        const layout = this.$route.meta.layout;
        if (layout === 'DashboardLayout') {
        
          this.$router.push({ name: 'Fatora', params: { orderId: this.orderId } });
        
        } else if (layout === 'profileInDashboardLayout') {
          
          const profileId = this.$route.params.profileId;
          this.$router.push(`/dashboard/profile/${profileId}/Fatora/${this.orderId}`);
          
        }else if(layout === 'profileOutDashboardLayout'){
          
          const profileId = this.$route.params.profileId;
          this.$router.push(`/profile/${profileId}/Fatora/${this.orderId}`);
        
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
        orderId: '',
        orderInfo: null,
      };
    },
  };
  </script>
  <style scoped lang="scss">
  .details {
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

  @media (max-width: 450px){
  
  // allContent
    .allContent{
      margin-left: 0%;
      width: 100%;
  
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
  