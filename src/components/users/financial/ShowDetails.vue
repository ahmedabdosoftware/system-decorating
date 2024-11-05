<template>
    <div>
        <div class="detailsContent">
          <div  class="detailsContent__title">
            <p>تفاصيل المعاملة: (رقم الطلب: {{ transactionInfo.numberOfOrder || 'غير محدد' }})</p>
        </div>
          <div class="detailsContent__Info">
            <div class="detailsContent__Info__date">
                <p>تاريخ المعاملة: {{ transactionInfo.date }}</p>
            </div>

            <div v-if="isClientTransaction && materialAccountAmount > 0 " class="detailsContent__Info__general">
              <p>المستحق  كخامات : {{ materialAccountAmount }}</p>
              <p>باقى  الخامات: {{ remainingMaterialAmount }}</p>
              
            </div>
            <div v-if="isClientTransaction && manufacturingAccountAmount >0 " class="detailsContent__Info__general">
              <p>المستحق  كمصنعية : {{ manufacturingAccountAmount }}</p>
              <p>باقى  المصنعية: {{ remainingManufacturingAmount }}</p>
            </div>
            <div v-if="isTechnicalTransaction && transactionInfo.DailyIndustrial" class="detailsContent__Info__general">    
              <p>عدد الأيام: {{ transactionInfo.numberOfDayes }}</p>
              <p>عدد الأيام المدفوعة: {{ transactionInfo.numberOfDayesPaid || 0 }}</p>
            </div>
            <div v-if="isTechnicalTransaction && transactionInfo.amount" class="detailsContent__Info__general">    
              <p>المستحق: {{ transactionInfo.amount }}</p>
              <p>الباقي: {{ remainingAmount }}</p>
            </div>
            <div v-if="isTechnicalTransaction && transactionInfo.DailyAssistantIndustrial" class="detailsContent__Info__general">
              <p>اسم المساعد   : {{ transactionInfo.nameOfAssistant  }}</p>
              <p>عدد الأيام للمساعد: {{ transactionInfo.numberOfDayesAssistant }}</p>
              <p> الأيام المدفوعة للمساعد: {{ transactionInfo.numberOfDayesPaidAssistant || 0 }}</p>
            </div>

           
            <div class="detailsContent__Info__general">
              <p>نوع المعاملة: {{ transactionInfo.transactionType }}</p>
              <p>الحالة: {{transactionInfo.status }}</p>
            </div>
          </div>
          <div v-if="transactionInfo.payments.length > 0" class="detailsContent__listProducts">
            <div>
              <p>:الدفعات</p>
            </div>
            <div>
            <table class="table">
              <thead>
                <tr>
                  <th>المبلغ</th>
                  <th>تاريخ الدفع</th>
                  <th v-if="transactionInfo.transactionType === 'عميل'">نوع المعامله </th>
                </tr>
              </thead>
              <tbody v-if="transactionInfo.payments">
                <tr v-for="(payment, index) in transactionInfo.payments" :key="index">
                  <td>{{ payment.amount }}</td>
                  <td>{{ payment.transactionDate }}</td>
                  <td v-if="transactionInfo.transactionType === 'عميل'">{{ payment.type == 'material' ? "خامات" : "مصنعيه"}}</td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
          <div class="detailsContent__note">
            <div class="detailsContent__note_title">
              <p>:الملاحظات</p>
            </div>
            <div class="detailsContent__note_cont">
              <p v-if="transactionInfo.notes">{{ transactionInfo.notes }}</p>
              <div v-else class="no-notes">
                <font-awesome-icon icon="sticky-note" size="4x" />
                <p>لا توجد ملاحظات</p>
              </div>
            </div>
          </div>
        </div>
        <div class="details__btns">
          <button @click.prevent="goBack">اغلاق</button>
        </div>

    </div>
</template>

<script>

export default {
  name: "DetailsTransaction",
  props: ["transactionInfo"],

  computed: {


    getDarkMode() {
      return this.$store.state.darkMode;
    },
    isClientTransaction() {
      return this.transactionInfo.transactionType === 'عميل';
    },
    isTechnicalTransaction() {
      return this.transactionInfo.transactionType === 'فنى';
    },
    // المستحق لحساب الخامات
    materialAccountAmount() {
      return parseFloat(this.transactionInfo.amount) || 0;
    },

    // المستحق لحساب المصنعية
    manufacturingAccountAmount() {
      return parseFloat(this.transactionInfo.manufacturingAmount) || 0;
    },

    // حساب الباقي لحساب الخامات بعد طرح الدفعات
    remainingMaterialAmount() {
      if (this.transactionInfo.payments) {
        const totalMaterialPayments = this.transactionInfo.payments
          .filter(payment => payment.type === 'material')
          .reduce((total, payment) => total + parseFloat(payment.amount), 0);
        return (this.materialAccountAmount - totalMaterialPayments).toFixed(2);
      }
      return null;
    },

    // حساب الباقي لحساب المصنعية بعد طرح الدفعات
    remainingManufacturingAmount() {
      if (this.transactionInfo.payments) {
        const totalManufacturingPayments = this.transactionInfo.payments
          .filter(payment => payment.type === 'industrial')
          .reduce((total, payment) => total + parseFloat(payment.amount), 0);
        return (this.manufacturingAccountAmount - totalManufacturingPayments).toFixed(2);
      }
      return null;
    },

    // حساب الباقي للمستحق في حالة المعاملة ليست يومية
    remainingAmount() {
      if (this.transactionInfo.amount && this.transactionInfo.payments) {
        const totalPayments = this.transactionInfo.payments.reduce((total, payment) => total + parseFloat(payment.amount), 0);
        return (parseFloat(this.transactionInfo.amount) - totalPayments).toFixed(2);
      }
      return null;
    }


  },
 
  methods: {

    print() {
      window.print();
    },
    goBack() {
      const layout = this.$route.meta.layout;
      const profileId = this.$route.params.profileId;
       if (layout === 'profileInDashboardLayout') {
        this.$router.push(`/dashboard/profile/${profileId}/financial`);
      } 
      else if (layout === 'profileOutDashboardLayout') {
        this.$router.push(`/profile/${profileId}/financial`);
      }
      else if (layout === 'DashboardLayout') {
        this.$router.push(`/dashboard/Order`);
      }
    }
  },
  data() {
    return {
   
    };
  }
};
</script>

<style scoped lang="scss">
</style>