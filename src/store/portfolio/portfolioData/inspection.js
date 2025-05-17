import { defineStore } from "pinia";
import { db } from "@/firebase/firebaseConfig.js";

export const useInspectionStore = defineStore("inspectionStore", {
  state: () => ({
    requests: [],
    lastVisibleDoc: null,
    endReached: false,
    loading: false,
  }),

  actions: {
    async fetchRequests(companyName) {
      this.loading = true;
      try {
        const snapshot = await db
          .collection("portfolioInspectionRequests")
          .where("companyName", "==", companyName)
        //   .orderBy("createdAt", "desc")
          .limit(5)
          .get();

        this.requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        this.lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
        this.endReached = snapshot.docs.length < 5;
      } catch (err) {
        console.error("فشل في جلب الطلبات", err);
      } finally {
        this.loading = false;
      }
    },

    async loadMore(companyName) {
      if (this.endReached || !this.lastVisibleDoc) return;
      this.loading = true;

      try {
        const snapshot = await db
          .collection("portfolioInspectionRequests")
          .where("companyName", "==", companyName)
        //   .orderBy("createdAt", "desc")
          .startAfter(this.lastVisibleDoc)
          .limit(5)
          .get();

        const moreRequests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        this.requests.push(...moreRequests);

        this.lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
        this.endReached = snapshot.docs.length < 5;
      } catch (err) {
        console.error("خطأ في تحميل المزيد", err);
      } finally {
        this.loading = false;
      }
    },

    async searchRequests(companyName, searchQuery) {
      this.loading = true;
      try {
        let snapshot = await db
          .collection("portfolioInspectionRequests")
          .where("companyName", "==", companyName)
          .where("keywords", "array-contains", searchQuery.toLowerCase()) 
          .get();

        this.requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        this.lastVisibleDoc = null;
        this.endReached = true;
      } catch (err) {
        console.error("خطأ في البحث", err);
      } finally {
        this.loading = false;
      }
    },
    async addRequest(requestData) {
    try {
        const docRef = await db.collection("portfolioInspectionRequests").add({
        ...requestData,
        createdAt: new Date(),
        });
        this.requests.unshift({ id: docRef.id, ...requestData });
    } catch (err) {
        console.error("فشل في إضافة الطلب", err);
    }
    },

    async editRequest(updatedData) {
    try {
        const { id, ...data } = updatedData;
        await db.collection("portfolioInspectionRequests").doc(id).update(data);
        const index = this.requests.findIndex(req => req.id === id);
        if (index !== -1) {
        this.requests[index] = { id, ...data };
        }
    } catch (err) {
        console.error("فشل في تعديل الطلب", err);
    }
    },

    async deleteRequest(id) {
      try {
        await db.collection("portfolioInspectionRequests").doc(id).delete();
        this.requests = this.requests.filter(req => req.id !== id);
      } catch (err) {
        console.error("فشل في حذف الطلب", err);
      }
    },

    async updateRequestStatus(id, newStatus) {
      try {
        await db.collection("portfolioInspectionRequests").doc(id).update({
          status: newStatus,
        });
        const req = this.requests.find(req => req.id === id);
        if (req) req.status = newStatus;
      } catch (err) {
        console.error("فشل في تحديث الحالة", err);
      }
    },
  },
});
