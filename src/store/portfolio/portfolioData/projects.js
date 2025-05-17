import { defineStore } from "pinia";
import { db } from "@/firebase/firebaseConfig.js";

export const useProjectsStore = defineStore("projectsStore", {
  state: () => ({
    projects: [],
    lastVisibleDoc: null,
    endReached: false,
    loading: false,
  }),

  actions: {
    async fetchProjects(companyName) {
      this.loading = true;
      try {
        const snapshot = await db
          .collection("portfolioProjects")
          .where("companyName", "==", companyName)
          // .orderBy("createdAt", "desc")
          .limit(5)
          .get();

        this.projects = snapshot.docs.map(doc => ({  ...doc.data(),id: doc.id }));
        this.lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
        this.endReached = snapshot.docs.length < 5;
        console.log("pro",this.projects)
      } catch (err) {
        console.error("❌ فشل في جلب المشاريع", err);
      } finally {
        this.loading = false;
      }
    },

    async loadMore(companyName) {
      if (this.endReached || !this.lastVisibleDoc) return;
      this.loading = true;

      try {
        const snapshot = await db
          .collection("portfolioProjects")
          .where("companyName", "==", companyName)
          // .orderBy("createdAt", "desc")
          .startAfter(this.lastVisibleDoc)
          .limit(5)
          .get();

        const moreProjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        this.projects.push(...moreProjects);
        this.lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
        this.endReached = snapshot.docs.length < 5;
      } catch (err) {
        console.error("❌ خطأ في تحميل المزيد من المشاريع", err);
      } finally {
        this.loading = false;
      }
    },

    async searchProjects(companyName, searchQuery) {
      this.loading = true;
      try {
        const snapshot = await db
          .collection("portfolioProjects")
          .where("companyName", "==", companyName)
          .where("keywords", "array-contains", searchQuery.toLowerCase())
          .get();

        this.projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        this.lastVisibleDoc = null;
        this.endReached = true;
      } catch (err) {
        console.error("❌ خطأ في البحث عن المشاريع", err);
      } finally {
        this.loading = false;
      }
    },
    async searchProjectsByService(companyName, searchQuery) {
      this.loading = true;
      try {
        const snapshot = await db
          .collection("portfolioProjects")
          .where("companyName", "==", companyName)
          .where("keywordsService", "array-contains", searchQuery.toLowerCase())
          .get();

        this.projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        this.lastVisibleDoc = null;
        this.endReached = true;
      } catch (err) {
        console.error("❌ خطأ في البحث عن المشاريع", err);
      } finally {
        this.loading = false;
      }
    },

    async addProject(projectData) {
      try {
        const docRef = await db.collection("portfolioProjects").add({
          ...projectData,
          createdAt: new Date(),
        });
        this.projects.unshift({ id: docRef.id, ...projectData });
      } catch (err) {
        console.error("❌ فشل في إضافة المشروع", err);
      }
    },

    async updateProject(updatedData) {
      try {
        const { id, ...data } = updatedData;
        await db.collection("portfolioProjects").doc(id).update(data);
        const index = this.projects.findIndex(proj => proj.id === id);
        if (index !== -1) {
          this.projects[index] = { id, ...data };
        }
      } catch (err) {
        console.error("❌ فشل في تعديل المشروع", err);
      }
    },

    async deleteProject(id) {
      try {
        await db.collection("portfolioProjects").doc(id).delete();
        this.projects = this.projects.filter(proj => proj.id !== id);
      } catch (err) {
        console.error("❌ فشل في حذف المشروع", err);
      }
    },

    async uploadImageToImgBB(file) {
    const apiKey = 'a70bc1d60d105c80b4eb207fb2ca3ba1';
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
    throw new Error("رفع الصورة فشل");
    }

    return data.data.url;
    },

  },
});

