<template>
  <div>
    <div v-if="returns" class="detailsContent">
      <div class="detailsContent__Info">
        <div class="detailsContent__Info__date">
          <p>تاريخ الشراء: {{ purchaseInfo.date }}</p>
        </div>

        <div class="detailsContent__Info__general">
          <p>اسم الفرع: {{ purchaseInfo.selectedBranch }}</p>
          <p>العنوان/ اسم المورد: {{ purchaseInfo.adress || "غير محدد" }}</p>
          <p>الحالة: {{ getStatusText(purchaseInfo.status) }}</p>
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
                <th>الكمية</th>
                <th>سعر الشراء</th>
                <th>كود الصنف</th>
                <th>اسم الصنف</th>
              </tr>
            </thead>
            <tbody v-if="purchaseInfo.products">
              <tr
                v-for="(product, index) in purchaseInfo.products"
                :key="index"
              >
                <td>{{ calculateTotalPrice(product) }}</td>
                <td>{{ product.quantity }}</td>
                <td>{{ product.price_buy }}</td>
                <td>{{ product.name }}</td>
                <td>{{ categoryName(product) }}</td>
              </tr>
              <tr v-if="purchaseInfo.shipping">
                <td colspan="3">{{ purchaseInfo.shipping }}</td>
                <td colspan="3">الشحن</td>
              </tr>
              <tr>
                <td colspan="3">{{ calculateTotalPriceForAll }}</td>
                <td colspan="3">اجمالى قبل الخصم</td>
              </tr>
              <tr>
                <td colspan="3">{{ calculateDiscount }}</td>
                <td colspan="3">اجمالى الخصم</td>
              </tr>
              <tr>
                <td colspan="3">{{ calculateGrandTotal }}</td>
                <td colspan="3">الاجمالى</td>
              </tr>
              <tr v-if="calculateTotalReturns > 0">
                <td colspan="3">{{ calculateTotalReturns }}</td>
                <td colspan="3">اجمالي المرتجعات</td>
              </tr>
              <tr v-if="calculateNetTotal > 0">
                <td colspan="3">{{ calculateNetTotal }}</td>
                <td colspan="3">قيمة المستحق</td>
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
          <p v-if="purchaseInfo.notes">{{ purchaseInfo.notes }}</p>
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
import { mapState, mapActions } from "pinia";
import { useCategoriesStore } from "@/store/categories/categories.js";
import { useReturnsStore } from "@/store/purchaseReturns/returns.js";

export default {
  name: "ShowDetails",
  components: {},
  props: ["purchaseInfo"],

  computed: {
    getDarkMode() {
      return this.$store.state.darkMode;
    },
    ...mapState(useCategoriesStore, ["categories"]),
    ...mapState(useReturnsStore, ["returns"]),
    // New
    // حساب إجمالي المرتجعات مع الخصومات
    calculateTotalReturns() {
      if (!this.returns || this.returns.length === 0) {
        return "0.00";
      }

      let totalReturns = 0;

      // حساب إجمالي المرتجعات مع الخصومات
      this.returns.forEach((ret) => {
        ret.products.forEach((product) => {
          if (
            product &&
            typeof product.price_buy !== "undefined" &&
            typeof product.quantityReturn !== "undefined"
          ) {
            const productTotalPrice =
              product.price_buy * product.quantityReturn;

            // التحقق من وجود الخصائص الجديدة
            const hasDiscount =
              typeof product.valueDiscountOnBuy !== "undefined" &&
              typeof product.kindDiscount !== "undefined";

            if (hasDiscount) {
              if (product.kindDiscount === "percentage") {
                // خصم بالنسبة المئوية
                const discount =
                  productTotalPrice *
                  (Number(product.valueDiscountOnBuy) / 100);
                console.log(
                  "value return ",
                  product.name,
                  product.quantityReturn,
                  productTotalPrice - discount
                );
                totalReturns += productTotalPrice - discount;
              } else if (product.kindDiscount === "fixed") {
                // خصم بقيمة ثابتة
                const discount =
                  Number(product.valueDiscountOnBuy) *
                  Number(product.quantityReturn);
                console.log(
                  "value return ",
                  product.name,
                  product.quantityReturn,
                  productTotalPrice - discount
                );
                totalReturns += productTotalPrice - discount;
              } else {
                // إذا كان الخصم غير معروف أو غير محدد
                totalReturns += productTotalPrice;
              }
            } else {
              // إذا كانت الخصائص غير موجودة (منتج قديم)
              totalReturns += productTotalPrice;
            }
          }
        });
      });

      return totalReturns.toFixed(2);
    },

    ///////////////

    // حساب قيمة المستحق (إجمالي المشتريات ناقص إجمالي المرتجعات)

    calculateNetTotal() {
      const totalPurchases = this.calculateGrandTotal;
      const totalReturns = this.calculateTotalReturns;
      return (totalPurchases - totalReturns).toFixed(2);
    },

    // حساب إجمالي قبل الخصم
    calculateTotalPriceForAll() {
      const total = this.purchaseInfo.products.reduce((total, product) => {
        // فحص أن البيانات متاحة وصحيحة قبل الحساب
        if (
          product &&
          typeof product.price_buy !== "undefined" &&
          typeof product.quantity !== "undefined"
        ) {
          const productTotalPrice = product.price_buy * product.quantity;
          return total + productTotalPrice;
        }
        return total;
      }, 0);
      return total.toFixed(2);
    },

    // حساب إجمالي الخصومات لكل منتج
    calculateDiscount() {
      let discountAmount = 0;

      this.purchaseInfo.products.forEach((product) => {
        // التحقق من أن المنتج يحتوي على الخصائص المطلوبة
        if (
          product &&
          typeof product.price_buy !== "undefined" &&
          typeof product.quantity !== "undefined"
        ) {
          const productTotalPrice = product.price_buy * product.quantity;
          console.log(product.name, product);
          const hasDiscount =
            typeof product.valueDiscountOnBuy !== "undefined" &&
            typeof product.kindDiscount !== "undefined";
          console.log("has?", hasDiscount);
          if (hasDiscount) {
            if (product.kindDiscount === "percentage") {
              discountAmount +=
                productTotalPrice * (Number(product.valueDiscountOnBuy) / 100);
            } else if (product.kindDiscount === "fixed") {
              discountAmount +=
                Number(product.valueDiscountOnBuy) * Number(product.quantity);
            }
          }
        }
      });

      return discountAmount.toFixed(2);
    },

    // حساب الإجمالي الكلي بعد الخصومات
    calculateGrandTotal() {
      const total = this.calculateTotalPriceForAll;
      const discount = this.calculateDiscount;
      const grandTotal = total - discount;
      const shippingCost = Number(this.purchaseInfo.shipping) || 0;
      return (grandTotal + shippingCost).toFixed(2);
    },
  },
  async created() {
    this.fetchCategories();
    this.fetchReturns();
  },

  methods: {
    ...mapActions(useCategoriesStore, ["fetchCategories"]),
    ...mapActions(useReturnsStore, ["fetchReturnsByPurchaseId"]),

    async fetchReturns() {
      if (this.purchaseInfo.id) {
        await this.fetchReturnsByPurchaseId(this.purchaseInfo.id);
      }
    },

    calculateTotalPrice(product) {
      if (
        !product ||
        typeof product.price_buy === "undefined" ||
        typeof product.quantity === "undefined"
      ) {
        return 0; // إذا كانت الخاصية غير موجودة، أعد قيمة 0
      }

      const productTotalPrice = product.price_buy * product.quantity;
      return productTotalPrice.toFixed(2);
    },

    categoryName(product) {
      const categoryProductName = this.categories.find(
        (category) => category.id === product.productInfo.categoryId
      );
      console.log(categoryProductName);
      if (categoryProductName) {
        return categoryProductName.name;
      }
    },

    goBack() {
      this.$router.push({ name: "Purchases" });
    },
    getStatusText(status) {
      switch (status) {
        case "0":
          return "مدفوع";
        case "1":
          return "اجل";
        default:
          return "غير معروف";
      }
    },
  },
  data() {
    return {};
  },
};
</script>
<style scoped lang="scss">
// global style in path =>  src/scss/global/_globalStyle.scss
</style>
