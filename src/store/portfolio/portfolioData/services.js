// stores/useServicesStore.js

import { defineStore } from "pinia";
import { db } from "@/firebase/firebaseConfig.js";

export const useServicesStore = defineStore("services", {
  state: () => ({
    services: [],
    loading: false,
    // For Website
    paginatedServices: [],  
    lastVisibleDoc: null,
    endReached: false,
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
 // ✅ For WEbsite Fetch First Amount
    async fetchInitialServices(userId) {
      this.loading = true;
      try {
        const snapshot = await db
          .collection("portfolioServices")
          .where("userId", "==", userId)
          // .orderBy("createdAt") 
          .limit(4)
          .get();

        this.paginatedServices = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        this.lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
        this.endReached = snapshot.docs.length < 4;
      } catch (error) {
        console.error("❌ فشل في جلب أول دفعة من الخدمات", error);
      } finally {
        this.loading = false;
      }
    },

    // ✅ Load More
    async loadMoreServices(userId) {
      if (this.endReached || !this.lastVisibleDoc) return;
      this.loading = true;

      try {
        const snapshot = await db
          .collection("portfolioServices")
          .where("userId", "==", userId)
          .startAfter(this.lastVisibleDoc)
          .limit(4)
          .get();

        const moreServices = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        this.paginatedServices.push(...moreServices);
        this.lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
        this.endReached = snapshot.docs.length < 4;
      } catch (error) {
        console.error("❌ خطأ في تحميل المزيد من الخدمات", error);
      } finally {
        this.loading = false;
      }
    },

    // ✅ See Less
    async resetServices(userId) {
      await this.fetchInitialServices(userId);
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
