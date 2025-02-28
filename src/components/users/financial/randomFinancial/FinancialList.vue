<template>
  <div class="financial-list">
    <!-- Head -->
    <div class="head">
      <slot name="title"></slot>
      <slot name="icon">
        <img src="https://via.placeholder.com/40" alt="User Image" />
      </slot>
    </div>

    <!-- Payments Section -->
    <div v-if="filteredData.length > 0" class="payments">
      <PaymentItem
        v-for="(payment) in filteredData"
        :key="payment.id"
        :data="payment"
      />
    </div>
    <NoData v-else context="transactions"></NoData>


    <!-- Footer -->
    <div class="footer">
      <div class="footer_total">
        <font-awesome-icon icon="wallet" class="total-icon" />
        <span class="total-label">Total {{ paymentType === 'Add' ? "Push" : "Pull" }}:</span>
        <span class="total-amount">{{ totalAmount }} EGP</span>
      </div>

      <div class="footer_btns">

        <!-- زر الصفحة التالية -->
        <button
          class="common-btn"
          :disabled="!addHasNextPage && paymentType === 'Add' || !pullHasNextPage && paymentType === 'Pull'"
          @click="paymentType === 'Add' ? fetchAddTransactions(5, 'next',profileId) : fetchPullTransactions(5, 'next',profileId)"
        >
          Next
          <font-awesome-icon icon="chevron-right" />
        </button>

        <!-- زر الصفحة السابقة -->
        <button
          class="common-btn"
          :disabled="!addHasPreviousPage && paymentType === 'Add' || !pullHasPreviousPage && paymentType === 'Pull'"
          @click="paymentType === 'Add' ? fetchAddTransactions(5, 'previous',profileId) : fetchPullTransactions(5, 'previous',profileId)"
        >
          <font-awesome-icon icon="chevron-left" />
          Previous
        </button>

        <!-- زر آخر عملية -->
        <button class="common-btn spicial-btn" @click="paymentType === 'add' ? fetchAddTransactions(5,null,profileId) : fetchPullTransactions(5,null,profileId)">
          <font-awesome-icon icon="clock" />
          Last Added
        </button>
      </div>

    </div>
  </div>
</template>

  
<script>
//  mapState و mapActions
import { mapState, mapActions } from "pinia"; 
// store
import { useRandomTransactionsStore } from '@/store/transactions/randomTransactions.js';
// components
  // PaymentItem
  import PaymentItem from "@/components/users/financial/randomFinancial/PaymentItem.vue";
  // NoData
  import NoData from "@/shared/components/noData/NoData.vue";

export default {
  name: "AddPayment",
  components: { 
    PaymentItem ,
    NoData,

  },
  props: {
    paymentType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      filteredData: [], // سيتم تخزين البيانات المفلترة هنا
      profileId:null,

    };
  },
  computed: {
    // استخدام mapState لربط الـ state بالـ store
    ...mapState(useRandomTransactionsStore, [
      // For Add
      "addTransactions",
      "addHasNextPage",
      "addHasPreviousPage",
      
      // For pull
      "pullTransactions",
      "pullHasNextPage",
      "pullHasPreviousPage",

      // for hidden
      "hidden",  



    ]),
    chosseRightData() {
     if (this.paymentType === 'Add') {
        return this.addTransactions;
      } else if (this.paymentType === 'Pull') {
        return this.pullTransactions;
      }
      return [];
    },
    totalAmount() {
      return this.filteredData.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);
    }
  },

  methods: {
    // استخدام mapActions لربط الـ actions
    ...mapActions(useRandomTransactionsStore, ["fetchAddTransactions","fetchPullTransactions"]),

       // تصفية البيانات بناءً على قيمة hidden
       filterData() {
      if (this.hidden === false) {
        this.filteredData = this.chosseRightData.filter(item => item.hidden === false || item.hidden === undefined  );
      } else {
        this.filteredData = this.chosseRightData;
      }
    }
  },
  watch: {
    // مراقبة التغيير في قيمة hidden وتحديث البيانات بناءً عليها
    hidden() {
      this.filterData();  // عندما تتغير قيمة hidden، نقوم بتصفية البيانات
    },
    chosseRightData() {
      this.filterData();  // إذا تغيرت البيانات في chosseRightData، نعيد تصفيتها بناءً على hidden
    },
    profileId() {
      this.filterData();  // إذا تغيرت البيانات في chosseRightData، نعيد تصفيتها بناءً على hidden
    }
  },

  mounted() {
    // جلب أول صفحة من البيانات عند تحميل المكون
    this.fetchAddTransactions(5, null, this.profileId);
    this.fetchPullTransactions(5, null, this.profileId);

    // تصفية البيانات بناءً على القيمة الأولية للـ hidden
    this.filterData();
  },
  async created() {
      this.profileId = this.$route.params.profileId;
    },
};
</script>

  <style scoped lang="scss">
  .financial-list {
    width: 100%;
    min-height: 400px;
    // box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

    background-color: #f8f9fa;
  
    .head {
      width: 100%;
      height: 60px;
      // background-color: #ffffff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border-bottom: 1px solid #ddd;
  
      h2 {
        font-size: 1.5rem;
        color: #333;
      }
  
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }
  
    .payments {
      width: 100%;
      min-height: 80px;
      padding: 15px;
      // background-color: #f0f0f0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  
    .footer {
      width: 100%;
      height: 90px;
      // background-color: #ffffff;
      border-top: 1px solid #ddd;
      display: flex;
      flex-wrap: wrap;
      .footer_total {
        // background-color: #7e1e36;
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 8px;
        // color: #fff;
        font-size: 1.2rem;
        font-weight: bold;
        border-bottom: 1px solid rgb(107, 104, 104);
        padding-left: 15px;
        .total-icon {
          font-size: 1.5rem;
          color: #007bff;
        }

        .total-label {
          font-weight: 600;
        }

        .total-amount {
          // color: #007bff;
        }
      }

      .footer_btns{
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        // background-color: #435447;
        padding-top: 10px;
        .spicial-btn {
          // background-color: #28a745;
    
          &:hover {
            // background-color: #1e7e34;
          }
      }
       
      }
    }
  }
  
  </style>
  