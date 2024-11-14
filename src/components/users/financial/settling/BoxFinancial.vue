<template>
    <div class="contBox">
      <div :class=" { 'dark-mode': getDarkMode }">
        <span class="title">{{ Financial.adress }}</span>
       <div class="contBox__toggle">

          <div class="contBox__toggle__chosse" >
              <span v-if="isMaterialActiveOrTechnical">{{  Financial.transactionType ==="عميل" ? "خامات" :"فنى"  }}</span>
              <span v-else>{{  Financial.transactionType ==="عميل" ? "مصنعيه" :"مساعد"  }}</span>
          </div>

          <ToggleSwitch
              :isMaterialActiveOrTechnical="isMaterialActiveOrTechnical"
              @update:isMaterialActive="updateMaterialStatus"
          />     
        </div>
        <div class="contBox__data">
        <!-- حالة الفني أو المواد الخام -->
        <FinancialListPayments
            v-if="isMaterialActiveOrTechnical && Financial.payments.length > 0"
            :transactionInfo="Financial"
            :isMaterialActiveOrTechnical="isMaterialActiveOrTechnical"
        />

        <!-- حالة المصنعية عند العميل -->
        <FinancialListPayments
            v-if="!isMaterialActiveOrTechnical && isClient && Financial.payments.length > 0"
            :transactionInfo="Financial"
            :isMaterialActiveOrTechnical="isMaterialActiveOrTechnical"

        />

        <!-- عرض يومي للفني -->
        <FinancialDaily
            v-if="isMaterialActiveOrTechnical && Financial.DailyIndustrial"
            :transactionInfo="Financial"
            kind="Technical"
        />

        <!-- عرض يومي للمساعد -->
        <FinancialDaily
            v-if="!isMaterialActiveOrTechnical && Financial.DailyAssistantIndustrial"
            :transactionInfo="Financial"
            kind="Assistant"
        />
      </div>


      <div class="contBox__action">
        <ActionPayments
            v-if="(isTechnicalTransaction) ||
                  (isMaterialTransaction  && hasMaterialPayments) ||
                  (isManufacturingTransaction && hasManufacturingPayments)"
            :transactionInfo="Financial"
            :isMaterialActiveOrTechnical="isMaterialActiveOrTechnical"
        />
      </div>

      </div>
    </div>
  </template>
  
  <script>

// components
  // FinancialListPayments
  import FinancialListPayments from "@/components/users/financial/settling/payments/FinancialListPayments.vue";
  //FinancialDaily
  import FinancialDaily from "@/components/users/financial/settling/daily/FinancialDaily.vue";
  //ActionPayments
  import ActionPayments from "@/components/users/financial/settling/payments/ActionPayments.vue";
  // ToggleSwitch
  import ToggleSwitch from './ToggleSwitch.vue';

  export default {
    name: "BoxFinancial",
    props: [ "Financial"],
    components: {
        ToggleSwitch,
        FinancialListPayments,
        ActionPayments,
        FinancialDaily,
   },
    computed: {
      getDarkMode() {
        return this.$store.state.darkMode;
      },
        // تحقق من حالة العميل
      isClient() {
        return this.Financial.transactionType === "عميل";
      },
      // تحقق من حالة الفني
      isTechnical() {
        return this.Financial.transactionType === "فنى";
      },

      isTechnicalTransaction() {
        return this.Financial.transactionType === "فنى" && this.isMaterialActiveOrTechnical && this.Financial.payments.length > 0;
      },
      isMaterialTransaction() {
        return this.Financial.transactionType === "عميل" && this.isMaterialActiveOrTechnical;
      },
      isManufacturingTransaction() {
        return this.Financial.transactionType === "عميل" && !this.isMaterialActiveOrTechnical;
      },
      hasMaterialPayments() {
        return this.Financial.payments.some(payment => payment.type === "material");
      },
      hasManufacturingPayments() {
        return this.Financial.payments.some(payment => payment.type === "industrial");
      },



    },
    created(){
      // console.log(this.category)
  
    },
    
    data() {
    return {
        isMaterialActiveOrTechnical: true, 
    };
   },

   methods: {
    updateMaterialStatus(status) {
      this.isMaterialActiveOrTechnical = status; 
    },
  },

  };
  //  console.log(pro)
  </script>
  <style scoped lang="scss">
  

  .contBox {
    width: 300px;
    min-height: 380px;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  /* cont one product */
  .contBox > div {
    width: 100%;
    height: 100%;
    background-color: white;
    margin-left: 15px;
    box-shadow: 0 0 5px rgb(210, 205, 205);
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    /* background-color: red; */
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    position: relative;
  }
  // sass
  %center_flex{
    display: flex;
    align-items: center;
    justify-content: center;
  }
 
  .title{
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgb(241, 240, 237);
    width: 80px;
    height: 30px;
    border-radius: 7px;
    @extend %center_flex;
    font-size: 13px
  }
  
  .contBox__data{
    width: 100%;
    height: 160px;
    // background-color: rgb(108, 91, 91);
  }
  .contBox__action{
    width: 90%;
    min-height: 150px;
    //  background-color: rgb(139, 61, 61);
  }
  .spichial-cont-btns{
    display: flex;
    justify-content: space-evenly;
  }
  .spichialAdd-btn{
    width: 100px;

  }
  </style>
  