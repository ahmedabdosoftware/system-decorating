<template>
  <div>
    <div class="fatoora">
      <div class="fatoora__header">
        <div>
          <img
            class="invoiceLogo"
            :src="require('@/assets/images/invoice/logo.jpg')"
          />
        </div>
        <div>
          <button>بيان اسعار</button>
          <span> {{ orderInfo.numberOfOrder }} :رقم</span>
        </div>
        <div>
          <p class="categories">بانوهات كرانيش اسقف معلقة بديل خشب بديل رخام</p>
        </div>
      </div>
      <div class="fatoora__title">
        <div>
          <p v-if="orderInfo">
            نوع الفاتورة :
            {{ orderInfo.invoiceType }}
          </p>
          <p v-if="orderInfo && orderInfo.adress">
            العنوان:
            {{ orderInfo.adress }}
          </p>
        </div>
        <div>
          <p v-if="orderInfo && orderInfo.date">
            {{ orderInfo.date }}
            : تحرير فى
          </p>
          <p v-if="orderInfo && !orderInfo.date">تحرير فى : غير محدد</p>

          <p v-if="orderInfo">
            اسم العميل :
            {{ orderInfo.customerName || "غير محدد" }}
          </p>
        </div>
      </div>
      <div class="fatoora__table">
        <table class="table">
          <!-- Header -->
          <thead>
            <tr>
              <th>اجمالى</th>
              <th v-if="shouldDisplayDiscount">قيمة الخصم</th>
              <th>الكمية</th>
              <th v-if="orderInfo.invoiceType !== 'تركيب'">سعر الوحده</th>
              <th>كود المنتج</th>
              <th>اسم الصنف</th>
            </tr>
          </thead>
          <!-- Products -->
          <tbody v-if="orderInfo">
            <tr v-for="(product, index) in orderInfo.products" :key="index">
              <td>{{ calculateTotalPrice(product) }}</td>
              <td v-if="shouldDisplayDiscount">
                {{ calculateDiscount(product) }}
              </td>
              <td>{{ product.quantity }}</td>
              <td v-if="orderInfo.invoiceType !== 'تركيب'">
                {{
                  product.priceWithIncrease && isCustomized === "true"
                    ? product.priceWithIncrease
                    : product.productInfo.priceMaterial
                }}
              </td>
              <td>{{ product.productInfo.name }}</td>
              <td>{{ categoryName(product) }}</td>
            </tr>
            <!-- Joker Fields -->
            <tr
              v-for="(joker, index) in orderInfo.jokerFields"
              :key="'joker-' + index"
            >
              <td>{{ calculateJokerTotal(joker) }}</td>
              <td v-if="shouldDisplayDiscount">---</td>
              <td>{{ joker.quantity || "---" }}</td>
              <td>{{ joker.value || "---" }}</td>
              <td>{{ joker.name || "---" }}</td>
              <td>{{ joker.category || "---" }}</td>
            </tr>
            <!-- installition -->
            <!-- Not Fixed -->
            <tr
              v-for="(product, index) in filteredProductsForInstallation"
              :key="'installation-' + index"
            >
              <td>
                {{
                  (product.editOfInstallation && isCustomized === "true"
                    ? product.editOfInstallation
                    : product.productInfo.priceWithLabor) * product.quantity
                }}
              </td>
              <td v-if="shouldDisplayDiscount">0</td>
              <td>{{ product.quantity }}</td>
              <td>
                {{
                  product.editOfInstallation && isCustomized === "true"
                    ? product.editOfInstallation
                    : product.productInfo.priceWithLabor
                }}
              </td>
              <td>{{ product.productInfo.name }}</td>
              <td>المصنعية</td>
            </tr>

            <!-- Fixed -->
            <tr
              v-if="
                shouldDisplayInstallation && orderInfo.fixedInstallation > 0
              "
            >
              <td>{{ calculateTotalInstallation }}</td>
              <td v-if="shouldDisplayDiscount">0</td>
              <td>{{ calculateTotalQuantity }}</td>
              <td>{{ orderInfo.fixedInstallation }}</td>
              <td colspan="2">المصنعية</td>
            </tr>
            <!-- shipping -->
            <tr v-if="orderInfo.shipping">
              <td colspan="3">
                {{
                  orderInfo.customShipping
                    ? orderInfo.customShipping
                    : orderInfo.shipping
                }}
              </td>
              <td colspan="4">شحن </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Total -->
      <div class="fatoora__sales">
        <p v-if="shouldDisplayDiscount">
          اجمالى الخصم: <span>{{ calculateTotalDiscount }}</span>
        </p>
        <p
          v-if="
            orderInfo.invoiceType === 'تركيب وتوريد' ||
            orderInfo.invoiceType === 'توريد'
          "
        >
          اجمالى خامات : <span>{{ calculateGrandTotal }}</span>
        </p>
        <p
          v-if="
            orderInfo.invoiceType === 'تركيب وتوريد' ||
            orderInfo.invoiceType === 'تركيب'
          "
        >
          اجمالى مصنعية: <span>{{ calculateTotalInstallation }}</span>
        </p>
        <p v-if="orderInfo.invoiceType === 'تركيب وتوريد'">
          الكلى:
          <span>{{
            (
              Number(calculateGrandTotal) + Number(calculateTotalInstallation)
            ).toFixed(2)
          }}</span>
        </p>
      </div>
      <div class="fatoora__notes">
        <p>
          البضاعة المباعة لا ترد ولا تستبدل الا فى خلال 14 يوم كحد اقصى من تاريخ
          الفاتورة
        </p>
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
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useCategoriesStore } from "@/store/categories/categories.js";

import QRCode from "qrcode";
import { nextTick } from "vue";

export default {
  name: "ShowFatoora",
  components: {},
  props: {
    orderInfo: {
      type: Object,
      required: true,
    },
    isCustomized: {
      type: String,
      required: true,
    },
  },
  computed: {
    getDarkMode() {
      return this.$store.state.darkMode;
    },
    ...mapState(useCategoriesStore, ["categories"]),
    filteredProductsForInstallation() {
      if (!this.orderInfo || !this.orderInfo.products) return [];
      return this.orderInfo.products.filter(
        (product) =>
          this.shouldDisplayInstallation &&
          this.orderInfo.fixedInstallation == 0 &&
          product.productInfo.priceWithLabor
      );
    },

    shouldDisplayDiscount() {
      // لو كان مخصصًا، تحقق من وجود displaySale في orderInfo
      // if (this.isCustomized ==="true" && this.orderInfo.displaySale) {

      //   return true;
      // }

      // that changing in logic (like u see i commented codes) bc i changed the meaning of Customized
      // it became mean just changing in price of products or installtion but option display Sale not related to customiz invoice
      if (this.orderInfo.displaySale) {
        return true;
      }

      // إذا لم يكن مخصصًا، اعرض الخصم أيضًا
      // if (this.isCustomized ==="false") {
      //   return true;
      // }

      // في أي حالة أخرى، لا تعرض الخصم
      return false;
    },
    shouldDisplayInstallation() {
      // لو كان مخصصًا، تحقق من وجود displayInstallation في orderInfo
      // if (this.isCustomized ==="true" && this.orderInfo.displayInstallation) {

      //   return true;
      // }

      // that changing in logic (like u see i commented codes) bc i changed the meaning of Customized
      // it became mean just changing in price of products or installtion but option display Installation not related to customiz invoice
      if (this.orderInfo.displayInstallation) {
        return true;
      }

      // إذا لم يكن مخصصًا، لا تعرض المصنعية فى الحدول
      // if (this.isCustomized ==="false") {
      //   return false;
      // }

      // في أي حالة أخرى، لا تعرض المصنعية فى الجدول
      return false;
    },
    // حساب إجمالي الخصومات
    calculateTotalDiscount() {
      const totalDiscount = this.orderInfo.products.reduce((total, product) => {
        const productPrice =
          product.priceWithIncrease && this.isCustomized === "true"
            ? product.priceWithIncrease
            : product.productInfo.priceMaterial;
        const productTotalPrice = productPrice * product.quantity;

        const discountAmount = productTotalPrice * (product.price_offer / 100);

        return total + discountAmount;
      }, 0);
      return totalDiscount.toFixed(2);
    },

    // calculate Total Matrials ( Normal Producrs + Joker Fields)
    calculateGrandTotal() {
      // حساب الإجمالي الكلي بعد الخصومات (anchient)
      // const grandTotal = this.orderInfo.products.reduce((total, product) => {

      //   const productPrice = product.priceWithIncrease && this.isCustomized ==="true" ? product.priceWithIncrease : product.productInfo.priceMaterial;
      //   const productTotalPrice = productPrice * product.quantity;

      //   const discountAmount = productTotalPrice * (product.price_offer / 100);
      //   return total + (productTotalPrice - discountAmount);
      // }, 0);

      // const shippingCost = Number(this.orderInfo.shipping) || 0;

      // return (grandTotal+shippingCost).toFixed(2);

      let totalMaterials = 0;

      // calculate Total Matrials From Normal Producrs
      if (this.orderInfo.products) {
        totalMaterials += this.orderInfo.products.reduce((total, product) => {
          const productPrice =
            product.priceWithIncrease && this.isCustomized === "true"
              ? product.priceWithIncrease
              : product.productInfo.priceMaterial;
          const productTotalPrice = productPrice * product.quantity;
          const discountAmount =
            productTotalPrice * (product.price_offer / 100);
          return total + (productTotalPrice - discountAmount);
        }, 0);
      }

      // calculate Total Matrials From Joker Fields
      if (this.orderInfo.jokerFields) {
        totalMaterials += this.orderInfo.jokerFields.reduce((total, joker) => {
          if (joker.willBeCalculated && joker.calculationType === "material") {
            if (joker.value && joker.quantity) {
              return total + joker.value * joker.quantity;
            } else if (joker.value) {
              return total + joker.value;
            }
          }
          return total;
        }, 0);
      }

      // calculate shipping Cost
      const shippingCost = Number(this.orderInfo.shipping) || 0;

      return (totalMaterials + shippingCost).toFixed(2);
    },
    // حساب إجمالي الكميات فقط
    calculateTotalQuantity() {
      const totalQuantity = this.orderInfo.products.reduce((total, product) => {
        if (product.productInfo.priceWithLabor) {
          return total + Number(product.quantity);
        } else {
          return total;
        }
      }, 0);

      return totalQuantity;
    },
    // حساب إجمالي التركيبات (منتجات + حقول Joker)
    calculateTotalInstallationWithJoker() {
      let totalInstallation = 0;

      // حساب إجمالي التركيبات من المنتجات العادية
      if (this.orderInfo.products) {
        console.log("enter this.orderInfo.products");
        totalInstallation += this.orderInfo.products.reduce(
          (total, product) => {
            let productInstallationPrice = 0;

            if (
              this.isCustomized === "true" &&
              product.editOfInstallation &&
              Number(product.editOfInstallation) > 0
            ) {
              productInstallationPrice =
                product.editOfInstallation * product.quantity;
            } else if (product.productInfo.priceWithLabor) {
              productInstallationPrice =
                product.productInfo.priceWithLabor * product.quantity;
            }

            return total + productInstallationPrice;
          },
          0
        );
      }

      // حساب إجمالي التركيبات من حقول Joker
      if (this.orderInfo.jokerFields) {
        console.log("enter this.orderInfo.jokerFields");
        totalInstallation += this.orderInfo.jokerFields.reduce(
          (total, joker) => {
            if (
              joker.willBeCalculated &&
              joker.calculationType === "installation"
            ) {
              if (joker.value && joker.quantity) {
                return total + joker.value * joker.quantity;
              } else if (joker.value) {
                return total + joker.value;
              }
            }
            return total;
          },
          0
        );
      }

      return totalInstallation.toFixed(2);
    },
    // حساب اجمالي التركيب
    calculateTotalInstallation() {
      // (anchient)
      //   if (this.orderInfo.laborPrice) {

      //     return this.orderInfo.laborPrice;

      //   }else{

      //     const totalInstallation = this.orderInfo.products.reduce((total, product) => {
      //       let productInstallationPrice;

      //       // إذا كان هناك تعديل مخصص لسعر المصنعية (editOfInstallation) والفاتورة مخصصة
      //     if (this.isCustomized === "true" && product.editOfInstallation && Number(product.editOfInstallation) > 0) {
      //       productInstallationPrice = product.editOfInstallation * product.quantity;
      //     } else if (product.productInfo.priceWithLabor) {
      //       // إذا لم يكن هناك تعديل مخصص، استخدم السعر الافتراضي للمصنعية
      //       productInstallationPrice = product.productInfo.priceWithLabor * product.quantity;
      //     } else {
      //       // في حال عدم وجود سعر للمصنعية، إرجاع الإجمالي بدون تغيير
      //       console.log('no labor for that:', product);
      //       return total;
      //     }

      //     return total + productInstallationPrice;
      //   }, 0);

      //   return totalInstallation.toFixed(2);
      // }

      if (this.orderInfo.laborPrice) {
        return this.orderInfo.laborPrice;
      } else {
        return this.calculateTotalInstallationWithJoker;
      }
    },
  },
  async created() {
    console.log("inside componnent:", this.isCustomized);
    console.log("inside componnent:", this.orderInfo);
    this.fetchCategories();
    try {
      await nextTick(); // انتظر حتى يتم تحميل الـ DOM
      this.generateQRCode();
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  },

  methods: {
    ...mapActions(useCategoriesStore, ["fetchCategories"]),

    calculateTotalPrice(product) {
      if (this.orderInfo.invoiceType !== "تركيب") {
        const productPrice =
          product.priceWithIncrease && this.isCustomized === "true"
            ? product.priceWithIncrease
            : product.productInfo.priceMaterial;
        const productTotalPrice = productPrice * product.quantity;
        const discountAmount = productTotalPrice * (product.price_offer / 100);

        return (productTotalPrice - discountAmount).toFixed(2);
      } else {
        return "-------";
      }
    },

    calculateDiscount(product) {
      const productPrice =
        product.priceWithIncrease && this.isCustomized === "true"
          ? product.priceWithIncrease
          : product.productInfo.priceMaterial;
      const productTotalPrice = productPrice * product.quantity;
      const discountAmount = productTotalPrice * (product.price_offer / 100);

      return discountAmount.toFixed(2);
    },

    calculateJokerTotal(joker) {
      // if (!joker.willBeCalculated) {
      //   return '---';
      // }

      if (joker.value && joker.quantity) {
        return (joker.value * joker.quantity).toFixed(2);
      } else if (joker.value) {
        return joker.value;
      } else {
        return "---";
      }
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
    async generateQRCode() {
      try {
        const qrCodeData =
          "https://ahmedabdosoftware.github.io/websiteUpdated-DSD/";
        const qrCanvas = document.getElementById("qr-code");
        await QRCode.toCanvas(qrCanvas, qrCodeData);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    },
    goBack() {
      const layout = this.$route.meta.layout;
      if (layout === "DashboardLayout") {
        this.$router.push("/dashboard/Order");
      } else if (layout === "profileInDashboardLayout") {
        const profileId = this.$route.params.profileId;
        this.$router.push(`/dashboard/profile/${profileId}`);
      } else if (layout === "profileOutDashboardLayout") {
        const profileId = this.$route.params.profileId;
        this.$router.push(`/profile/${profileId}`);
      }
    },
  },
  data() {
    return {};
  },
};
</script>
<style scoped lang="scss">
// **fatora section** => start

//varibles

$buttom_fatoora_background: rgb(235, 229, 229);
$buttom_font_fatoora: 22px;
$font_weight_fatoora: 700;
$border_fatoora: 2px solid rgb(71, 71, 71);
$buttom_color_fattora: black;
$buttom_font: 19px;

//reset => normalize
* {
  margin: 0px;
}

//extends

%btn-style {
  text-align: center;
  font-size: $buttom_font;
  border-radius: 5px;
  border: none;
  font-weight: 500;
  background-color: $buttom_color_fattora;
  color: white;
  cursor: pointer;
}

%use_flex {
  display: flex;
  flex-wrap: wrap;
}
%center_flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
%btn-style_fatoora {
  text-align: center;
  font-size: $buttom_font_fatoora;
  border-radius: 5px;
  border: none;
  font-weight: 700;
  background-color: $buttom_fatoora_background;
  color: block;
  cursor: pointer;
}

%font {
  font: {
    size: 19px;
    weight: 600;
  }
}

//start your style

.fatoora {
  @extend %use_flex;
  justify-content: center;
  width: 60%;
  min-height: 100vh;
  //background-color: red;
  margin: auto;
  margin-top: 32px;
  border: $border_fatoora;
  border-radius: 5px;
}

.fatoora__header {
  @extend %use_flex;
  justify-content: space-evenly;
  width: 100%;
  height: 250px;
  //background-color: rgb(153, 141, 141);

  > div {
    width: 30%;
    height: 100%;
    // background-color: antiquewhite;
  }
  > div:first-child {
    .invoiceLogo {
      width: 90px;
      height: 90px;
      margin-top: 20px;
      border-radius: 45px;
    }
  }
  > div:nth-child(3) {
    @extend %use_flex;
    justify-content: end;
    align-content: space-evenly;
    .logoFatora {
      font-size: 40px;
      color: rgb(110, 108, 105);
      text-align: end;

      span {
        font-family: Arial, Helvetica, sans-serif;
        color: black;
      }
    }
    .categories {
      color: rgb(110, 108, 105);
      font-size: 30px;
      text-align: end;
    }
  }
  > div:nth-child(2) {
    @extend %use_flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;

    button {
      @extend %btn-style_fatoora;
      width: 60%;
      height: 50px;
      margin-bottom: 15px;
      border: $border_fatoora;
    }
    span {
      width: 100px;
      height: 40px;
      line-height: 40px;
      @extend %font;

      //background-color:$buttom_fatoora_background;
    }
  }
}

.fatoora__title {
  width: 95%;
  height: 130px;
  border: $border_fatoora;
  @extend %use_flex;
  justify-content: space-evenly;
  > div {
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

.fatoora__table {
  width: 95%;
  min-height: 70px;
  // background-color: rgb(172, 42, 42);
  .table {
    width: 100%;
    height: 100%;
    // background-color: salmon;
    tr {
      height: 30px;
      td,
      th {
        border: $border_fatoora;
        text-align: center;
        //background-color: sandybrown;
      }
    }
  }
}
.fatoora__sales {
  width: 95%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding-left: 20px;
  margin-top: 14px;
  p {
    //width: 280px;
    text-align: start;
    @extend %font;
    margin-top: 16px;

    span {
      border: 2px solid black;
      padding: 4px;
    }
  }
}
.fatoora__notes {
  width: 95%;
  height: 100px;
  margin-top: 14px;

  //background-color: rgb(33, 108, 170);

  @extend %font;

  > p:nth-child(2) {
    background-color: bisque;
    padding: 4px;
    display: inline-block;
  }
}
.qrcode_cont {
  width: 100%;
  height: 120px;
  @extend %center_flex;
  margin: 30px 0px;
}

.fatoora__btns {
  @extend %center_flex;
  width: 100%;
  height: 120px;
  //background-color: rgb(173, 62, 173);

  button {
    margin-bottom: 15px;
    width: 60%;
    height: 50px;
    border: $border_fatoora;
    @extend %btn-style_fatoora;
  }
}
// ipad
@media (max-width: 821px) {
  //fatoora
  .fatoora {
    width: 86%;
  }
}
// phone 450px
@media (max-width: 450px) {
  //fatoora
  .fatoora {
    width: 97%;
  }

  //fatoora__header
  .fatoora__header {
    > div:nth-child(2) {
      button {
        width: 90%;
      }
    }
  }

  //fatoora__title
  .fatoora__title {
    padding: 6px;
    > div:nth-child(2) {
      width: 60%;
    }
  }
  .categories {
    font: {
      size: 18px !important;
      weight: 500;
    }
  }
}
// phone 366px
@media (max-width: 366px) {
  .fatoora__header {
    > div:nth-child(3) {
      .logoFatora {
        font-size: 20px;
      }
      .categories {
        font-size: 17px;
      }
    }
  }

  .fatoora__title {
    > div {
      p {
        font-size: 17px;
      }
    }
  }
}
@media print {
  .fatoora {
    width: 550px;
  }
  .fatoora__btns {
    display: none;
  }

  .fatoora__header {
    > div:nth-child(3) {
      .logoFatora {
        font-size: 20px;
      }
      .categories {
        font-size: 17px;
      }
    }
  }

  .fatoora__title {
    > div {
      p {
        font-size: 17px;
      }
    }
  }
}
// **fatora section** => end
</style>
