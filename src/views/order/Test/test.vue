<template>
  <v-app>
  <v-container>
    <v-card class="mx-auto my-5 elevation-3 rounded-lg" max-width="1000">
      <v-card-title class="primary white--text d-flex align-center py-4">
        <v-icon class="mr-2">mdi-account-group</v-icon> Users List
        <v-spacer></v-spacer>
        <v-btn
          icon
          class="white--text"
          @click="fetchUserss"
          :disabled="loading"
        >
          <v-icon v-if="!loading">mdi-refresh</v-icon>
          <v-progress-circular
            v-else
            indeterminate
            size="24"
            color="white"
          ></v-progress-circular>
        </v-btn>
      </v-card-title>

      <v-progress-linear
        v-if="loading"
        indeterminate
        color="primary"
        height="4"
      ></v-progress-linear>

      <v-card-text class="pa-5">
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              label="Search for a user..."
              prepend-inner-icon="mdi-magnify"
              outlined
              dense
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>

        <v-data-table
          :headers="headers"
          :items="users"
          :items-per-page="itemsPerPage"
          :server-items-length="totalUsers"
          :search="search"
          dense
          fixed-header
          height="400px"
          :loading="loading"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td class="text-center">{{ item.id }}</td>
              <td class="text-center">
                <v-avatar size="30">
                  <img :src="item.avatar" :alt="item.first_name" />
                </v-avatar>
              </td>
              <td class="text-center">{{ item.first_name }}</td>
              <td class="text-center">{{ item.last_name }}</td>
              <td class="text-center">{{ item.email }}</td>
              <td class="text-center">
                <v-btn icon color="blue" @click="editUser(item)"
                  ><v-icon>mdi-pencil</v-icon></v-btn
                >
                <v-btn icon color="red" @click="confirmDeleteUser(item)"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
              </td>
            </tr>
          </template>
        </v-data-table>

        <v-row justify="center" class="mt-5">
          <v-pagination
            v-model="page"
            :length="totalPages"
            total-visible="5"
            color="primary"
          ></v-pagination>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>Edit User</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editedUser.first_name"
            label="First Name"
            outlined
          ></v-text-field>
          <v-text-field
            v-model="editedUser.last_name"
            label="Last Name"
            outlined
          ></v-text-field>
          <v-text-field
            v-model="editedUser.email"
            label="Email"
            outlined
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" @click="saveUser">Save</v-btn>
          <v-btn color="grey" @click="editDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title>Confirm Deletion</v-card-title>
        <v-card-text
          >Are you sure you want to delete user
          {{ selectedUser.first_name }}?</v-card-text
        >
        <v-card-actions>
          <v-btn color="red" @click="deleteUser">Delete</v-btn>
          <v-btn color="grey" @click="deleteDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</v-app>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useUsersStore } from "@/store/Test/useUsersStore";

export default {
  data() {
    return {
      page: 1,
      itemsPerPage: 6,
      search: "",
      loading: false,
      editDialog: false,
      deleteDialog: false,
      editedUser: {},
      selectedUser: {},
      headers: [
        { text: "ID", value: "id", align: "center" },
        { text: "Avatar", value: "avatar", align: "center" },
        { text: "First Name", value: "first_name", align: "center" },
        { text: "Last Name", value: "last_name", align: "center" },
        { text: "Email", value: "email", align: "center" },
        { text: "Actions", value: "actions", align: "center", sortable: false },
      ],
    };
  },
  computed: {
    ...mapState(useUsersStore, ["users", "totalUsers"]),
    totalPages() {
      return Math.ceil(this.totalUsers / this.itemsPerPage);
    },
  },
  methods: {
    ...mapActions(useUsersStore, ["fetchUsers", "updateUser", "removeUser"]),
    async fetchUserss() {
      this.loading = true;
      await this.fetchUsers({
        page: this.page,
        itemsPerPage: this.itemsPerPage,
      });
      this.loading = false;
    },
    editUser(user) {
      this.editedUser = { ...user };
      this.editDialog = true;
    },
    async saveUser() {
      await this.updateUser(this.editedUser);
      this.editDialog = false;
      this.fetchUserss();
    },
    confirmDeleteUser(user) {
      this.selectedUser = user;
      this.deleteDialog = true;
    },
    async deleteUser() {
      await this.removeUser(this.selectedUser.id);
      this.deleteDialog = false;
      this.fetchUserss();
    },
  },
  watch: {
    page() {
      this.fetchUserss();
    },
  },
  mounted() {
    this.fetchUserss();
  },
};
</script>

<style scoped>
::v-deep(.v-text-field__slot input) {
  border: none !important;
  box-shadow: none !important;
}
::v-deep(.v-select.v-text-field input) {
  border: none !important;
}
::v-deep(.v-pagination) {
  border-radius: 8px;
  padding: 5px;
  background-color: #f5f5f5;
}
::v-deep(td .v-avatar img) {
  border-radius: 50%;
  object-fit: cover;
}
</style>
