<template>
  <div :class="{ 'dark-mode': getDarkMode }" class="ListTable">
    <div class="order__table">
      <table class="table">
        <thead>
          <tr>
            <th>تاريخ</th>
            <th>رقم الطلب </th>
            <th> العميل</th>
            <th>نوع الفاتورة</th>
            <th>الحالة</th>
            <th>الخيارات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in orders" :key="order.id">
            <td>{{ order.date }}</td>
            <td>{{ order.numberOfOrder }}</td>
            <td>{{ order.customerName }}</td>
            <td>{{order.invoiceType}}</td>
            <td>{{ getStatusText(order.status) }}</td>
            <td class="actions">
              <DropdownMenu ref="dropdownMenu" :order="order" @closeOthers="openDropdownHandel(index)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import DropdownMenu from "@/components/orders/DropdownMenu.vue";

export default {
  name: "ListTable",
  components: {
    DropdownMenu,
  },
  props: ["orders"],
  data() {
    return {
      openDropdownProp: null,
    };
  },
  computed: {
    getDarkMode() {
      return this.$store.state.darkMode;
    },
  },
  methods: {
    getStatusText(status) {
      switch (status) {
        case '0':
          return 'معلق';
        case '3':
            return 'منتهى';
        case '1':
            return 'مؤكد';
        default:
          return 'غير معروف';
      }
    },
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
.ListTable {
  width: 100%;
  min-height: 150px;
  overflow: scroll;
}
.dark-mode {
  background-color: rgb(19, 19, 19);
}
.order__table {
  width: 100%;
  min-height: 70px;
  .table {
    width: 100%;
    height: 100%;
    border-collapse: collapse;
    tr {
      height: 30px;
      td,
      th {
        text-align: center;
        text-transform: capitalize;
      }
    }
  }
}
thead {
  border-radius: 10px;
  background-color: var(--popularCalar);
  
  th {
    color: white;
    height: 40px;
  }
}
.actions {
  position: relative;
}
@media (max-width: 477px){
  thead {
    
    th {
     font-size: 16px;
    }
  }

}
</style>
