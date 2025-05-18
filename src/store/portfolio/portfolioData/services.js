// stores/useServicesStore.js

import { defineStore } from "pinia";
import { db } from "@/firebase/firebaseConfig.js";

export const useServicesStore = defineStore("services", {
  state: () => ({
    services: [],
    loading: false,
  }),

  actions: {
    async fetchServices(userId) {
      this.loading = true;
      try {
        const snapshot = await db
          .collection("portfolioServices")
          .where("userId", "==", userId)
          .get();

        this.services = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("خطأ أثناء جلب الخدمات:", error);
      } finally {
        this.loading = false;
      }
    },

    async addService(service) {
      this.loading = true;

      try {
        const newService = {
          ...service,
          createdAt: new Date(),
        };

        const docRef = await db.collection("portfolioServices").add(newService);
        this.services.push({ id: docRef.id, ...newService });
      } catch (error) {
        console.error("خطأ أثناء إضافة الخدمة:", error);
      }finally {
        this.loading = false;
      }
    },

    async updateService(serviceId, updatedData) {
      this.loading = true;

      try {
        await db.collection("portfolioServices").doc(serviceId).update(updatedData);
        const index = this.services.findIndex((s) => s.id === serviceId);
        if (index !== -1) {
          this.services[index] = { id: serviceId, ...updatedData };
        }
      } catch (error) {
        console.error("خطأ أثناء تحديث الخدمة:", error);
      }finally {
        this.loading = false;
      }
    },

    // حذف خدمة
    async deleteService(serviceId) {
      try {
        await db.collection("portfolioServices").doc(serviceId).delete();
        this.services = this.services.filter((s) => s.id !== serviceId);
      } catch (error) {
        console.error("خطأ أثناء حذف الخدمة:", error);
      }
    },
  },
});
