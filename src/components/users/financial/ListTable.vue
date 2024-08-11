<template>
    <div :class="{ 'dark-mode': getDarkMode }" class="ListTable">
      <div class="transaction__table">
        <table class="table">
          <thead>
            <tr>
              <th>تاريخ</th>
              <th>المكان</th>
              <th> المستحق</th>
              <th>الحالة</th>
              <th>الخيارات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(transaction, index) in transactions" :key="transaction.id">
              <td>{{ transaction.date }}</td>
              <td>{{ transaction.adress }}</td>
              <td>{{ transaction.amount }}</td>
              <td>{{ transaction.status }}</td>
              <td class="actions">
                <DropdownMenu ref="dropdownMenu" :transaction="transaction" @closeOthers="openDropdownHandle(index)" />
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
  .ListTable {
    width: 100%;
    min-height: 150px;
    overflow: scroll;
  }
  .dark-mode {
    background-color: rgb(19, 19, 19);
  }
  .transaction__table {
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
  