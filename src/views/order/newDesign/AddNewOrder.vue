<template>
  <v-container fluid class="p-22">
    <!-- Title -->
    <v-row style="height: 80px">
      <v-col cols="12">
        <p :class="{ 'dark-mode-title': getDarkMode }" class="p-order">
          create order
        </p>
      </v-col>
    </v-row>

    <ValidationObserver ref="observer" v-slot="{ invalid }">
      <v-form @submit.prevent="letHandelForBtns">
        <!-- Info-->
        <v-row>
          <v-col align-self="end" cols="12" md="6">
            <UserSelectionComponent
              @customer-updated="handleCustomerUpdate"
              @technical-updated="handleTechnicalUpdate"
            />
          </v-col>
          <v-col cols="12" md="6">
            <DataLocationSelectionComponent
              @location-updated="handleLocationUpdate"
              @date-updated="handleDateUpdate"
            />
          </v-col>
        </v-row>

        <!-- Shipping &&  Products && Details -->
        <v-row>
          <v-col cols="12" md="6">
            <ShippingAndType
              @shipping-updated="handleShippingUpdate"
              @shippingShape-updated="handleCustomShippingUpdate"
              @orderType-updated="handleTypeUpdate"
              @updateGroup-updated="handleGroup"
            />
            <ProductMangerWraper
              :addedOrders="addedOrders"
              @added-orders-updated="handleAddedOrdersUpdate"
              @updateFields="handleupdateFields"
            />
          </v-col>

          <v-col cols="12" md="6">
            <Details
              @details-updated="handleDetailsUpdate"
              :customerInfo="customerInfo"
            />
          </v-col>
        </v-row>

        <!-- Actions Buttons-->
        <v-row justify="center">
          <v-col cols="12" md="6">
            <FormActions
              :isInvalid="invalid"
              @create="creatNewOrder"
              @cancel="goBack"
            >
              <template v-slot:create-button>Add Order</template>
              <template v-slot:cancel-button>Cancel</template>
            </FormActions>
          </v-col>
        </v-row>
      </v-form>
    </ValidationObserver>

    <!-- Loading-->
    <CircleLoader :show="isLoading" />
  </v-container>
</template>

<script>
import { extend } from "vee-validate";
import { required, numeric, min_value } from "vee-validate/dist/rules";

// Register rules with custom messages

extend("required", {
  ...required,
  message: "{_field_} مطلوب",
});

extend("numeric", {
  ...numeric,
  message: "{_field_} يجب أن يكون رقمًا",
});

extend("min_value", {
  ...min_value,
  message: "{_field_} يجب أن يكون على الأقل {min}",
});

extend("date_format", {
  validate(value) {
    const regex = new RegExp("^\\d{4}-\\d{2}-\\d{2}$");
    return regex.test(value);
  },
  params: ["format"],
  message: "{_field_} يجب أن يكون بالتنسيق الصحيح {format}",
});

// actions , states
import { mapActions, mapState } from "pinia";

// components

// CircleLoader
import CircleLoader from "@/shared/components/loading/CircleLoader.vue";

import UserSelectionComponent from "@/components/orders/shared/UserSelectionComponent.vue";
import DataLocationSelectionComponent from "@/components/orders/shared/DataLocationSelectionComponent.vue";
import ShippingAndType from "@/components/orders/shared/ShippingAndType.vue";
import Details from "@/components/orders/shared/Details.vue";
import ProductMangerWraper from "@/components/orders/addOrder/productManger/ProductMangerWraper.vue";
import FormActions from "@/components/orders/shared/FormActions.vue";

//store
import { useOrdersStore } from "@/store/order/orders.js";
import { useBranchesStore } from "@/store/branches/branches.js";
import { useRandomTransactionsStore } from "@/store/transactions/randomTransactions.js";
import { useTransactionsStore } from "@/store/transactions/transactions.js";

// sweetalert
import sweetalert from "sweetalert";

// Helpers
import {
  calculateGrandTotal,
  calculateTotalInstallation,
} from "@/helpers/orderCalculations";

export default {
  name: "AddNewOrder",
  components: {
    UserSelectionComponent,
    DataLocationSelectionComponent,
    ShippingAndType,
    Details,
    ProductMangerWraper,
    FormActions,
    CircleLoader,
  },
  data() {
    return {
      // for all Fields added
      addedFields: [],

      // for all products added
      addedOrders: [],

      // rest of order data
      selectedCustomer: "",
      customerId: null,
      customerInfo: "",

      selectedTechnical: "",
      TechnicalId: null,
      TechnicaInfo: "",

      invoiceType: "تركيب وتوريد",
      date: "",
      adress: "",
      notes: "",
      status: "0", // حالة الطلب معلق
      number: "",
      laborPrice: "",
      shipping: "",
      customShipping: "",
      Group: "",

      file: null, // for add picture

      // loading
      isLoading: false,

      // is customInvoice
      customInvoice: false,

      displayTowInvoice: false,
      displaySale: true,
      displayInstallation: false,
      fixedInstallation: 0,

      // Auto Save Transaction clinte
      autoSaveTransactionType: "MoreThan",
      selectedOptionOnePlace: "",
    };
  },
  async created() {
    this.fetchBranches();
  },
  computed: {
    getDarkMode() {
      return this.$store.state.darkMode;
    },
    ...mapState(useBranchesStore, ["branches"]),
  },

  methods: {
    // ============ my actions => start =============================================

    ...mapActions(useOrdersStore, [
      "addOrder",
      "uploadImage",
      "generateOrderNumber",
      "updateOrder",
    ]),
    ...mapActions(useTransactionsStore, [
      "addSpecificTransaction",
      "fetchSpecificTransactions",
      "fetchSpecificTransactionById",
      "updateSpecificTransaction",
    ]),

    ...mapActions(useBranchesStore, ["fetchBranches", "updateBranch"]),
    ...mapActions(useRandomTransactionsStore, ["autoSaveTransactionOrder"]),
    calculateTotalCost(orderInfo) {
      return (
        Number(calculateGrandTotal(orderInfo, "true")) +
        Number(calculateTotalInstallation(orderInfo, "true"))
      );
    },
    // ============ my actions => end ==============================================

    handleCustomerUpdate({ customerId, customerInfo, selectedCustomer }) {
      this.customerId = customerId;
      this.customerInfo = customerInfo;
      this.selectedCustomer = selectedCustomer;
      console.log(
        "update selectedCustomer by emit event",
        this.selectedCustomer,
        this.customerInfo
      );
    },
    handleTechnicalUpdate({ TechnicalId, TechnicaInfo, selectedTechnical }) {
      this.TechnicalId = TechnicalId;
      this.TechnicaInfo = TechnicaInfo;
      this.selectedTechnical = selectedTechnical;
      console.log(
        "update selectedTechnical by emit event",
        this.selectedTechnical,
        this.TechnicaInfo,
        this.TechnicalId
      );
    },
    handleLocationUpdate(location) {
      this.adress = location;
      console.log("update location by emit event", this.adress);
    },
    handleDateUpdate(date) {
      this.date = date;
      console.log("update date by emit event", this.date);
    },
    handleShippingUpdate(shipping) {
      this.shipping = shipping;
      console.log("update shipping by emit event", this.shipping);
    },
    handleCustomShippingUpdate(customShipping) {
      this.customShipping = customShipping;
      console.log("update customShipping by emit event", this.customShipping);
    },
    handleTypeUpdate(invoiceType) {
      this.invoiceType = invoiceType;
      console.log("update invoiceType by emit event", this.invoiceType);
    },
    handleGroup(Group) {
      this.Group = Group;
      console.log("update invoiceType by emit event", this.Group);
    },
    handleAddedOrdersUpdate(addedOrders) {
      this.addedOrders = addedOrders;
      console.log("update addedOrders by emit event", this.addedOrders);
    },
    handleupdateFields(addedFields) {
      this.addedFields = addedFields;
      console.log("update addedFields by emit event", this.addedFields);
    },
    handleDetailsUpdate(details) {
      this.notes = details.notes || "";
      this.status = details.status || "0";
      this.number = details.number || "";
      this.laborPrice = details.laborPrice || "";
      this.file = details.file;
      this.displaySale = details.displaySale;
      this.displayTowInvoice = details.displayTowInvoice;
      this.displayInstallation = details.displayInstallation;
      this.fixedInstallation = details.fixedInstallation;
      this.autoSaveTransactionType = details.autoSaveTransactionType;
      this.selectedOptionOnePlace = details.selectedOptionOnePlace;
      console.log(details);
    },

    letHandelForBtns() {
      console.log("let handel to btns");
    },

    goBack() {
      this.$router.push("/dashboard/Order");
    },

    // ==================== عملية السحب من المخزن ====================
    async pullProductsFromDatabase() {
      for (const product of this.addedOrders) {
        if (
          product.pullStatus &&
          product.pullQuantityNeeded > 0 &&
          product.branchId
        ) {
          const branchId = product.branchId;
          const pullQuantity = Number(product.pullQuantityNeeded);

          // البحث عن الفرع في البيانات
          const branch = this.branches.find((branch) => branch.id === branchId);

          if (!branch) {
            sweetalert("خطأ", "الفرع المحدد غير موجود.", "error");
            continue;
          }

          const branchProduct = branch.products.find(
            (p) => p.id === product.id
          );

          if (!branchProduct) {
            sweetalert("خطأ", "المنتج غير موجود في الفرع المحدد.", "error");
            continue;
          }

          if (product.pullStatus === "less") {
            // الكمية أقل من المطلوب -> تفريغ المخزون بالكامل من المنتج
            branchProduct.quantity = 0; // أو القيمة المتاحة بالكامل
          } else if (product.pullStatus === "more") {
            // الكمية المتاحة كافية -> سحب الكمية المطلوبة فقط
            branchProduct.quantity -= pullQuantity;
          }

          // تحديث بيانات الفرع بعد التعديل
          await this.updateBranch(branch);

          // تعيين الخاصية isPulled لتكون true للإشارة إلى أن المنتج قد تم سحبه
          product.isPulled = true;
          console.log("to check isPulled", this.addedOrders);
        }
      }
    },

    // auto Save Transaction
    async autoTransaction(orderId, orderInfo) {
      console.log("enter auto transaction", orderId);

      //Check clinte selected First
      if (!this.customerId) {
        return null;
      }
      if (this.autoSaveTransactionType === "MoreThan") {
        const transaction = {
          userId: this.customerId, //
          role: this.customerInfo.role || "",
          amount: this.calculateTotalCost(orderInfo).toFixed(2),
          date: new Date().toISOString(),
          notes: ``,
          orderId: orderId,
          type: "Add",
          category: "orderRandom",
        };

        console.log(
          "before auto transaction",
          this.calculateTotalCost(orderInfo).toFixed(2)
        );
        const transactionId = await this.autoSaveTransactionOrder(
          transaction,
          this.customerId
        );
        console.log("after auto transaction");
        return {
          type: "MoreThan",
          transactionId,
          lastAmount: this.calculateTotalCost(orderInfo).toFixed(2),
        };
      }
      if (this.autoSaveTransactionType === "OnePlace") {
        if (this.selectedOptionOnePlace === "newTransaction") {
          // Case : New Transaction
          const newTransaction = {
            selectedType: "both",
            location: orderInfo.adress,
            orderLink: [orderId],
            date: new Date().toISOString(),
            note: "",
            status: "open",
            userId: this.customerId,
            typesData: [
              { type: "materials", totalAmount: 0, remainingValue: 0 },
              { type: "manufacturing", totalAmount: 0, remainingValue: 0 },
              {
                type: "both",
                totalAmount: this.calculateTotalCost(orderInfo),
                remainingValue: this.calculateTotalCost(orderInfo),
              },
            ],
            payments: [],
          };

          // Calc `remainingValue`
          // this.calculateRemainingValue(newTransaction.typesData, newTransaction.payments);

          console.log("Creating new OnePlace transaction:", newTransaction);
          const transactionId = await this.addSpecificTransaction(
            newTransaction
          );
          return {
            type: "OnePlace",
            transactionId,
            lastAmount: this.calculateTotalCost(orderInfo).toFixed(2),
          };
        } else {
          // Fetch Existing Transaction ID
          const transactionId = this.selectedOptionOnePlace.id;
          if (!transactionId) return null;

          console.log("Fetching existing OnePlace transaction:", transactionId);
          const existingTransaction = await this.fetchSpecificTransactionById(
            transactionId
          );

          if (!existingTransaction) {
            console.error("Transaction not found!");
            return null;
          }

          // Update Total
          existingTransaction.typesData.forEach((typeData) => {
            typeData.totalAmount += this.calculateTotalCost(orderInfo);
          });

          if (Array.isArray(existingTransaction.orderLink)) {
            existingTransaction.orderLink.push(orderId);
          }
          //  else {
          //   existingTransaction.orderLink = [existingTransaction.orderLink, orderId].filter(Boolean);
          // }

          // ReCalc`remainingValue`
          this.calculateRemainingValue(
            existingTransaction.typesData,
            existingTransaction.payments
          );

          console.log(
            "Updating existing OnePlace transaction:",
            existingTransaction
          );
          await this.updateSpecificTransaction({
            ...existingTransaction,
            userId: this.customerId,
            id: transactionId,
          });

          return {
            type: "OnePlace",
            transactionId,
            lastAmount: this.calculateTotalCost(orderInfo).toFixed(2),
          };
        }
      }

      return null;
    },
    calculateRemainingValue(typesData, payments) {
      //  `remainingValue`
      typesData.forEach((typeData) => {
        typeData.remainingValue = typeData.totalAmount;
      });

      // Cut Payments`remainingValue`
      payments.forEach((payment) => {
        const typeData = typesData.find(
          (type) => type.type === payment.paymentType
        );
        if (typeData) {
          typeData.remainingValue -= parseFloat(payment.amount || 0);
        }
      });

      console.log("Updated Types Data with Remaining Values:", typesData);
    },

    // ============ creat New oredr => start =====================================

    async creatNewOrder() {
      this.isLoading = true;

      try {
        if (this.addedOrders.length === 0) {
          sweetalert(
            "لا يمكن إنشاء الطلب بدون منتجات.",
            "يرجى إضافة منتجات قبل إنشاء الطلب.",
            "error"
          );
          this.isLoading = false;
          return;
        }

        let imageUrl = "";

        if (this.file) {
          imageUrl = await this.uploadImage({ file: this.file });
        }
        if (!this.number) {
          this.number = await this.generateOrderNumber();
        }

        // ==================== عملية السحب من المخزن ====================
        await this.pullProductsFromDatabase();
        console.log("after pullProductsFromDatabase", this.addedOrders);

        // تحقق من وجود تغييرات في الأسعار في المنتجات
        const hasCustomPrices = this.addedOrders.some(
          (product) => product.amountOfIncrease || product.editOfInstallation
        );
        const newOrder = {
          jokerFields: this.addedFields,
          products: this.addedOrders,
          customerName: this.selectedCustomer,
          customerId: this.customerId,
          customerInfo: this.customerInfo,
          technicalName: this.selectedTechnical,
          technicalId: this.TechnicalId,
          TechnicaInfo: this.TechnicaInfo,
          invoiceType: this.invoiceType,
          adress: this.adress,
          date: this.date,
          status: this.status,
          notes: this.notes,
          numberOfOrder: this.number,
          laborPrice: this.laborPrice,
          shipping: this.shipping,
          customShipping: this.customShipping,
          Group: this.Group,
          imageUrl,

          displaySale: this.displaySale,
          displayTowInvoice: this.displayTowInvoice,
          displayInstallation: this.displayInstallation,
          fixedInstallation: this.fixedInstallation,

          hasCustomInvoice: hasCustomPrices,
        };
        console.log("before send");
        console.log(this.shipping);

        const orderId = await this.addOrder(newOrder);

        // 🔴**AutoSave Transction**
        const transactionData = await this.autoTransaction(orderId, newOrder);
        if (transactionData) {
          console.log("transactionData", transactionData);
          await this.updateOrder({
            ...newOrder,
            id: orderId,
            transactionInfo: transactionData,
          });
        }

        console.log("after send");
        this.isLoading = false;

        sweetalert(
          "تم إنشاء الطلب بنجاح!",
          "سيتم إعادة توجيهك إلى صفحة الفاتورة.",
          "success"
        );
        this.$router.push({
          name: "Fatora",
          params: { orderId: orderId, isCustom: hasCustomPrices.toString() },
        });
      } catch (error) {
        console.error("Error creating order:", error);
        this.isLoading = false;
        sweetalert("خطأ في إنشاء الطلب", "يرجى المحاولة مرة أخرى.", "error");
      }
    },
    // ============ creat New oredr => end =======================================
  },
};
</script>
<style scoped lang="scss">
//   .view {
//     display: flex;
//     flex-wrap: wrap;
//     justify-content: space-evenly;
//     margin-bottom: 15px;
//     // background-color: aqua;
//     // background-color: white;
//     // overflow-x: hidden;
//   }

//   .title {
//     width: 100%;
//     height: 100px;
//     display: flex;
//     align-items: center;
//     justify-content: flex-start;
//     // background-color: red;
//     p {
//       text-transform: capitalize;
//       font-size: 22px;
//       font-weight: 600;
//       margin-left: 20px;
//     }
//   }
// .order-view-header{
//     width: 100%;
//     height: 200px;
//     // background-color: red;
//     display: flex;
//     flex-wrap: wrap;
//     align-items: center;
//     justify-content: space-evenly;

// }

// .order-view-main{
//     width: 100%;
//     min-height: 600px;
//     // background-color: rgb(146, 131, 131);
//     display: flex;
//     flex-wrap: wrap;
//     justify-content: space-evenly;

// }
// .main-cont{
//     //width: 45%;
//     width: 470px;
//     min-height: 700px !important;
//     // background-color: red;
//   }
//   .main-cont_shipping-products{
//     display: flex;
//     flex-direction: column;
//     justify-content: space-evenly;
//     // background-color: red;
// }

//   // phone
//   @media (max-width: 477px) {
//     .order-view-header{
//         height: 380px;
//     }
//     .main-cont{
//       max-width: 360px;

// }

//   }

//   // phone
//   @media (max-width: 370px){

//    }

//  phone
@media (max-width: 477px) {
  .p-22 {
    padding-left: 22px;
  }
}
.addd {
  background-color: red;
}
.adddd {
  background-color: sienna;
}
</style>
