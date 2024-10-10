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
          icon="file-invoice-dollar"
          title="مشتريات غير مدفوعة"
          value="20000"
        />

        <StatisticsResult
          icon="shopping-cart"
          title="اجمالى المشتريات"
          value="20000"
        />

        <StatisticsResult
          icon="clipboard-list"
          title="طلبات غير مدفوعة (غير منتهى)"
          :isNonPaid="true"
        >
          <p class="supResult"> <span> خامات :</span> {{ calculateTotalSalesForUnfinishedOrders }} </p>
          <p class="supResult supResul--installation"> <span> مصنعية :  </span> {{ calculateTotalInstallationForUnfinishedOrders }} </p>
        </StatisticsResult>

        <StatisticsResult
          icon="dollar-sign"
          title="الربح (مصنعية)"
          :value="calculateTotalInstallationForAllOrders"
        />

        <StatisticsResult
          icon="box-open"
          title="(الخامات) المبيعات"
          :value="calculateTotalSales"
        />

        <StatisticsResult
          icon="cash-register"
          title="صافى المبيعات"
          value="20000"
        />
      </div>
  </div>
</template>
<script>

// actions , state
import { mapActions, mapState } from 'pinia';

// store
import { useOrdersStore } from '@/store/order/orders.js';

// library
import moment from 'moment';

// StatisticsResult
import StatisticsResult from '@/components/dashboard/statistics/StatisticsResult.vue';

export default {
name: "statistics",
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

  filteredOrders() {
    const now = moment();

    return this.orders.filter(order => {
      const orderDate = moment(order.date);
      
      if (!orderDate.isValid()) {
        console.error('Invalid Date:', order.date);
        return false;
      }
      
      switch (this.selectedFilter) {
        case 'today':
          return orderDate.isSame(now, 'day');
        case 'yesterday':
          return orderDate.isSame(now.clone().subtract(1, 'days'), 'day');
        case 'lastWeak': {
          const startOfWeek = now.clone().subtract(7, 'days').startOf('day');
          const endOfWeek = now.clone().endOf('day');
          return orderDate.isBetween(startOfWeek, endOfWeek, 'day', '[]');
        }
        case 'lastMonth': {
          const startOfThisMonth = now.clone().startOf('month');
          const startOfLastMonth = now.clone().subtract(1, 'month').startOf('month');
          return orderDate.isBetween(startOfLastMonth, startOfThisMonth, null, '[]');
        }
        case 'lastYear':
          return orderDate.isBetween(now.clone().subtract(1, 'year'), now, null, '[]');
        case 'all':
        default:
          return true;
      }
    });
  },

  calculateTotalInstallationForAllOrders() {
    console.log("calculateTotalInstallationForAllOrders",this.filteredOrders)
    const totalInstallation = this.filteredOrders.reduce((total, order) => {
      if (order.laborPrice) {
        return total + parseFloat(order.laborPrice);
      } else {
        const orderTotalInstallation = order.products.reduce((subTotal, product) => {
          if (product.productInfo.priceWithLabor) {
            return subTotal + product.productInfo.priceWithLabor * product.quantity;
          } else {
            return subTotal;
          }
        }, 0);
        return total + orderTotalInstallation;
      }
    }, 0);
  
    return totalInstallation.toFixed(2);
  },

  calculateTotalSales() {
    console.log("calculateTotalSales",this.filteredOrders)

    const totalSales = this.filteredOrders.reduce((total, order) => {
      const orderTotalSales = order.products.reduce((subTotal, product) => {
        const productTotalPrice = product.productInfo.priceMaterial * product.quantity;
        const discountAmount = productTotalPrice * (product.price_offer / 100);
        return subTotal + (productTotalPrice - discountAmount);
      }, 0);
      return total + orderTotalSales;
    }, 0);
  
    return totalSales.toFixed(2);
  },

  calculateTotalInstallationForUnfinishedOrders() {
    // Filter out unfinished orders and calculate installation cost
    const unfinishedOrders = this.filteredOrders.filter(order => order.status == '1' );
    return unfinishedOrders.reduce((total, order) => {
      if (order.laborPrice) {
        return total + parseFloat(order.laborPrice);
      } else {
        const orderTotalInstallation = order.products.reduce((subTotal, product) => {
          if (product.productInfo.priceWithLabor) {
            return subTotal + product.productInfo.priceWithLabor * product.quantity;
          } else {
            return subTotal;
          }
        }, 0);
        return total + orderTotalInstallation;
      }
    }, 0).toFixed(2);
  },

  calculateTotalSalesForUnfinishedOrders() {
    // Filter out unfinished orders and calculate sales
    const unfinishedOrders = this.filteredOrders.filter(order => order.status == '1' );
    return unfinishedOrders.reduce((total, order) => {
      const orderTotalSales = order.products.reduce((subTotal, product) => {
        const productTotalPrice = product.productInfo.priceMaterial * product.quantity;
        const discountAmount = productTotalPrice * (product.price_offer / 100);
        return subTotal + (productTotalPrice - discountAmount);
      }, 0);
      return total + orderTotalSales;
    }, 0).toFixed(2);
  },
},
methods: {
  ...mapActions(useOrdersStore, ['fetchOrders']),
},
async created() {
  await this.fetchOrders();
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


.statistics_search{
  width: 200px;
  height: 80px;
  //background-color: red;
  display: flex;
  justify-content:center;
  align-items: center;
  select {
      // margin-right: 400px;
      height: 40px;
      width: 135px;
      border-radius: 8px;
      height: 40px;
      width: 135px;
      text-transform: capitalize;
      color: white;
      background-color: var(--popularCalar);
      text-align: center;
      font: {
          size: 20px;
          weight:600;
      }
      cursor: pointer;
      border: none;
    }
  
  }

@media (max-width: 477px){
  .statistics_ressults{
     // background-color: #f9f7f7;
      background-color:hsl(0, 100%, 98%);
      
  }

  
}

</style>
