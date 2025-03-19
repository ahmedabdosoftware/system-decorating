<template>
  <div :class="{ 'dark-mode': getDarkMode }" class="ListTable">
    <div class="show__table">
      <table class="table">
        <thead>
          <tr>
            <th>تاريخ</th>
            <th>المكان</th>
            <th>المستحق</th>
            <th>الحالة</th>
            <th>الخيارات</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(transaction, index) in transactionsWithCalculatedTotal"
            :key="transaction.id"
          >
            <td>{{ transaction.date }}</td>
            <td>{{ transaction.location }}</td>
            <td>{{ transaction.totalAmount }}</td>
            <td>{{ transaction.status }}</td>
            <td class="actions">
              <DropdownMenu
                ref="dropdownMenu"
                :transaction="transaction"
                @closeOthers="openDropdownHandle(index)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import DropdownMenu from "@/components/users/financial/DropdownMenu.vue";
export default {
  name: "ListTable",
  components: {
    DropdownMenu,
  },
  props: ["transactions"],
  data() {
    return {
      openDropdownProp: null,
    };
  },
  computed: {
    getDarkMode() {
      return this.$store.state.darkMode;
    },
    transactionsWithCalculatedTotal() {
      // return New array after return right total
      return this.transactions.map((transaction) => {
        //  check  both first
        const bothType = transaction.typesData.find(
          (type) => type.type === "both"
        );
        if (bothType && bothType.totalAmount > 0) {
          return { ...transaction, totalAmount: bothType.totalAmount };
        }
        // NO BOTH? collect total from other kind
        const otherTypesTotal = transaction.typesData
          .filter((type) => type.type !== "both")
          .reduce((sum, type) => sum + Number(type.totalAmount), 0);

        return { ...transaction, totalAmount: otherTypesTotal };
      });
    },
  },
  methods: {
    openDropdownHandel(index) {
      if (this.openDropdownProp !== null && this.openDropdownProp !== index) {
        this.$refs.dropdownMenu[this.openDropdownProp].closeDropdown();
      }
      this.openDropdownProp = index;
    },
  },
};
</script>

<style scoped lang="scss">
// global style in path =>  src/scss/global/_globalStyle.scss
</style>
