<template>
  <div class="statistics">
      <div class="statistics_search">
          <!-- <select placeholder="filter"  class="filter" v-model="selectedFilter">
              <option value="all">منذ ان بدات </option>
              <option value="today">االيوم </option>
              <option value="yesterday" > امس</option>
              <option value="lastWeak"> اخر اسبوع</option>
              <option value="lastMonth">  الشهر الماضى</option>
              <option value="lastYear"> اخر سنة</option>
          </select> -->
          <div class="date-range">
            <div>
              <input 
              type="date" 
              id="to-date" 
              v-model="toDate" 
              placeholder="إلى" 
              />
              <label for="to-date">:الى</label>
            </div>
            <div>
              <input 
              type="date" 
              id="from-date" 
              v-model="fromDate" 
              placeholder="من" 
              />
              <label for="from-date">:من</label>
            </div>
          </div>
      </div>
      <div class="statistics_ressults">

        <StatisticsResult
          icon="shopping-cart"
          title="اجمالى المشتريات"
          :value="calculateTotalPurchases"
          :isLoading="true"

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
          :isLoading="true"

        />

        <StatisticsResult
          icon="dollar-sign"
          title="صافى المصنعيه "
          :value="calculateTotalPureInstallationForAllOrders"
          :isLoading="true"

        />

        <StatisticsResult
          icon="box-open"
          title="بعت بكام خامات" 
          :value="calculateTotalSales"
          :isLoading="true"

        />

        <StatisticsResult 
          icon="cash-register"
          title="صافى ربح الخامات"
          :value="calculateNetProfit"
          :isLoading="true"

        />

        
        <StatisticsResult 
          icon="cash-register"
          title="ليك كام برا"
          :value="finalTotalBalance"
                    :isLoading="true"
        />
        <!-- <StatisticsResult 
          icon="cash-register"
          title="خامات غير مدفوعه "
          :value="calculateUnpaidMaterialsForAllOrders"
        /> -->
        <!-- <StatisticsResult 
          icon="cash-register"
          title="مصنعيه غير مدفوعه "
          :value="calculateUnpaidInstallationForAllOrders"
        /> -->
        
       

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

// moment
import moment from 'moment';

// actions , state
import { mapActions, mapState } from 'pinia';

// store
import { useOrdersStore } from '@/store/order/orders.js';
import { usePurchasesStore } from '@/store/purchases/purchase.js';
import { useReturnsStore } from '@/store/purchaseReturns/returns.js';
import { useTransactionsStore } from '@/store/transactions/transactions.js';
import { useRandomTransactionsStore } from '@/store/transactions/randomTransactions.js';
import { useGetUserStore } from '@/store/users/users.js';


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
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
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
    transactions: 'transactions', totalRemainingBalance:'totalRemainingBalance',
  }),
  ...mapState(useReturnsStore, ['returns']),  
  ...mapState(useRandomTransactionsStore, ['allAddTransactions']),  
  ...mapState(useRandomTransactionsStore, ['transactionsData']),  


      // حساب المشتريات لجميع Purchases
      calculateTotalPurchases() {
          // فلترة العمليات بناءً على التاريخ المحدد
          const FilteredPurchases = this.filterByDateRange(this.purchases, this.fromDate, this.toDate);

          const totalPurchases = FilteredPurchases.reduce((total, purchase) => {
              // حساب إجمالي المنتجات لكل عملية شراء
              const purchaseTotal = purchase.products.reduce((subTotal, product) => {
                  const productPrice = product.price_buy || 0;
                  const productQuantity = product.quantity || 0;
                  const productTotalPrice = productPrice * productQuantity;

                  // حساب الخصم لكل منتج بناءً على النوع
                  let discountAmount = 0;
                  if (product.kindDiscount === 'percentage') {
                      discountAmount = productTotalPrice * (Number(product.valueDiscountOnBuy) / 100);
                  } else if (product.kindDiscount === 'fixed') {
                      discountAmount = Number(product.valueDiscountOnBuy) * productQuantity;
                  }

                  // إجمالي المنتج بعد الخصم
                  const productTotalAfterDiscount = productTotalPrice - discountAmount;
                  return subTotal + productTotalAfterDiscount;
              }, 0);

              // إضافة تكلفة الشحن إن وجدت
              const shippingCost = Number(purchase.shipping) || 0;

              // حساب إجمالي المرتجعات المتعلقة بهذه العملية
              const returnsForThisPurchase = this.returns.filter(returnItem => returnItem.purchaseId === purchase.id);
              let totalReturns = 0;

              if (returnsForThisPurchase.length > 0) {
                  totalReturns = returnsForThisPurchase.reduce((total, ret) => {
                      return total + ret.products.reduce((subTotal, product) => {
                          const productReturnPrice = product.price_buy || 0;
                          const productReturnQuantity = product.quantityReturn || 0;
                          const productReturnTotal = productReturnPrice * productReturnQuantity;

                          // حساب الخصم على المرتجعات
                          let returnDiscount = 0;
                          if (product.kindDiscount === 'percentage') {
                              returnDiscount = productReturnTotal * (Number(product.valueDiscountOnBuy) / 100);
                          } else if (product.kindDiscount === 'fixed') {
                              returnDiscount = Number(product.valueDiscountOnBuy) * productReturnQuantity;
                          }

                          const productReturnTotalAfterDiscount = productReturnTotal - returnDiscount;
                          return subTotal + productReturnTotalAfterDiscount;
                      }, 0);
                  }, 0);
              }

              // حساب الإجمالي النهائي بعد الشحن والمرتجعات
              const finalTotal = purchaseTotal + shippingCost - totalReturns;
              return total + finalTotal;
          }, 0);

          return totalPurchases.toFixed(2);
      },


      // //  حساب المشتريات لجميع  Purchases
      //  calculateTotalPurchases() {
      //   // const FilteredPurchases = this.filterByDate(this.purchases, this.selectedFilter);
      //   const FilteredPurchases = this.filterByDateRange(this.purchases, this.fromDate, this.toDate);

      //   const totalPurchases = FilteredPurchases.reduce((total, purchase) => {
      //     // حساب إجمالي المنتجات لكل عملية شراء
      //     const purchaseTotal = purchase.products.reduce((subTotal, product) => {
      //       const productPrice = product.price_buy || 0;
      //       const productTotalPrice = productPrice * product.quantity;
      //       return subTotal + productTotalPrice;
      //     }, 0);

      //     // حساب الخصم بعد إجمالي المنتجات
      //     let discountAmount = 0;
      //     if (purchase.discount_type === 'percentage') {
      //       discountAmount = purchaseTotal * (purchase.discount_value / 100);
      //     } else if (purchase.discount_type === 'fixed') {
      //       discountAmount = Number(purchase.discount_value);
      //     }

      //     // إضافة تكلفة الشحن إن وجدت
      //     const shippingCost = Number(purchase.shipping) || 0;

      //     // حساب إجمالي المرتجعات المتعلقة بهذه العملية
      //     const returnsForThisPurchase = this.returns.filter(returnItem => returnItem.purchaseId === purchase.id);
      //     let totalReturns = 0;
      //     if (returnsForThisPurchase.length > 0) {
      //       totalReturns = returnsForThisPurchase.reduce((total, ret) => {
      //         return total + ret.products.reduce((subTotal, product) => {
      //           return subTotal + product.quantityReturn * product.price_buy;
      //         }, 0);
      //       }, 0);

      //       // حساب الخصم المطبق على المرتجعات
      //       const discountOnReturns = this.calculateDiscountOnReturns(totalReturns, purchase);
      //       totalReturns -= discountOnReturns;
      //     }

      //     // حساب الإجمالي النهائي بعد الخصم، تكلفة الشحن، والمرتجعات
      //     const finalTotal = purchaseTotal - discountAmount + shippingCost - totalReturns;
      //     return total + finalTotal;
      //   }, 0);

      //   return totalPurchases.toFixed(2);
      // },



//  Purchases  حساب المشتريات لغير المدفوع الاجل يعنى
  calculateTotalPurchasesUnPaid() {

    // const FilteredPurchases =  this.filterByDate(this.purchases, this.selectedFilter)
    const FilteredPurchases =  this.filterByDateRange(this.purchases, this.fromDate, this.toDate);

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

    const FilteredOrders = this.filterByDateRange(this.orders, this.fromDate, this.toDate);
    const getOrderWithInstallationProducts = FilteredOrders?.filter(
      order => order.invoiceType === 'تركيب' || order.invoiceType === 'تركيب وتوريد'
    );

    const totalInstallation = getOrderWithInstallationProducts.reduce((total, order) => {
      // إذا كان laborPrice موجودًا، نستخدمه مباشرة ولا نحسب أي شيء آخر
      if (order.laborPrice) {
        return total + parseFloat(order.laborPrice);
      }

      let orderTotalInstallation = 0;

      // حساب إجمالي التركيبات من المنتجات العادية
      if (order.products) {
        orderTotalInstallation += order.products.reduce((subTotal, product) => {
          if (product.productInfo.priceWithLabor) {
            const productInstallationPrice = product.editOfInstallation 
              ? product.editOfInstallation 
              : product.productInfo.priceWithLabor;
            return subTotal + productInstallationPrice * product.quantity;
          } else {
            return subTotal;
          }
        }, 0);
      }

      // حساب إجمالي التركيبات من حقول Joker
      if (order.jokerFields) {
        orderTotalInstallation += order.jokerFields.reduce((subTotal, joker) => {
          if (joker.willBeCalculated && joker.calculationType === "installation") {
            if (joker.value && joker.quantity) {
              return subTotal + (joker.value * joker.quantity);
            } else if (joker.value) {
              return subTotal + joker.value;
            }
          }
          return subTotal;
        }, 0);
      }

      return total + orderTotalInstallation;
    }, 0);

    return totalInstallation.toFixed(2);

  },

// orders  حساب صافى ربح المصنعيه لجميع

calculateTotalPureInstallationForAllOrders() {

  // const filteredOrders = this.filterByDate(this.orders, this.selectedFilter);
  const filteredOrders =  this.filterByDateRange(this.orders, this.fromDate, this.toDate);
  const getOrderWithInstalitionProducts = filteredOrders?.filter(order => order.invoiceType === 'تركيب' || order.invoiceType === 'تركيب وتوريد');

  const filteredAddTransactions =  this.filterByDateRange(this.allAddTransactions, this.fromDate, this.toDate);


  // حساب إجمالي المعاملات العشوائية
  const randomTransactions = filteredAddTransactions.filter(
    (transaction) => transaction.reduce === true
  );
  const totalRandomTransactions = randomTransactions.reduce(
    (sum, transaction) => sum + (Number(transaction.amount)  || 0),
    0
  );



  const totalInstallation = getOrderWithInstalitionProducts.reduce((total, order) => {

    let orderTotalInstallation = 0;

    // إذا كان laborPrice موجودًا، نستخدمه مباشرة
    if (order.laborPrice) {
      orderTotalInstallation = parseFloat(order.laborPrice);
    } else {
      // حساب إجمالي المصنعية من المنتجات العادية
      if (order.products) {
        orderTotalInstallation += order.products.reduce((subTotal, product) => {
          if (product.productInfo.priceWithLabor) {
            const productInstallationPrice = product.editOfInstallation 
              ? product.editOfInstallation 
              : product.productInfo.priceWithLabor;
            return subTotal + productInstallationPrice * product.quantity;
          } else {
            return subTotal;
          }
        }, 0);
      }

      // حساب إجمالي المصنعية من حقول Joker
      if (order.jokerFields) {
        orderTotalInstallation += order.jokerFields.reduce((subTotal, joker) => {
          if (joker.willBeCalculated && joker.calculationType === "installation") {
            if (joker.value && joker.quantity) {
              return subTotal + (joker.value * joker.quantity);
            } else if (joker.value) {
              return subTotal + joker.value;
            }
          }
          return subTotal;
        }, 0);
      }
    }

        
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

  // خصم المعاملات العشوائية من الإجمالي
  const netInstallation = totalInstallation - totalRandomTransactions;

  return netInstallation.toFixed(2);

},



// orders حساب الخامات لجميع
  calculateTotalSales() {
    
    // const FilteredOrders =  this.filterByDate(this.orders, this.selectedFilter)
    const FilteredOrders =  this.filterByDateRange(this.orders, this.fromDate, this.toDate);
    const getOrderWithSellProducts = FilteredOrders?.filter(order => order.invoiceType === 'توريد' || order.invoiceType === 'تركيب وتوريد');


    const totalSales = getOrderWithSellProducts.reduce((total, order) => {
      
    // console.log(order)
    let orderTotalSales = 0;
    if (order.products) {
      orderTotalSales += order.products.reduce((subTotal, product) => {
        const productPrice =Number(product.priceWithIncrease)  
          ? Number(product.priceWithIncrease) 
          :Number(product.productInfo.priceMaterial);

        const productTotalPrice = Number(productPrice) * Number(product.quantity) ;
        const discountAmount = Number(productTotalPrice)  * (Number(product.price_offer) / 100);
        return subTotal + (productTotalPrice - discountAmount);
      }, 0);
    }

     // حساب إجمالي التركيبات من حقول Joker
     if (order.jokerFields) {
      orderTotalSales += order.jokerFields.reduce((subTotal, joker) => {
          if (joker.willBeCalculated && joker.calculationType === "material") {
            if (joker.value && joker.quantity) {
              return subTotal + (joker.value * joker.quantity);
            } else if (joker.value) {
              return subTotal + joker.value;
            }
          }
          return subTotal;
        }, 0);
      }

      return total + orderTotalSales;
    }, 0);
  
    return totalSales.toFixed(2);
  },



  // حساب صافي الربح لجميع الطلبات
calculateNetProfit() {
  const FilteredOrders = this.filterByDateRange(this.orders, this.fromDate, this.toDate);
    const getOrderWithSellProducts = FilteredOrders?.filter(
      order => order.invoiceType === 'توريد' || order.invoiceType === 'تركيب وتوريد'
    );

    const netProfit = getOrderWithSellProducts.reduce((totalProfit, order) => {
      let orderNetProfit = 0;

      // حساب صافي الربح من المنتجات العادية
      if (order.products) {
        orderNetProfit += order.products.reduce((subTotal, product) => {
          // التحقق من وجود البيانات المطلوبة
          if (
            !product.productInfo?.buyPrice ||
            typeof product.productInfo.valueDiscountOnBuy === 'undefined' ||
            typeof product.productInfo.kindDiscount === 'undefined' ||
            !product.quantity
          ) {
            return subTotal; // تخطي المنتجات التي لا تحتوي على المعلومات الكافية
          }

          // حساب تكلفة الشراء بعد الخصم
          const productBuyPrice = Number(product.productInfo.buyPrice);
          const productQuantity = Number(product.quantity);
          let productCost = productBuyPrice * productQuantity;

          if (product.productInfo.kindDiscount === 'percentage') {
            const discount = productCost * (Number(product.productInfo.valueDiscountOnBuy) / 100);
            productCost -= discount;
          } else if (product.productInfo.kindDiscount === 'fixed') {
            const discount = Number(product.productInfo.valueDiscountOnBuy) * productQuantity;
            productCost -= discount;
          }

          // حساب إجمالي سعر البيع
          const productSellPrice = Number(product.priceWithIncrease)
            ? Number(product.priceWithIncrease)
            : Number(product.productInfo.priceMaterial);
          const productTotalSellPrice = productSellPrice * productQuantity;
          const discountAmount = productTotalSellPrice * (Number(product.price_offer) / 100);
          const productSellTotalAfterDiscount = productTotalSellPrice - discountAmount;

          // حساب الربح الصافي للمنتج
          const productProfit = productSellTotalAfterDiscount - productCost;

          return subTotal + productProfit;
        }, 0);
      }

      // حساب صافي الربح من حقول Joker
      if (order.jokerFields) {
        orderNetProfit += order.jokerFields.reduce((subTotal, joker) => {
          if (joker.willBeCalculated && joker.calculationType === "material") {
            // حساب تكلفة الشراء بعد الخصم
            const jokerBuyPrice = Number(joker.purchaseCost);
            const jokerQuantity = Number(joker.quantity);
            console.log("jokerQuantity",jokerQuantity)
            let jokerCost = jokerBuyPrice * (jokerQuantity || 1);
            console.log("jokerCost",jokerCost)

            if (joker.kindDiscount === 'percentage') {
              const discount = jokerCost * (Number(joker.valueDiscountOnBuy) / 100);
              jokerCost -= discount;
            } else if (joker.kindDiscount === 'fixed') {
              const discount = Number(joker.valueDiscountOnBuy) * jokerQuantity;
              jokerCost -= discount;
            }

            // حساب إجمالي سعر البيع
            const jokerSellPrice = Number(joker.value);
            const jokerSellTotal = jokerSellPrice * (jokerQuantity || 1); // إذا لم تكن الكمية موجودة، نستخدم 1
            const discountAmount = jokerSellTotal * (Number(joker.price_offer || 0) / 100);
            const jokerSellTotalAfterDiscount = jokerSellTotal - discountAmount;

            // حساب الربح الصافي لحقل Joker
            const jokerProfit = jokerSellTotalAfterDiscount - jokerCost;

            return subTotal + jokerProfit;
          }
          return subTotal;
        }, 0);
      }

      return totalProfit + orderNetProfit;
    }, 0);

    return netProfit.toFixed(2);
 
},


  // // Filter out unfinished orders and calculate installation cost

  calculateUnpaidMaterialsForAllOrders() {
  // const filteredOrders = this.filterByDate(this.orders, this.selectedFilter);
  const filteredOrders =  this.filterByDateRange(this.orders, this.fromDate, this.toDate);

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
  // const filteredOrders = this.filterByDate(this.orders, this.selectedFilter);
  const filteredOrders =  this.filterByDateRange(this.orders, this.fromDate, this.toDate);

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

  finalTotalBalance() {
    const onePlace = this.totalRemainingBalance;
    const moreThanPlace = this.transactionsData;
    console.log(onePlace)
    // حساب إجمالي الـ balance من transactionsData
      var totalBalancesSum = moreThanPlace.reduce(
        (sum, profile) => sum + Number(profile.balance), 
        0
      );

    // حساب المجموع النهائي
    return  Number(onePlace) + totalBalancesSum;
  }
},
methods: {
  ...mapActions(useOrdersStore, ['fetchOrders']),
  ...mapActions(usePurchasesStore, ['fetchPurchases']),
  ...mapActions(useReturnsStore, ['fetchAllReturns']), 
  ...mapActions(useTransactionsStore, ['fetchTransactions','fetchUsersAndTransactions']),
  ...mapActions(useRandomTransactionsStore, ['fetchAllAddTransactions']),
  ...mapActions(useRandomTransactionsStore, ['fetchTransactionsForClients']),
  ...mapActions(useGetUserStore, ['fetchUsers']),


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
   this.fetchAllAddTransactions();
   this.fetchTransactions();
   await this.fetchUsers();
   // More than Place
   this.fetchTransactionsForClients();
   // One Place
   this.fetchUsersAndTransactions();
  //  console.log("transactionsData",this.transactionsData)
  //  console.log("totalRemainingBalance",this.totalRemainingBalance)
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
  // background-color: hotpink;
  
}

.date-range {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: end;
  // background-color: red;
}

.date-range input {
  padding: 5px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.date-range label {
  padding: 10px;
 
}

@media (max-width: 477px){
  .statistics_ressults{
    // background-color: #f9f7f7;
    background-color:hsl(0, 100%, 98%);  
  }
  
  .date-range {
    flex-direction: column-reverse;
    margin-right: 40px;
  }
  
}

</style>
