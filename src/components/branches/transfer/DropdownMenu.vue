<template>
  <div class="dropdown">
    <button class="dropbtn" @click="toggle">:</button>
    <div v-if="visible" class="dropdown-content">
      <a href="#" @click.prevent="delette(transfer)">
        <span>حذف</span>
        <font-awesome-icon class="icon" :icon="['fas', 'trash']" />
      </a>
    </div>
  </div>
</template>

<script>
// actions
import { mapActions } from "pinia";

//store
import { useBranchTransferStore } from "@/store/branches/transfer.js";

// sweetalert
import sweetalert from "sweetalert";

export default {
  emits: ["closeOthers"],
  name: "DropdownMenu",
  props: {
    transfer: Object,
  },
  data() {
    return {
      visible: false,
      layout: this.$route.meta.layout,
    };
  },

  computed: {},
  methods: {
    // ============ my actions => start =============================================
    ...mapActions(useBranchTransferStore, ["deleteTransfer"]),
    // ============ my actions => end ==============================================

    toggle() {
      this.visible = !this.visible;
      if (this.visible) {
        this.$emit("closeOthers");
      }
    },

    async delette(transfer) {
      try {
        console.log(transfer.id);
        await this.deleteTransfer(transfer.id);
        console.log("branch deleted from database");

        sweetalert({
          text: "transfer deleted successfully",
          icon: "success",
        });
      } catch (error) {
        console.error("Deletion failed", error);
        sweetalert({
          text: `Error: ${error.message}`,
          icon: "error",
        });
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
  min-height: 30px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  z-index: 1;
  padding-bottom: 10px;
}
.dropdown-content a {
  height: 30px;
  border-radius: 15px;
  color: rgb(31, 31, 48);
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  line-height: 5px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .icon,
  span {
    margin-right: 10px;
  }

  &:hover {
    background-color: #ddd;
  }
}
</style>
