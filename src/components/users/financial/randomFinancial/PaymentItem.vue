<template>
  <div class="payment-item">
    <!-- date -->
    <div class="payment-date">{{ data.date | formatDate }}</div>

    <!-- amount -->
    <div class="payment-amount">
      <span>{{ data.amount }}</span>
    </div>

    <!-- Note -->
    <div class="payment-note">
      <span>{{ data.notes }}</span>
    </div>

    <!-- DropdownMenu-->
    <DropdownMenu
      :transaction="data"
      @closeOthers="openDropdownHandle(data.id)"
      ref="dropdownMenu"
    />
  </div>
</template>

<script>
import DropdownMenu from "@/components/users/financial/randomFinancial/DropdownMenu.vue";

export default {
  name: "PaymentItem",
  components: { DropdownMenu },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      openDropdownProp: null,
    };
  },
  methods: {
    openDropdownHandle(index) {
      console.log("enter", this.openDropdownProp, index);
      if (this.openDropdownProp !== null && this.openDropdownProp !== index) {
        console.log("enter condition", this.openDropdownProp, index);
        this.$refs.dropdownMenu[this.openDropdownProp].closeDropdown();
      }
      this.openDropdownProp = index;
      console.log("openDropdown Prop", this.openDropdownProp);
    },
  },
};
</script>

<style scoped lang="scss">
.payment-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // background-color: #ffffff;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  gap: 10px; /* مسافة بين العناصر */

  .payment-date,
  .payment-amount,
  .payment-note {
    flex: 1;
    text-align: left;
    font-size: 0.9rem;
    color: #333;
    padding: 5px;
  }

  .payment-note {
    color: #555;
    font-style: italic;
    // background-color: red;
  }
}
</style>
