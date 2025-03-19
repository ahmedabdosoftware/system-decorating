<template>
  <div class="dropdown">
    <button class="dropbtn" @click="toggle">:</button>
    <div v-if="visible" class="dropdown-content">
      <!-- تعديل -->
      <!-- <a href="#" @click.prevent="generateRoute('EditTransaction', transaction.id)">
          <span>تعديل</span>
          <font-awesome-icon class="icon" :icon="['fas', 'edit']" />
        </a> -->
      <!-- حذف -->
      <a href="#" @click.prevent="deleteSingleTransaction()">
        <span>حذف</span>
        <font-awesome-icon class="icon" :icon="['fas', 'trash']" />
      </a>
      <!-- إخفاء -->
      <a href="#" @click.prevent="hideSingleTransaction()">
        <span> {{ transaction.hidden ? "اظهار" : "اخفاء" }} </span>
        <font-awesome-icon class="icon" :icon="['fas', 'eye-slash']" />
      </a>
    </div>
  </div>
</template>

<script>
// actions , state
import { mapActions } from "pinia";
// store
import { useRandomTransactionsStore } from "@/store/transactions/randomTransactions.js";

export default {
  emits: ["closeOthers"],
  name: "DropdownMenu",
  props: {
    transaction: Object,
  },
  data() {
    return {
      visible: false,
      profileId: this.$route.params.profileId,
    };
  },
  methods: {
    ...mapActions(useRandomTransactionsStore, [
      "deleteTransaction",
      "hideTransaction",
    ]),

    toggle() {
      this.visible = !this.visible;
      if (this.visible) {
        this.$emit("closeOthers");
      }
    },

    closeDropdown() {
      this.visible = false;
    },

    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.closeDropdown();
      }
    },

    async deleteSingleTransaction() {
      console.log("its transaction", this.transaction);
      await this.deleteTransaction(
        this.transaction.id,
        this.transaction.type,
        this.profileId
      );
    },

    async hideSingleTransaction() {
      await this.hideTransaction(
        this.transaction.id,
        this.transaction.type,
        this.transaction,
        this.profileId
      );
    },

    generateRoute(route, id) {
      // منطق التوجيه
      console.log(`التوجيه إلى ${route} مع ID ${id}`);
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style scoped lang="scss">
.dropdown {
  position: relative;
  display: inline-block;
}
.dropbtn {
  cursor: pointer;
  font-size: 20px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  &:hover {
    background-color: rgb(192, 190, 186);
  }
}
.dropdown-content {
  position: absolute;
  right: 20px;
  background-color: white;
  min-width: 130px;
  min-height: 100px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  z-index: 1;
  padding-bottom: 10px;
}
.dropdown-content a {
  height: calc(100% / 2);
  border-radius: 15px;
  color: rgb(31, 31, 48);
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  line-height: 25px;

  .icon,
  span {
    margin-right: 10px;
  }

  &:hover {
    background-color: #ddd;
  }
}
</style>
