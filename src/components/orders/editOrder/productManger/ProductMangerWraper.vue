<template>
  <div class="product-manager respo-form-order">
    <TransitionWrapper>
      <component
        :is="currentComponent"
        :addedOrders="addedOrders"
        :addedFields="addedFields"
        @added-orders-updated="handleAddedOrdersUpdate"
        @updateFields="handleupdateFields"
      />
    </TransitionWrapper>
    <div class="arrows-tra">
      <button @click="navigateTo('previous')" class="arrow-tra left-arrow">
        &larr;
      </button>
      <div>
        <p>To Joker / Edit</p>
        <button @click="navigateTo('next')" class="arrow-tra right-arrow">
          &rarr;
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import TransitionWrapper from "@/shared/components/Transition/TransitionWrapper.vue";
import ProductManager from "@/components/orders/editOrder/productManger/ProductManager.vue";
import ProductEditPrices from "@/components/orders/editOrder/productManger/ProductEditPrices.vue";
import ProductJoker from "@/components/orders/editOrder/productManger/ProductJoker.vue";

export default {
  name: "ProductManagerWrapper",
  components: {
    TransitionWrapper,
  },
  props: {
    addedOrders: {
      type: Array,
      required: true,
    },
    addedFields: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentComponentIndex: 0,
      components: [ProductManager, ProductEditPrices, ProductJoker], // المكونات المتاحة
    };
  },
  computed: {
    currentComponent() {
      return this.components[this.currentComponentIndex];
    },
  },
  methods: {
    navigateTo(direction) {
      if (direction === "next") {
        this.currentComponentIndex =
          (this.currentComponentIndex + 1) % this.components.length;
      } else if (direction === "previous") {
        this.currentComponentIndex =
          (this.currentComponentIndex - 1 + this.components.length) %
          this.components.length;
      }
    },
    handleAddedOrdersUpdate(addedOrders) {
      // إعادة إرسال الحدث إلى المكون الأب
      this.$emit("added-orders-updated", addedOrders);
    },
    handleupdateFields(addedFields) {
      // إعادة إرسال الحدث إلى المكون الأب
      this.$emit("updateFields", addedFields);
    },
  },
};
</script>

<style scoped lang="scss">
.product-manager {
  position: relative;
}

.arrows-tra {
  position: absolute;
  left: 0px;
  bottom: 30px;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  width: 100%;
  height: 30px;
}

.arrows-tra > div {
  width: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  p {
    font-weight: 700;
  }
}

.arrow-tra {
  background: none !important;
  border: none;
  font-size: 24px !important;
  cursor: pointer;
}

.left-arrow {
  margin-left: 20px;
}

.right-arrow {
  margin-right: 10px;
}

@media (max-width: 477px) {
  .arrows-tra > div {
    width: 70%;
  }
  .arrows-tra {
    bottom: 10px;
  }
}
</style>
