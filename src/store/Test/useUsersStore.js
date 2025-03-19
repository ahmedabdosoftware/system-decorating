import { defineStore } from "pinia";
import axios from "axios";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [],
    totalPages: 1,
    totalUsers: 0,
    currentPage: 1,
    isLoading: false,
  }),

  actions: {
    async fetchUsers(page = 1) {
      this.isLoading = true;
      console.log("page", page.page);
      try {
        const response = await axios.get(`https://reqres.in/api/users`, {
          params: {
            page: page.page,
            per_page: page.itemsPerPage, // ✅ إرسال عدد العناصر لكل صفحة
          },
        });

        this.users = response.data.data;
        console.log(this.users);
        this.totalPages = response.data.total_pages;
        this.totalUsers = response.data.total; // ✅ تحديث العدد الإجمالي
        this.currentPage = page;
      } catch (error) {
        console.error("❌ Error fetching users:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async updateUser(user) {
      try {
        console.log(user.id);
        // استبدل هذا الرابط بـ رابط التعديل الفعلي في الـ API
        const res = await axios.put(
          `https://reqres.in/api/users/${user.id}`,
          user
        );
        console.log(res);
        alert("تم التعديل بنجاح!");
      } catch (error) {
        console.error("Error updating user:", error);
      }
    },

    async deleteUser(userId) {
      try {
        // استبدل هذا الرابط بـ رابط الحذف الفعلي في الـ API
        await axios.delete(`https://reqres.in/api/users/${userId}`);
        alert("تم الحذف بنجاح!");
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    },
  },
});
