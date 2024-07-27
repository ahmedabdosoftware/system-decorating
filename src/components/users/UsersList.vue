<template>
    <div :class="{ 'dark-mode': getDarkMode }" class="UsersList">
      <div class="users__table">
        <table class="table">
          <thead>
            <tr>
              <th> الصورة الشخصية</th>
              <th> الايميل</th>
              <th>رقم الهاتف</th>
              <th>الاسم</th>
              <th>الخيارات</th>
            </tr>
          </thead>
          <tbody>
            
            <tr v-for="(user, index) in users" :key="user.id">
              <td v-if="user.profileImageURL"><img class="profile" :src="user.profileImageURL" /></td>
              <td v-else><font-awesome-icon class="profile" icon="user-circle" /></td>
              <td class="email">{{ user.email }}</td>
              <td class="phone">{{ user.number }}</td>
              <td>{{user.name}}</td>
              <td class="actions">
                <DropdownMenu ref="dropdownMenu" :user="user" @closeOthers="openDropdownHandel(index)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
    import DropdownMenu from "@/components/users/DropdownMenu.vue";
  
  export default {
    name: "UsersList",
    components: {
      DropdownMenu,
    },
    props: ["users"],
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
  .UsersList {
    width: 100%;
    min-height: 150px;
    overflow: scroll;
  }
  .dark-mode {
    background-color: rgb(19, 19, 19);
  }
  .users__table {
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
  .profile {
    width: 30;
    height: 30px;
    border-radius:50%;
    margin-top: 10px;

}
@media (max-width: 477px){
  thead {
    
    th {
      font-size: 16px;
    }
  }
  .email,.phone{
    font-size: 11px;
  }
  
  }
  </style>
  