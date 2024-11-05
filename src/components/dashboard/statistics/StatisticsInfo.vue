<template>
  <div class="statistics">
      <div class="statistics_search">
          <select placeholder="filter"  class="filter" v-model="selectedFilter">
              <option value="all">منذ ان بدات </option>
              <option value="today">االيوم </option>
              <option value="yesterday" > امس</option>
              <option value="lastWeak"> اخر اسبوع</option>
              <option value="lastMonth">  الشهر الماضى</option>
              <option value="lastYear"> اخر سنة</option>
          </select>
      </div>
      <div class="statistics_ressults">

        <StatisticsResult
          icon="shopping-cart"
          title="اجمالى المشتريات"
          :value="calculateTotalPurchases"
        />

        <StatisticsResult
          icon="file-invoice-dollar"
          title="مشتريات غير مدفوعة"
          :value="calculateTotalPurchasesUnPaid"
        />


        <StatisticsResult
          icon="dollar-sign"
          title="المصنعيه"
          :value="calculateTotalInstallationForAllOrders"
        />

        <StatisticsResult
          icon="dollar-sign"
          title="صافى المصنعيه "
          :value="calculateTotalPureInstallationForAllOrders"
        />

        <StatisticsResult
          icon="box-open"
          title="بعت بكام خامات" 
          :value="calculateTotalSales"
        />

        <StatisticsResult v-if="false"
          icon="cash-register"
          title="صافى ربح الخامات"
          value="1230"
        />

        
        <StatisticsResult 
          icon="cash-register"
          title="خامات غير مدفوعه "
          :value="calculateUnpaidMaterialsForAllOrders"
        />
        <StatisticsResult 
          icon="cash-register"
          title="مصنعيه غير مدفوعه "
          :value="calculateUnpaidInstallationForAllOrders"
        />
        
       

        <!-- <StatisticsResult
          icon="clipboard-list"
          title="الشغل الغير مدفوع او غير منتهى"
          :isNonPaid="true"
        >
          <p class="supResult"> <span> خامات :</span> {{ calculateTotalSalesForUnfinishedOrders }} </p>
          <p class="supResult supResul--installation"> <span> مصنعية :  </span> {{ calculateTotalInstallationForUnfinishedOrders }} </p>
        </StatisticsResult> -->
        
      </div>
  </div>
</template>
<script>

// actions , state
import { mapActions, mapState } from 'pinia';

// store
import { useOrdersStore } from '@/store/order/orders.js';
import { usePurchasesStore } from '@/store/purchases/purchase.js';
import { useReturnsStore } from '@/store/purchaseReturns/returns.js';
import { useTransactionsStore } from '@/store/transactions/transactions.js';

// library
// import moment from 'moment';

// StatisticsResult
import StatisticsResult from '@/components/dashboard/statistics/StatisticsResult.vue';

// mixins 
import dateFilterMixin from '@/mixins/dateFilterMixin';

export default {
name: "statistics",
mixins: [dateFilterMixin],
components: {
    StatisticsResult
  },
data() {
  return {
    selectedFilter: 'all',
  };
},
computed: {
  ...mapState(useOrdersStore, {
    orders: 'orders',
  }),
  ...mapState(usePurchasesStore, {
    purchases: 'purchases',
  }),
  ...mapState(useTransactionsStore, {
    transactions: 'transactions',
  }),
  ...mapState(useReturnsStore, ['returns']),  


      //  حساب المشتريات لجميع  Purchases
      calculateTotalPurchases() {
        const FilteredPurchases = this.filterByDate(this.purchases, this.selectedFilter);

        const totalPurchases = FilteredPurchases.reduce((total, purchase) => {
          // حساب إجمالي المنتجات لكل عملية شراء
          const purchaseTotal = purchase.products.reduce((subTotal, product) => {
            const productPrice = product.price_buy || 0;
            const productTotalPrice = productPrice * product.quantity;
            return subTotal + productTotalPrice;
          }, 0);

          // حساب الخصم بعد إجمالي المنتجات
          let discountAmount = 0;
          if (purchase.discount_type === 'percentage') {
            discountAmount = purchaseTotal * (purchase.discount_value / 100);
          } else if (purchase.discount_type === 'fixed') {
            discountAmount = Number(purchase.discount_value);
          }

          // إضافة تكلفة الشحن إن وجدت
          const shippingCost = Number(purchase.shipping) || 0;

          // حساب إجمالي المرتجعات المتعلقة بهذه العملية
          const returnsForThisPurchase = this.returns.filter(returnItem => returnItem.purchaseId === purchase.id);
          let totalReturns = 0;
          if (returnsForThisPurchase.length > 0) {
            totalReturns = returnsForThisPurchase.reduce((total, ret) => {
              return total + ret.products.reduce((subTotal, product) => {
                return subTotal + product.quantityReturn * product.price_buy;
              }, 0);
            }, 0);

            // حساب الخصم المطبق على المرتجعات
            const discountOnReturns = this.calculateDiscountOnReturns(totalReturns, purchase);
            totalReturns -= discountOnReturns;
          }

          // حساب الإجمالي النهائي بعد الخصم، تكلفة الشحن، والمرتجعات
          const finalTotal = purchaseTotal - discountAmount + shippingCost - totalReturns;
          return total + finalTotal;
        }, 0);

        return totalPurchases.toFixed(2);
      },



//  Purchases  حساب المشتريات لغير المدفوع الاجل يعنى
  calculateTotalPurchasesUnPaid() {

    const FilteredPurchases =  this.filterByDate(this.purchases, this.selectedFilter)
    const unfinishedOrders = FilteredPurchases.filter(purchases => purchases.status == '1' );

  const totalPurchases = unfinishedOrders.reduce((total, purchase) => {
             // حساب إجمالي المنتجات لكل عملية شراء
             const purchaseTotal = purchase.products.reduce((subTotal, product) => {
            const productPrice = product.price_buy || 0;
            const productTotalPrice = productPrice * product.quantity;
            return subTotal + productTotalPrice;
          }, 0);

          // حساب الخصم بعد إجمالي المنتجات
          let discountAmount = 0;
          if (purchase.discount_type === 'percentage') {
            discountAmount = purchaseTotal * (purchase.discount_value / 100);
          } else if (purchase.discount_type === 'fixed') {
            discountAmount = Number(purchase.discount_value);
          }

          // إضافة تكلفة الشحن إن وجدت
          const shippingCost = Number(purchase.shipping) || 0;

          // حساب إجمالي المرتجعات المتعلقة بهذه العملية
          const returnsForThisPurchase = this.returns.filter(returnItem => returnItem.purchaseId === purchase.id);
          let totalReturns = 0;
          if (returnsForThisPurchase.length > 0) {
            totalReturns = returnsForThisPurchase.reduce((total, ret) => {
              return total + ret.products.reduce((subTotal, product) => {
                return subTotal + product.quantityReturn * product.price_buy;
              }, 0);
            }, 0);

            // حساب الخصم المطبق على المرتجعات
            const discountOnReturns = this.calculateDiscountOnReturns(totalReturns, purchase);
            totalReturns -= discountOnReturns;
          }

          // حساب الإجمالي النهائي بعد الخصم، تكلفة الشحن، والمرتجعات
          const finalTotal = purchaseTotal - discountAmount + shippingCost - totalReturns;
          return total + finalTotal;
        }, 0);

        return totalPurchases.toFixed(2);
},


 
// orders  حساب التركيب لجميع
  calculateTotalInstallationForAllOrders() {
    const FilteredOrders =  this.filterByDate(this.orders, this.selectedFilter)
    const totalInstallation =FilteredOrders.reduce((total, order) => {
      if (order.laborPrice) {
        return total + parseFloat(order.laborPrice);
      } else {
        const orderTotalInstallation = order.products.reduce((subTotal, product) => {
          if (product.productInfo.priceWithLabor) {

            const productInstallationPrice = product.editOfInstallation 
              ? product.editOfInstallation 
              : product.productInfo.priceWithLabor;


            return subTotal + productInstallationPrice * product.quantity;
          } else {
            return subTotal;
          }
        }, 0);
        return total + orderTotalInstallation;
      }
    }, 0);
  
    return totalInstallation.toFixed(2);
  },

// orders  حساب صافى ربح المصنعيه لجميع

calculateTotalPureInstallationForAllOrders() {
  const filteredOrders = this.filterByDate(this.orders, this.selectedFilter);
  const totalInstallation = filteredOrders.reduce((total, order) => {
    const orderTotalInstallation = order.laborPrice
      ? parseFloat(order.laborPrice)
      : order.products.reduce((subTotal, product) => {
          if (product.productInfo.priceWithLabor) {
            const productInstallationPrice = product.editOfInstallation 
              ? product.editOfInstallation 
              : product.productInfo.priceWithLabor;

            return subTotal + productInstallationPrice * product.quantity;
          } else {
            return subTotal;
          }
        }, 0);

        
    // جلب المعاملة المرتبطة وخصم التكاليف إن وجدت
    console.log("before transaction ")
    let transaction = null;
    if (order.financialTechnicalTransactionId) {
      transaction = this.transactions.find(t => t.id === order.financialTechnicalTransactionId);
      console.log("found transaction ")

    }

    if (transaction) {
      
      console.log("inside transaction ", transaction)
      const technicianCost = transaction.DailyIndustrial 
      ? Number(transaction.numberOfDayes)  * Number(transaction.DailyIndustrialPrice )
      :Number(transaction.amount)  || 0;
      
      console.log("between transaction " , transaction.DailyIndustrial , transaction.DailyAssistantIndustrial)
      console.log("between transaction valus asis" , transaction.numberOfDayesAssistant ,  transaction.DailyIndustrialPriceAssistant   )
      console.log("between transaction valusTotal asia" ,Number( transaction.numberOfDayesAssistant ) * Number( transaction.DailyIndustrialPriceAssistant )  )

      const assistantCost = transaction.DailyAssistantIndustrial 
        ?Number( transaction.numberOfDayesAssistant ) * Number( transaction.DailyIndustrialPriceAssistant )  
        :  0;

      return total + (orderTotalInstallation - (technicianCost + assistantCost));
    }

    return total + orderTotalInstallation;
  }, 0);

  return totalInstallation.toFixed(2);
},



// orders حساب الخامات لجميع
  calculateTotalSales() {
    
    const FilteredOrders =  this.filterByDate(this.orders, this.selectedFilter)

    const totalSales = FilteredOrders.reduce((total, order) => {
    const orderTotalSales = order.products.reduce((subTotal, product) => {

        const productPrice = product.priceWithIncrease 
          ? product.priceWithIncrease 
          : product.productInfo.priceMaterial;

        const productTotalPrice = productPrice * product.quantity;
        const discountAmount = productTotalPrice * (product.price_offer / 100);
        return subTotal + (productTotalPrice - discountAmount);
      }, 0);
      return total + orderTotalSales;
    }, 0);
  
    return totalSales.toFixed(2);
  },

  // // Filter out unfinished orders and calculate installation cost

  calculateUnpaidMaterialsForAllOrders() {
  const filteredOrders = this.filterByDate(this.orders, this.selectedFilter);
  const totalUnpaidMaterials = filteredOrders.reduce((total, order) => {
    if (order.financialClientTransactionId) {
      // جلب المعاملة المرتبطة
      const transaction = this.transactions.find(t => t.id === order.financialClientTransactionId);

      if (transaction && transaction.amount) {
        // تحويل amount إلى رقم
        let totalMaterials = Number(transaction.amount);
    
        
        // خصم دفعات الخامات من amount إذا كان هناك دفعات
        const materialPayments = transaction.payments?.filter(payment => payment.type === "material") || [];
        
        materialPayments.forEach(payment => {
          totalMaterials -= Number(payment.amount);
        });

        // إذا كانت القيمة موجبة، أضفها للمجموع الكلي
        return total + Math.max(totalMaterials, 0);
      }
    }
    return total; // في حال عدم وجود بيانات
  }, 0);

  return totalUnpaidMaterials.toFixed(2);
},


  // // Filter out unfinished orders and calculate installation cost
  calculateUnpaidInstallationForAllOrders() {
  const filteredOrders = this.filterByDate(this.orders, this.selectedFilter);
  const totalUnpaidInstallation = filteredOrders.reduce((total, order) => {
    if (order.financialClientTransactionId) {
      // جلب المعاملة المرتبطة
      const transaction = this.transactions.find(t => t.id === order.financialClientTransactionId);

      if (transaction && transaction.manufacturingAmount) {
        // تحويل manufacturingAmount إلى رقم
        let totalInstallation = parseFloat(transaction.manufacturingAmount);
        
        // خصم دفعات المصنعية من manufacturingAmount إذا كان هناك دفعات
        const installationPayments = transaction.payments?.filter(payment => payment.type === "industrial") || [];
        
        installationPayments.forEach(payment => {
          totalInstallation -= parseFloat(payment.amount);
        });

        // إذا كانت القيمة موجبة، أضفها للمجموع الكلي
        return total + Math.max(totalInstallation, 0);
      }
    }
    return total; // في حال عدم وجود بيانات
  }, 0);

  return totalUnpaidInstallation.toFixed(2);
},

  
  // // Filter out unfinished orders and calculate installation cost
  // calculateTotalInstallationForUnfinishedOrders() {

  //   const FilteredOrders =  this.filterByDate(this.orders, this.selectedFilter)

  //   const unfinishedOrders = FilteredOrders.filter(order => order.status == '1' );
  //   return unfinishedOrders.reduce((total, order) => {
  //     if (order.laborPrice) {
  //       return total + parseFloat(order.laborPrice);
  //     } else {
  //       const orderTotalInstallation = order.products.reduce((subTotal, product) => {
  //         if (product.productInfo.priceWithLabor) {

  //           const productInstallationPrice = product.editOfInstallation 
  //             ? product.editOfInstallation 
  //             : product.productInfo.priceWithLabor;


  //           return subTotal + productInstallationPrice * product.quantity;

  //         } else {
  //           return subTotal;
  //         }
  //       }, 0);
  //       return total + orderTotalInstallation;
  //     }
  //   }, 0).toFixed(2);
  // },

  // Filter out unfinished orders and calculate sales
  // calculateTotalSalesForUnfinishedOrders() {

  //   const FilteredOrders =  this.filterByDate(this.orders, this.selectedFilter)

  //   const unfinishedOrders = FilteredOrders.filter(order => order.status == '1' );
  //   return unfinishedOrders.reduce((total, order) => {
  //     const orderTotalSales = order.products.reduce((subTotal, product) => {

  //       const productPrice = product.priceWithIncrease 
  //         ? product.priceWithIncrease 
  //         : product.productInfo.priceMaterial;

  //       const productTotalPrice = productPrice * product.quantity;   
  //       const discountAmount = productTotalPrice * (product.price_offer / 100);
  //       return subTotal + (productTotalPrice - discountAmount);
  //     }, 0);
  //     return total + orderTotalSales;
  //   }, 0).toFixed(2);
  // },
},
methods: {
  ...mapActions(useOrdersStore, ['fetchOrders']),
  ...mapActions(usePurchasesStore, ['fetchPurchases']),
  ...mapActions(useReturnsStore, ['fetchAllReturns']), 
  ...mapActions(useTransactionsStore, ['fetchTransactions']),


    // دالة لحساب الخصم المطبق على المرتجعات
   calculateDiscountOnReturns(totalReturns, purchase) {
      let discountAmount = 0;
      console.log("purchase",purchase)
      if (purchase.discount_type === 'percentage') {
        discountAmount = totalReturns * (purchase.discount_value / 100);
      } else if (purchase.discount_type === 'fixed') {
        const totalPurchases = purchase.products.reduce((subTotal, product) => {
          return subTotal + product.price_buy * product.quantity;
        }, 0);
        discountAmount = (purchase.discount_value * totalReturns) / totalPurchases;
      }

      return discountAmount;
    },

},
async created() {
   this.fetchOrders();
   this.fetchPurchases();
   this.fetchAllReturns();
   await this.fetchTransactions();
},
};
</script>


<style scoped lang="scss">

.statistics{
width: 96%;
min-height: 300px;
margin-left: 4%;
display: flex;
flex-direction: column;
justify-content: space-evenly;
align-items: flex-end;

}

.statistics_ressults{
  background-color: white;
  width: 100%;
  min-height: 200px;
  display: flex;
  flex-wrap: wrap;
  justify-content:space-evenly;
  align-items: center;
  align-content: space-evenly;
  //background-color: hotpink;
  
}



@media (max-width: 477px){
  .statistics_ressults{
     // background-color: #f9f7f7;
      background-color:hsl(0, 100%, 98%);
      
  }

  
}

</style>
