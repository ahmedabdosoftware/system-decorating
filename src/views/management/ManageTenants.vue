<template>
  <v-app>
    <v-container style="background-color: #f7f7f9;">
      <v-card class="mx-auto my-5 elevation-3 rounded-lg" max-width="1000">
        <v-card-title class="primary white--text d-flex align-center py-4">
          <v-icon class="mr-2">mdi-account-group</v-icon> Tenants List
          <v-spacer></v-spacer>
          <v-btn icon class="white--text" @click="fetchUsers" :disabled="loading">
            <v-icon v-if="!loading">mdi-refresh</v-icon>
            <v-progress-circular v-else indeterminate size="24" color="white" />
          </v-btn>
        </v-card-title>

        <v-progress-linear v-if="loading" indeterminate color="primary" height="4" />

        <v-card-text class="pa-5">
          <v-row class="mb-4" align="center">
            <v-col cols="12" md="6">
              <v-text-field
                v-model="search"
                label="Search for a user..."
                prepend-inner-icon="mdi-magnify"
                outlined
                dense
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6" class="text-md-right text-left">
              <v-btn style="width: 180px; padding: 10px;" color="blue" dark @click="openAddDialog">
                <v-icon left>mdi-plus</v-icon> Add New Tenant
              </v-btn>
            </v-col>
          </v-row>

          <v-data-table
            :headers="headers"
            :items="subscriptionUsers"
            :items-per-page="itemsPerPage"
            :search="search"
            dense
            fixed-header
            height="400px"
            :loading="loading"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td class="text-center">{{ item.number }}</td>
                <td class="text-center">
                  <v-avatar size="30" style="background-color: #e0f2ff; color: #007acc; font-weight: bold;">
                    <template v-if="item.profileImageURL">
                      <img :src="item.profileImageURL" :alt="item.name" />
                    </template>
                    <template v-else>
                      {{ item.name.charAt(0).toUpperCase() }}
                    </template>
                  </v-avatar>
                </td>
                <td class="text-center">{{ item.name }}</td>
                <td class="text-center">{{ item.email }}</td>
                <td class="text-center">
                  <v-btn icon color="blue" @click="editUser(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon color="red" @click="confirmDeleteUser(item)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <v-btn icon color="green" @click="quickRenewUser(item)">
                    <v-icon>mdi-autorenew</v-icon>
                  </v-btn>
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
            />
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Add/Edit Dialog -->
      <v-dialog v-model="editDialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ userData.id ? 'Edit User' : 'Add New User' }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="userData.name" label="Name" outlined />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="userData.company_name" label="Company Name" outlined />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="userData.email" label="Email Address" outlined />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="userData.password" label="password" outlined />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="userData.number" label="Phone Number" outlined />
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="userData.subscription_type"
                    :items="['Portfolio', 'Full System']"
                    label="Subscription Type"
                    outlined
                  />
                </v-col>
                <v-col cols="12">
                <v-select
                  v-model="userData.template_id"
                  :items="templates"
                  item-value="id"
                  item-text="name"
                  label="Choose a Template"
                  outlined
                />
              </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="userData.subscription_start"
                    label="Start Date"
                    type="date"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="userData.subscription_end"
                    label="End Date"
                    type="date"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="userData.subscription_days"
                    label="Subscription Days"
                    type="number"
                    outlined
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-switch
                    v-model="userData.is_active"
                    label="Active Subscription"
                    inset
                    color="green"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="userData.notes" label="Additional Notes" outlined />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="green" @click="saveUser()">Save</v-btn>
            <v-btn color="grey" @click="editDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Delete Dialog -->
      <v-dialog v-model="deleteDialog" max-width="400px">
        <v-card>
          <v-card-title>Confirm Deletion</v-card-title>
          <v-card-text>
            Are you sure you want to delete user {{ selectedUser.name }}?
          </v-card-text>
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
import { mapActions, mapState } from "pinia";
import { useUserStore } from "@/store/auth/auth.js";
import { useGetUserStore } from "@/store/users/users.js";
import { useTemplateStore } from '@/store/portfolio/templates/templates';
export default {
  data() {
    return {
      page: 1,
      itemsPerPage: 6,
      search: "",
      loading: false,
      editDialog: false,
      deleteDialog: false,
      userData: {},
      selectedUser: {},
      headers: [
        { text: "Number", value: "number", align: "center" },
        { text: "Avatar", value: "avatar", align: "center" },
        { text: "Name", value: "name", align: "center" },
        { text: "Email", value: "email", align: "center" },
        { text: "Actions", value: "actions", align: "center", sortable: false },
      ],

    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.subscriptionUsers.length / this.itemsPerPage);
    },
    ...mapState(useGetUserStore, ["subscriptionUsers"]),
    ...mapState(useTemplateStore, ['templates']),

  },
  methods: {
    ...mapActions(useUserStore, ['registerUser']),
    ...mapActions(useGetUserStore, ['fetchUsers']),
    ...mapActions(useTemplateStore, ['fetchTemplates']),

    quickRenewUser(user) {
      const today = new Date();
      const startDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
      const endDate = new Date(today.setDate(today.getDate() + user.subscription_days)).toISOString().split('T')[0];

      const updatedUser = {
        ...user,
        subscription_start: startDate,
        subscription_end: endDate,
      };

      this.userData = updatedUser;
      this.saveUser(); // Use the existing save method to save it
    },

    openAddDialog() {
      this.userData = {};
      this.editDialog = true;
    },
   
    editUser(user) {
      this.userData = { ...user };
      console.log(this.userData)
      this.editDialog = true;
    },
    async saveUser() {
      // Update
      if(this.userData.id){
       // Update logic
      }else{
        try {
          this.loading = true;
          console.log(this.userData)
          await this.registerUser({role:"admin" ,...this.userData }); 
          this.editDialog = false;
        } catch (error) {
          console.error("Error while registering user:", error);
        } finally {
          this.loading = false;
        }
      }
    },
   
    confirmDeleteUser(user) {
      this.selectedUser = user;
      this.deleteDialog = true;
    },
    deleteUser() {
      // هتحط هنا لوجيك حذف المستخدم
      console.log("delete user function - to be implemented");
      this.deleteDialog = false;
    },
  },
  watch: {
    page() {
      this.fetchUsers();
    },
  },
  mounted() {
    this.fetchUsers();
    this.fetchTemplates(); 

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

